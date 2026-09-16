import type {
  CartProjection,
  Engine,
  Projection,
  Seed,
} from '../src/engine/contract';
import type { Fixture } from './validate';
import { lineKey, validateCart, validateProjection } from './validate';

export interface Difference {
  path: string;
  expected: unknown;
  actual: unknown;
}
export interface Replay {
  projection: Projection;
  checkpoints: { after_action: number; projection: CartProjection }[];
  differences: Difference[];
}

export function diff(expected: unknown, actual: unknown): Difference[] {
  const differences: Difference[] = [];
  const scenario =
    Boolean(
      expected && typeof expected === 'object' && 'decisions' in expected,
    ) || Boolean(actual && typeof actual === 'object' && 'decisions' in actual);
  for (const [label, value] of [
    ['expected', expected],
    ['actual', actual],
  ] as const) {
    try {
      if (scenario) validateProjection(value);
      else validateCart(value);
    } catch (error) {
      differences.push({
        path: `$validation.${label}`,
        expected: 'a complete valid projection',
        actual: error instanceof Error ? error.message : String(error),
      });
    }
  }
  if (differences.length) return differences;
  function compare(e: unknown, a: unknown, path: string): void {
    if (Object.is(e, a)) return;
    if (Array.isArray(e) && Array.isArray(a)) {
      if (path === '$.lines' || path === '$.coupons') {
        const key = (item: unknown): string => {
          const value = item as { ref: string; variant?: string; code: string };
          return path === '$.lines' ? lineKey(value) : value.code;
        };
        const em = new Map(e.map((item) => [key(item), item]));
        const am = new Map(a.map((item) => [key(item), item]));
        for (const id of new Set([...em.keys(), ...am.keys()]))
          compare(em.get(id), am.get(id), `${path}[${id}]`);
      } else {
        for (let i = 0; i < Math.max(e.length, a.length); i++)
          compare(e[i], a[i], `${path}[${i}]`);
      }
      return;
    }
    if (e && a && typeof e === 'object' && typeof a === 'object') {
      const er = e as Record<string, unknown>;
      const ar = a as Record<string, unknown>;
      for (const name of new Set([...Object.keys(er), ...Object.keys(ar)])) {
        if (
          /^\$\.decisions\[\d+\]$/.test(path) &&
          ['code', 'message'].includes(name) &&
          !(name in er)
        )
          continue;
        compare(er[name], ar[name], `${path}.${name}`);
      }
      return;
    }
    differences.push({
      path,
      expected: e === undefined ? { missing: true } : e,
      actual: a === undefined ? { missing: true } : a,
    });
  }
  compare(expected, actual, '$');
  return differences;
}

export function replay(engine: Engine, seed: Seed, fixture: Fixture): Replay {
  engine.reset(structuredClone(seed));
  const decisions: Projection['decisions'] = [];
  const checkpoints: Replay['checkpoints'] = [];
  const differences: Difference[] = [];
  for (const [index, action] of fixture.actions.entries()) {
    const result = engine.dispatch(structuredClone(action));
    decisions.push({ ...result, action_index: index });
    const checkpoint = fixture.checkpoints?.find(
      (item) => item.after_action === index,
    );
    if (checkpoint) {
      const projection = engine.snapshot();
      validateCart(projection);
      checkpoints.push({ after_action: index, projection });
      differences.push(
        ...diff(checkpoint.expected, projection).map((d) => ({
          ...d,
          path: `checkpoints[${index}]${d.path}`,
        })),
      );
    }
  }
  const projection: Projection = { ...engine.snapshot(), decisions };
  validateProjection(projection, fixture.actions.length);
  if (fixture.expected) differences.push(...diff(fixture.expected, projection));
  return { projection, checkpoints, differences };
}
