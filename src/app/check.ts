/** `blocked` means the endpoint writes data and the environment is read-only. */
export type CheckState = 'idle' | 'checking' | 'up' | 'failing' | 'unreachable' | 'skipped' | 'blocked';

export interface CheckResult {
  state: CheckState;
  status?: number;
  ms?: number;
  /** The error from the response, or why a step didn't run. */
  message?: string;
}

export interface Reply {
  /** 0 means nothing answered. */
  status: number;
  ms: number;
  body: unknown;
}

interface SendOptions {
  method?: string;
  body?: object;
  token?: string;
}

const TIMEOUT_MS = 10_000;

export async function send(url: string, { method = 'GET', body, token }: SendOptions = {}): Promise<Reply> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await res.text();
    return { status: res.status, ms: elapsed(), body: parse(text) };
  } catch {
    return { status: 0, ms: elapsed(), body: null };
  }
}

export function toResult(reply: Reply, ok: boolean): CheckResult {
  if (reply.status === 0) return { state: 'unreachable' };
  return {
    state: ok ? 'up' : 'failing',
    status: reply.status,
    ms: reply.ms,
    message: ok ? undefined : describe(reply),
  };
}

function parse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Pulls a readable error out of a JSON body or Express's default HTML error page. */
function describe({ status, body }: Reply): string {
  if (body && typeof body === 'object') {
    const { message, error } = body as { message?: string; error?: string };
    return message ?? error ?? `HTTP ${status}`;
  }
  if (typeof body === 'string' && body) {
    const text = new DOMParser().parseFromString(body, 'text/html').body.textContent ?? '';
    return text.split(/\s+at\s/)[0].trim().slice(0, 200) || `HTTP ${status}`;
  }
  return `HTTP ${status}`;
}
