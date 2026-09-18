import { expect, it } from 'vitest';
import { createEngine } from '../src/engine';
import type { Action } from '../src/engine/contract';
import { accept, coffee, discovery } from './engine-support';

it.each([
  null,
  [],
  { type: 'checkout' },
  { type: 'add', ...coffee },
  { type: 'add', ...coffee, qty: 0 },
  { type: 'set_qty', ...coffee, qty: -1 },
  { type: 'set_qty', ...coffee, qty: 1.5 },
  { type: 'set_qty', ref: 'spatules', qty: Number.NaN },
  { type: 'add', ref: 'spatules', qty: Number.MAX_SAFE_INTEGER + 1 },
  { type: 'add', ref: 'UNKNOWN', qty: 1 },
  { type: 'add', ref: coffee.ref, variant: 'unknown', qty: 1 },
  { type: 'add', ref: coffee.ref, qty: 1 },
  { type: 'remove', ...coffee, fee: 3 },
  { type: 'remove_coupon', code: '' },
  { type: 'set_qty', ref: 'spatules', qty: 3 },
])(
  'invalid input refuses without changing a populated discounted cart: %j',
  (input) => {
    const engine = createEngine();
    engine.reset(discovery().seed);
    accept(engine);
    const before = engine.snapshot();
    expect(engine.dispatch(input as Action)).toEqual({
      accepted: false,
      code: 'OUT_OF_SCOPE',
    });
    expect(engine.snapshot()).toEqual(before);
    accept(engine, [{ type: 'set_qty', ref: 'spatules', qty: 2 }]);
    expect(engine.snapshot().totals.total_items).toBe(1196);
  },
);

it('captured quantity and unknown-coupon refusals are exact and leave state unchanged', () => {
  const { seed, fixture } = discovery();
  const engine = createEngine();
  engine.reset(seed);
  accept(engine);
  for (const index of [3, 5]) {
    const action = fixture.actions[index];
    const decision = fixture.expected?.decisions[index];
    if (!action || !decision) throw new Error('Missing captured decision');
    const { action_index: _index, ...expected } = decision;
    const before = engine.snapshot();
    expect(engine.dispatch(action)).toEqual(expected);
    expect(engine.snapshot()).toEqual(before);
  }
});

it('duplicate coupon and sold-individually add refusals preserve existing state', () => {
  const engine = createEngine();
  engine.reset(discovery().seed);
  accept(engine);
  const before = engine.snapshot();
  for (const action of [
    { type: 'apply_coupon', code: 'decouverte10' },
    { type: 'remove_coupon', code: 'not-applied' },
    { type: 'add', ...coffee, qty: 1 },
  ] satisfies Action[]) {
    expect(engine.dispatch(action).accepted).toBe(false);
    expect(engine.snapshot()).toEqual(before);
  }
});

it('ineligible coupon and missing-line mutations refuse without inserting lines', () => {
  const engine = createEngine();
  engine.reset(discovery().seed);
  accept(engine, [{ type: 'add', ref: 'spatules', qty: 1 }]);
  const before = engine.snapshot();
  for (const action of [
    { type: 'apply_coupon', code: 'DECOUVERTE10' },
    { type: 'set_qty', ...coffee, qty: 1 },
    { type: 'remove', ...coffee },
  ] satisfies Action[]) {
    expect(engine.dispatch(action).accepted).toBe(false);
    expect(engine.snapshot()).toEqual(before);
  }
});
