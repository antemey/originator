import { expect, it } from 'vitest';
import { replay } from '../harness/compare';
import { createEngine } from '../src/engine';
import type { Action } from '../src/engine/contract';
import { example, syntheticSeed } from './helpers';

it('stub contract: refusal leaves cart unchanged and remains in scenario decisions', () => {
  const engine = createEngine();
  engine.reset(syntheticSeed());
  const before = engine.snapshot();
  const output = replay(engine, syntheticSeed(), example());
  expect(engine.snapshot()).toEqual(before);
  expect(output.projection.decisions).toEqual([
    { action_index: 0, accepted: false, code: 'NOT_IMPLEMENTED' },
  ]);
});
it.each([
  { type: 'checkout' },
  { type: 'add', ref: 'SYNTHETIC-ITEM', qty: 0 },
  { type: 'add', ref: 'UNKNOWN', qty: 1 },
  { type: 'remove', ref: 'SYNTHETIC-ITEM', fee: 3 },
])(
  'stub contract: out-of-scope input is refused without mutation: %j',
  (input) => {
    const engine = createEngine();
    engine.reset(syntheticSeed());
    const before = engine.snapshot();
    expect(engine.dispatch(input as Action)).toEqual({
      accepted: false,
      code: 'OUT_OF_SCOPE',
    });
    expect(engine.snapshot()).toEqual(before);
  },
);
