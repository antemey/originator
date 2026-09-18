import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import {
  assertPreparationReady,
  preparationReport,
} from '../harness/check-preparation';
import { repoRoot } from '../harness/paths';
import { example, syntheticSeed } from './helpers';

const temporary: string[] = [];
afterEach(() => {
  for (const root of temporary.splice(0)) rmSync(root, { recursive: true });
});
function setup() {
  const root = mkdtempSync(join(tmpdir(), 'originator-preparation-'));
  temporary.push(root);
  mkdirSync(join(root, 'target/lab'), { recursive: true });
  mkdirSync(join(root, 'fixtures/discovery'), { recursive: true });
  cpSync(join(repoRoot, 'target/seed.json'), join(root, 'target/seed.json'));
  const write = (path: string, value: unknown) =>
    writeFileSync(join(root, path), JSON.stringify(value));
  const fixture = {
    ...example(),
    id: 'direct',
    provenance: 'target',
    seed_file: 'target/seed.json',
    source: {
      date: '2026-09-18T00:00:00Z',
      url: 'https://synthetic.invalid',
      capture_hash: 'a'.repeat(64),
      action_channel: 'synthetic test only',
    },
  };
  return { root, write, fixture };
}
it('reports the empty setup truthfully and refuses a lab-only corpus', () => {
  const { root, write, fixture } = setup();
  expect(preparationReport(root).blockers).toHaveLength(2);
  write('target/seed.json', syntheticSeed());
  write('target/lab/test.json', syntheticSeed());
  write('fixtures/discovery/lab.json', {
    ...fixture,
    id: 'lab',
    provenance: 'lab',
    seed_file: 'target/lab/test.json',
    source: { ...fixture.source, woo_version: 'synthetic' },
  });
  expect(() => assertPreparationReady(root)).toThrow('direct-target');
});
it('accepts complete temporary references structurally without executing their expected engine outcomes', () => {
  const { root, write, fixture } = setup();
  write('target/seed.json', syntheticSeed());
  write('fixtures/discovery/direct.json', fixture);
  expect(preparationReport(root)).toMatchObject({
    counts: { target: 1, seeds: 1 },
    blockers: [],
    engine_fidelity: 'not evaluated',
  });
});
it('rejects missing expectations, decisions, provenance, explicit seeds and seed-context mismatches', () => {
  const { root, write, fixture } = setup();
  write('target/seed.json', syntheticSeed());
  for (const bad of [
    { ...fixture, expected: undefined },
    { ...fixture, expected: { ...fixture.expected, decisions: [] } },
    { ...fixture, source: { date: fixture.source.date } },
    { ...fixture, seed_file: undefined },
    { ...fixture, context: { ...fixture.context, country: 'US' } },
  ]) {
    write('fixtures/discovery/direct.json', bad);
    expect(() => preparationReport(root)).toThrow();
  }
});
it('validates every seed and refuses lab fallback to the café seed', () => {
  const { root, write, fixture } = setup();
  write('target/seed.json', syntheticSeed());
  write('fixtures/discovery/direct.json', fixture);
  write('target/lab/invalid.json', {});
  expect(() => preparationReport(root)).toThrow();
  write('target/lab/invalid.json', syntheticSeed());
  write('fixtures/discovery/lab.json', {
    ...fixture,
    id: 'lab',
    provenance: 'lab',
    source: { ...fixture.source, woo_version: 'synthetic' },
  });
  expect(() => preparationReport(root)).toThrow('separate');
  expect(
    readFileSync(join(root, 'fixtures/discovery/direct.json'), 'utf8'),
  ).toContain('synthetic.invalid');
});
