import { computed, signal } from '@angular/core';
import { CheckResult, send, toResult } from './check';
import { ALL_ENDPOINTS, Endpoint, HEALTH_ID } from './endpoints';
import { Environment } from './environments';

export type Overall = 'checking' | 'operational' | 'degraded' | 'offline';

const PROBED = ALL_ENDPOINTS.filter((ep) => ep.probe);

/** The automatic read-only checks for one environment. Safe to run against prod. */
export class HealthChecks {
  private readonly results = signal<ReadonlyMap<string, CheckResult>>(new Map());
  readonly checking = signal(false);
  readonly lastChecked = signal<Date | null>(null);

  readonly overall = computed<Overall>(() => {
    const results = this.results();
    if (results.size === 0) return 'checking';
    if (results.get(HEALTH_ID)?.state !== 'up') return 'offline';
    const broken = [...results.values()].some((r) => r.state === 'failing' || r.state === 'unreachable');
    return broken ? 'degraded' : 'operational';
  });

  /** Checks that actually ran; a check is skipped when there's no record to look up. */
  private readonly ran = computed(() => [...this.results().values()].filter((r) => r.state !== 'skipped'));
  readonly total = computed(() => this.ran().length);
  readonly passing = computed(() => this.ran().filter((r) => r.state === 'up').length);

  constructor(private readonly env: Environment) {}

  result(ep: Endpoint): CheckResult {
    return this.results().get(ep.id) ?? { state: 'checking' };
  }

  async checkAll(): Promise<void> {
    if (this.checking()) return;
    this.checking.set(true);

    const outcomes = await Promise.all(PROBED.map((ep) => this.probe(ep)));

    // If the health check fails the server itself is down, so other failures are just noise.
    const healthUp = outcomes[PROBED.findIndex((ep) => ep.id === HEALTH_ID)].state === 'up';
    this.results.set(
      new Map(
        PROBED.map((ep, i): [string, CheckResult] => [ep.id, healthUp ? outcomes[i] : { state: 'unreachable' }]),
      ),
    );
    this.lastChecked.set(new Date());
    this.checking.set(false);
  }

  private async probe(ep: Endpoint): Promise<CheckResult> {
    const probe = ep.probe!;
    let path = probe.path;

    if (probe.idFrom) {
      const list = await send(this.env.base + probe.idFrom);
      const first: unknown = Array.isArray(list.body) ? list.body[0] : undefined;
      const id = (first as { id?: unknown } | undefined)?.id;
      if (typeof id !== 'number') {
        const listed = list.status >= 200 && list.status < 300;
        return { state: 'skipped', message: listed ? 'Nothing to look up yet' : 'Could not get an id to look up' };
      }
      path = path.replace(':id', String(id));
    }

    const reply = await send(this.env.base + path);
    return toResult(reply, probe.expect.includes(reply.status));
  }
}
