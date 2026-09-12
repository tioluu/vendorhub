import { computed, signal } from '@angular/core';
import { CheckResult, Reply, send, toResult } from './check';
import { ALL_ENDPOINTS, Endpoint } from './endpoints';
import { Environment } from './environments';

/** Everything without a read-only probe writes data or needs a login, so the full test covers it. */
const TESTED = ALL_ENDPOINTS.filter((ep) => !ep.probe);

interface StepOptions {
  token?: string;
  body?: object;
  /** Fills the `:id` in the endpoint's path. */
  pathId?: number;
}

/**
 * Exercises every endpoint that writes data using a throwaway vendor: sign up, log in, create a
 * store, category and product, edit them, then delete it all again. Never run this against prod.
 */
export class FullTest {
  private readonly results = signal<ReadonlyMap<string, CheckResult>>(new Map());
  readonly running = signal(false);
  readonly lastRun = signal<Date | null>(null);
  /** Test data the run couldn't delete again. */
  readonly leftovers = signal<string[]>([]);
  readonly total = TESTED.length;
  readonly passed = computed(() => [...this.results().values()].filter((r) => r.state === 'up').length);

  constructor(private readonly env: Environment) {}

  result(ep: Endpoint): CheckResult {
    return this.results().get(ep.id) ?? { state: 'idle' };
  }

  async run(): Promise<void> {
    if (this.running()) return;
    this.running.set(true);
    this.results.set(new Map());
    this.leftovers.set([]);

    const stamp = Date.now();
    const name = `Status check ${stamp}`;
    const email = `status-check-${stamp}@example.test`;
    const password = crypto.randomUUID();

    let vendorCreated = false;
    let storeCreated = false;
    let token: string | undefined;
    let categoryId: number | undefined;
    let productId: number | undefined;

    try {
      vendorCreated = !!(await this.step('register', { body: { fullName: 'Status Check', email, password } }));
      if (!vendorCreated) return;

      const login = await this.step('login', { body: { email, password } });
      token = read<string>(login, 'token');
      if (login && !token) this.fail('login', 'Response had no token');
      if (!token) return;

      await this.step('me', { token });
      await this.step('forgot-password', { body: { email } });

      storeCreated = !!(await this.step('create-store', { token, body: { name } }));
      if (storeCreated) {
        await this.step('customize-store', {
          token,
          body: { fontFamily: 'Inter', backgroundColor: '#FAF9F5', foregroundColor: '#141413' },
        });
      }

      const category = await this.step('create-category', { token, body: { name } });
      categoryId = read<number>(category, 'category', 'id');

      if (storeCreated) {
        const categories = categoryId === undefined ? [] : [categoryId];
        const product = await this.step('create-product', { token, body: { name, price: 1000, categories } });
        productId = read<number>(product, 'id');
      }
      if (productId !== undefined) {
        await this.step('edit-product', {
          token,
          pathId: productId,
          body: { name: `${name} (edited)`, price: 1200, categories: [] },
        });
      }
    } finally {
      // Clean up in reverse order: a store can't be deleted while it still has products,
      // and a vendor can't be deleted while it still has a store.
      const leftovers: string[] = [];
      if (productId !== undefined && !(await this.step('delete-product', { token, pathId: productId }))) {
        leftovers.push(`product #${productId}`);
      }
      if (categoryId !== undefined && !(await this.step('delete-category', { token, pathId: categoryId }))) {
        leftovers.push(`category #${categoryId}`);
      }
      if (storeCreated && !(await this.step('delete-store', { token, body: { name } }))) {
        leftovers.push(`store "${name}"`);
      }
      if (vendorCreated && !(token && (await this.step('delete-account', { token })))) {
        leftovers.push(`vendor ${email}`);
      }

      this.markSkipped();
      this.leftovers.set(leftovers);
      this.lastRun.set(new Date());
      this.running.set(false);
    }
  }

  private async step(endpointId: string, { token, body, pathId }: StepOptions = {}): Promise<Reply | null> {
    const ep = TESTED.find((e) => e.id === endpointId);
    if (!ep) throw new Error(`No tested endpoint with id "${endpointId}"`);
    const path = pathId === undefined ? ep.path : ep.path.replace(':id', String(pathId));

    this.set(endpointId, { state: 'checking' });
    const reply = await send(this.env.base + path, { method: ep.method, token, body });
    const ok = reply.status >= 200 && reply.status < 300;
    this.set(endpointId, toResult(reply, ok));
    return ok ? reply : null;
  }

  private fail(endpointId: string, message: string): void {
    this.set(endpointId, { ...this.results().get(endpointId), state: 'failing', message });
  }

  private set(endpointId: string, result: CheckResult): void {
    this.results.update((results) => new Map(results).set(endpointId, result));
  }

  private markSkipped(): void {
    this.results.update((results) => {
      const next = new Map(results);
      for (const ep of TESTED) {
        if (!next.has(ep.id)) next.set(ep.id, { state: 'skipped', message: 'Skipped because an earlier step failed' });
      }
      return next;
    });
  }
}

/** Reads a nested field from a JSON reply, e.g. read(reply, 'category', 'id'). */
function read<T>(reply: Reply | null, ...keys: string[]): T | undefined {
  let value: unknown = reply?.body;
  for (const key of keys) {
    if (!value || typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value as T | undefined;
}
