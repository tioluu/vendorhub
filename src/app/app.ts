import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CheckResult, CheckState } from './check';
import { ENDPOINT_GROUPS, Endpoint } from './endpoints';
import { ENVIRONMENTS, EnvId, Environment } from './environments';
import { FullTest } from './full-test';
import { HealthChecks, Overall } from './health-checks';

const REFRESH_MS = 30_000;

const OVERALL_LABELS: Record<Overall, string> = {
  checking: 'Checking the API…',
  operational: 'All checks passing',
  degraded: 'Some checks failing',
  offline: 'API is offline',
};

const STATE_LABELS: Record<CheckState, string> = {
  idle: 'Not run',
  checking: 'Checking',
  up: 'OK',
  failing: 'Failed',
  unreachable: 'Unreachable',
  skipped: 'Skipped',
  blocked: 'Not allowed',
};

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly environments = ENVIRONMENTS;
  protected readonly groups = ENDPOINT_GROUPS;
  protected readonly overallLabels = OVERALL_LABELS;
  protected readonly stateLabels = STATE_LABELS;
  protected readonly selected = signal<Environment>(ENVIRONMENTS[0]);

  protected readonly checks = Object.fromEntries(
    ENVIRONMENTS.map((env) => [env.id, new HealthChecks(env)]),
  ) as Record<EnvId, HealthChecks>;

  /** The full test writes data, so read-only environments don't get one. */
  protected readonly tests = Object.fromEntries(
    ENVIRONMENTS.filter((env) => !env.readOnly).map((env) => [env.id, new FullTest(env)]),
  ) as Partial<Record<EnvId, FullTest>>;

  constructor() {
    const checkAll = () => ENVIRONMENTS.forEach((env) => this.checks[env.id].checkAll());
    checkAll();
    const timer = setInterval(checkAll, REFRESH_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected resultFor(env: Environment, ep: Endpoint): CheckResult {
    if (ep.probe) return this.checks[env.id].result(ep);
    const test = this.tests[env.id];
    return test ? test.result(ep) : { state: 'blocked' };
  }

  protected detail(env: Environment, result: CheckResult): string {
    switch (result.state) {
      case 'up':
      case 'failing':
        return `${result.status} · ${result.ms} ms`;
      case 'unreachable':
        return 'No response';
      case 'idle':
        return 'Run the full test';
      case 'blocked':
        return `${env.name} is read-only`;
      default:
        return '';
    }
  }
}
