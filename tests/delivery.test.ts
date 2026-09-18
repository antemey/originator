import { expect, it } from 'vitest';
import {
  assertReportReady,
  packagingPath,
  validatePlan,
  validateRecipeSelection,
} from '../scripts/delivery';

it('cannot present the setup-only write-up as a completed replication', () => {
  expect(() =>
    assertReportReady(
      '# Target, slice and reasoning\n\n# Candidate approaches and trade-offs\n',
    ),
  ).toThrow();
});
it('requires reviewed hashes, real held-out imports and a frozen SHA', () => {
  expect(() => validatePlan({})).toThrow();
  expect(() =>
    validatePlan({
      freeze_commit: 'a'.repeat(40),
      redaction_reviewed: true,
      sensitive_keys_reviewed: true,
      heldout: [],
      probes: [],
    }),
  ).toThrow('real held-out');
});
it('limits packaging changes to reports and evidence', () => {
  expect(packagingPath('WRITEUP.md')).toBe(true);
  expect(packagingPath('fixtures/held-out/observed.json')).toBe(true);
  for (const path of [
    'src/engine/index.ts',
    'target/seed.json',
    'tests/harness.test.ts',
    'scripts/delivery.ts',
    '.codex/config.toml',
  ])
    expect(packagingPath(path)).toBe(false);
});

// Temporary synthetic recipe/capture trees only; never the project's reserved data.
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach } from 'vitest';
import { sha256 } from '../harness/checksums';
import { fingerprints, frozenPaths } from '../harness/freeze';
import { assertRecipeMatches, createCaptureFreeze } from '../scripts/delivery';
import { example, syntheticSeed } from './helpers';

const temporary: string[] = [];
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true });
});
function freezeSetup() {
  const parent = mkdtempSync(join(tmpdir(), 'originator-freeze-'));
  temporary.push(parent);
  const root = join(parent, 'repo');
  for (const path of frozenPaths) {
    const directory = [
      'ai/traces/discovery',
      'research/seed',
      'src',
      'target',
      'harness',
      'tests',
      'scripts',
      'ai/roles',
      'fixtures/discovery',
    ].includes(path);
    mkdirSync(directory ? join(root, path) : dirname(join(root, path)), {
      recursive: true,
    });
    if (!directory) writeFileSync(join(root, path), 'synthetic');
  }
  mkdirSync(join(root, '.delivery'));
  mkdirSync(join(parent, 'held-out/recipes'), { recursive: true });
  writeFileSync(
    join(root, 'target/seed.json'),
    JSON.stringify(syntheticSeed()),
  );
  const fixture = {
    ...example(),
    id: 'case',
    provenance: 'target' as const,
    seed_file: 'target/seed.json',
  };
  const { expected: _expected, checkpoints: _checkpoints, ...recipe } = fixture;
  const source = '../held-out/recipes/case.json';
  writeFileSync(join(root, source), JSON.stringify(recipe));
  writeFileSync(
    join(root, '.delivery/recipes.json'),
    JSON.stringify([{ source, sha256: sha256(JSON.stringify(recipe)) }]),
  );
  return { root, fixture, source };
}
it('records the freeze before outcomes exist and cannot overwrite it on resume', () => {
  const { root, fixture, source } = freezeSetup();
  const freeze = createCaptureFreeze(root, 'a'.repeat(40));
  const before = readFileSync(join(root, '.delivery/freeze.json'), 'utf8');
  const capture = {
    ...fixture,
    source: { ...fixture.source, date: freeze.frozen_at },
  };
  expect(() =>
    assertRecipeMatches(
      root,
      freeze,
      {
        source: '../held-out/case.json',
        sha256: 'b'.repeat(64),
        recipe_file: source,
      },
      capture,
    ),
  ).not.toThrow();
  expect(() => createCaptureFreeze(root, 'b'.repeat(40))).toThrow();
  expect(readFileSync(join(root, '.delivery/freeze.json'), 'utf8')).toBe(
    before,
  );
  expect(
    JSON.parse(readFileSync(join(root, '.delivery/state.json'), 'utf8')),
  ).toEqual({ stage: 'frozen' });
});
it('rejects earlier captures, altered recipes, and changed ordered actions', () => {
  const { root, fixture, source } = freezeSetup();
  const freeze = createCaptureFreeze(root, 'a'.repeat(40));
  const item = {
    source: '../held-out/case.json',
    sha256: 'b'.repeat(64),
    recipe_file: source,
  };
  expect(() => assertRecipeMatches(root, freeze, item, fixture)).toThrow(
    'predates',
  );
  const capture = {
    ...fixture,
    source: { ...fixture.source, date: freeze.frozen_at },
  };
  expect(() =>
    assertRecipeMatches(root, freeze, item, { ...capture, actions: [] }),
  ).toThrow('actions');
  writeFileSync(join(root, source), '{}');
  expect(() => assertRecipeMatches(root, freeze, item, capture)).toThrow(
    'changed',
  );
});
it('freezes discovery additions and executable Git hooks as well as engine/configuration', () => {
  const { root } = freezeSetup();
  const freeze = createCaptureFreeze(root, 'a'.repeat(40));
  writeFileSync(join(root, 'fixtures/discovery/new.json'), '{}');
  expect(fingerprints(root)).not.toEqual(freeze.hashes);
  rmSync(join(root, 'fixtures/discovery/new.json'));
  mkdirSync(join(root, 'scripts/git-hooks'), { recursive: true });
  writeFileSync(join(root, 'scripts/git-hooks/pre-commit'), 'changed');
  expect(fingerprints(root)).not.toEqual(freeze.hashes);
});

it('requires all registered recipes exactly once, without silent selection changes', () => {
  const { root, source } = freezeSetup();
  const freeze = createCaptureFreeze(root, 'a'.repeat(40));
  const item = {
    source: '../held-out/case.json',
    sha256: 'b'.repeat(64),
    recipe_file: source,
  };
  const plan = {
    freeze_commit: freeze.commit,
    redaction_reviewed: true as const,
    sensitive_keys_reviewed: true as const,
    probes: [],
    heldout: [item],
  };
  expect(() => validateRecipeSelection(freeze, plan)).not.toThrow();
  expect(() =>
    validateRecipeSelection(freeze, { ...plan, heldout: [] }),
  ).toThrow();
  expect(() =>
    validateRecipeSelection(freeze, { ...plan, heldout: [item, item] }),
  ).toThrow();
  expect(() =>
    validateRecipeSelection(freeze, {
      ...plan,
      heldout: [
        { ...item, recipe_file: '../held-out/recipes/unregistered.json' },
      ],
    }),
  ).toThrow();
});
