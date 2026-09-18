import { join } from 'node:path';
import { expect } from 'vitest';
import { repoRoot } from '../harness/paths';
import { loadFixture, loadSeed } from '../harness/validate';
import type { Action, Engine } from '../src/engine';

export function discovery(id = 'target-transitions') {
  const fixture = loadFixture(join(repoRoot, `fixtures/discovery/${id}.json`));
  return { fixture, seed: loadSeed(repoRoot, fixture) };
}

export const coffee = { ref: 'cafe-decouverte', variant: '250g-grains' };
export const mixed: Action[] = [
  { type: 'add', ...coffee, qty: 1 },
  { type: 'add', ref: 'spatules', qty: 1 },
  { type: 'apply_coupon', code: 'DECOUVERTE10' },
];

export function accept(engine: Engine, actions: Action[] = mixed): void {
  for (const action of actions)
    expect(engine.dispatch(action)).toEqual({ accepted: true });
}
