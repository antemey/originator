import { expect, it } from 'vitest';
import { replay } from '../harness/compare';
import { createEngine } from '../src/engine';
import { minor } from '../src/engine/money';
import { example, syntheticSeed } from './helpers';

it('stub contract: reset and replay produce identical computed output', () => {
  const engine = createEngine();
  const fixture = example();
  const seed = syntheticSeed();
  expect(replay(engine, seed, fixture)).toEqual(replay(engine, seed, fixture));
});
it('stub contract: snapshots and reset seeds do not expose mutable state', () => {
  const engine = createEngine();
  const seed = syntheticSeed();
  engine.reset(seed);
  seed.products.length = 0;
  const snapshot = engine.snapshot();
  snapshot.totals.total_items = minor(999);
  expect(engine.snapshot().totals.total_items).toBe(0);
  expect(
    engine.dispatch({ type: 'add', ref: 'SYNTHETIC-ITEM', qty: 1 }),
  ).toEqual({ accepted: false, code: 'NOT_IMPLEMENTED' });
});
