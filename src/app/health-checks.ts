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
  readonly total = PROBED.length;

  readonly overall = computed<Overall>(() => {
    const results = this.results();
    if (results.size === 0) return 'checking';
    if (results.get(HEALTH_ID)?.state !== 'up') return 'offline';
    return [...results.values()].some((r) => r.state !== 'up') ? 'degraded' : 'operational';
  });

  readonly passing = computed(() => [...this.results().values()].filter((r) => r.state === 'up').length);

  constructor(private readonly env: Environment) {}

  result(ep: Endpoint): CheckResult {
    return this.results().get(ep.id) ?? { state: 'checking' };
  }

  async checkAll(): Promise<void> {
    if (this.checking()) return;
    this.checking.set(true);

    const outcomes = await Promise.all(
      PROBED.map(async (ep) => {
        const reply = await send(this.env.base + ep.probe!.path);
        return toResult(reply, ep.probe!.expect.includes(reply.status));
      }),
    );

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
}
