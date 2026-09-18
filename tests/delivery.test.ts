import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { basename } from 'node:path';
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
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach } from 'vitest';
import { sha256, walk } from '../harness/checksums';
import { fingerprints, frozenPaths } from '../harness/freeze';
import { repoRoot } from '../harness/paths';
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

// Exercise the real prepare CLI in an isolated tree. Only external commands
// (Git HEAD, Gitleaks, and the official evaluation process) are mocked.
function prepareSetup() {
  const { root, fixture, source } = freezeSetup();
  for (const file of [
    'scripts/delivery.ts',
    'harness/check-preparation.ts',
    'harness/checksums.ts',
    'harness/freeze.ts',
    'harness/paths.ts',
    'harness/validate.ts',
    'package.json',
    'tsconfig.json',
  ])
    cpSync(join(repoRoot, file), join(root, file));
  const discovery = {
    ...fixture,
    id: 'discovery',
    source: {
      ...fixture.source,
      url: 'https://synthetic.invalid',
      capture_hash: 'b'.repeat(64),
      action_channel: 'synthetic test only',
    },
  };
  writeFileSync(
    join(root, 'fixtures/discovery/discovery.json'),
    JSON.stringify(discovery),
  );
  writeFileSync(
    join(root, 'fixtures/PROVENANCE.md'),
    '# Synthetic provenance\n',
  );
  mkdirSync(join(root, 'research/probes'), { recursive: true });
  writeFileSync(
    join(root, 'research/probes/existing.json'),
    '{"preserve":true}\n',
  );
  const bin = join(root, 'bin');
  mkdirSync(bin);
  for (const command of ['git', 'gitleaks', 'corepack']) {
    writeFileSync(
      join(bin, command),
      `#!${process.execPath}
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
appendFileSync('.delivery/commands.log', JSON.stringify([command, ...args]) + '\\n');
if (command === 'git' && args.join(' ') === 'rev-parse HEAD') {
  console.log(process.env.SYNTHETIC_HEAD || 'a'.repeat(40));
} else if (command === 'gitleaks' && args[0] === 'version') {
  console.log('synthetic scanner');
} else if (command === 'gitleaks' && args[0] === 'dir') {
  const state = JSON.parse(readFileSync('.delivery/state.json', 'utf8'));
  appendFileSync('.delivery/scan-states.log', JSON.stringify(state) + '\\n');
  process.exitCode = process.env.SYNTHETIC_SCAN_FAIL === '1' ? 1 : 0;
} else if (command === 'corepack' && args.join(' ') === 'pnpm@10.11.0 heldout') {
  if (existsSync('VERDICTS.md')) throw new Error('Mock evaluation must not overwrite verdict');
  const freeze = JSON.parse(readFileSync('.delivery/freeze.json', 'utf8'));
  writeFileSync('VERDICTS.md', '# Synthetic verdict\\n\\n' + '\\x60\\x60\\x60json\\n' + JSON.stringify({ complete: true, exit_code: 0, freeze_commit: freeze.commit }) + '\\n\\x60\\x60\\x60\\n', { flag: 'wx' });
} else {
  throw new Error('Unexpected mocked command: ' + command + ' ' + args.join(' '));
}
`,
      { mode: 0o755 },
    );
  }
  const freeze = createCaptureFreeze(root, 'a'.repeat(40));
  const capture = {
    ...fixture,
    source: { ...fixture.source, date: freeze.frozen_at },
  };
  const captureBytes = JSON.stringify(capture);
  const captureFile = join(root, '../held-out/case.json');
  writeFileSync(captureFile, captureBytes);
  const plan = {
    freeze_commit: freeze.commit,
    redaction_reviewed: true,
    sensitive_keys_reviewed: true,
    heldout: [
      {
        source: '../held-out/case.json',
        sha256: sha256(captureBytes),
        recipe_file: source,
        session_recipe: 'Synthetic ordered actions',
        action_channel: 'Synthetic action responses',
        read_endpoint: 'https://synthetic.invalid/cart',
        independent_replay: 'Not performed: synthetic tooling test',
      },
    ],
    probes: [],
  };
  const writePlan = (value = plan) =>
    writeFileSync(join(root, '.delivery/plan.json'), JSON.stringify(value));
  writePlan();
  const run = (overrides: Record<string, string> = {}) =>
    spawnSync(
      process.execPath,
      [
        '--import',
        createRequire(import.meta.url).resolve('tsx'),
        realpathSync(join(root, 'scripts/delivery.ts')),
        'prepare',
      ],
      {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          SYNTHETIC_HEAD: '',
          SYNTHETIC_SCAN_FAIL: '',
          ...overrides,
          PATH: `${bin}:${process.env.PATH ?? ''}`,
        },
      },
    );
  const destinations = () =>
    Object.fromEntries(
      [
        ...walk(join(root, 'fixtures')),
        ...walk(join(root, 'research/probes')),
        ...walk(join(root, 'ai/traces')),
        ...(existsSync(join(root, 'VERDICTS.md'))
          ? [join(root, 'VERDICTS.md')]
          : []),
      ].map((file) => [file, sha256(readFileSync(file))]),
    );
  return {
    root,
    capture,
    captureFile,
    captureBytes,
    plan,
    writePlan,
    run,
    destinations,
  };
}

it.each([
  'missing source',
  'wrong SHA',
  'wrong HEAD',
  'recipe mismatch',
  'secret scan failure',
])(
  'prepare leaves an unbound plan and destinations unchanged after %s, then accepts correction',
  (failure) => {
    const setup = prepareSetup();
    const { root, plan, writePlan, run, destinations } = setup;
    const originalState = readFileSync(join(root, '.delivery/state.json'));
    const originalFreeze = readFileSync(join(root, '.delivery/freeze.json'));
    const before = destinations();
    const rejected = structuredClone(plan);
    const item = rejected.heldout[0];
    if (!item) throw new Error('Synthetic case missing');
    const env: Record<string, string> = {};
    if (failure === 'missing source') item.source = '../held-out/missing.json';
    if (failure === 'wrong SHA') item.sha256 = '0'.repeat(64);
    if (failure === 'wrong HEAD') env.SYNTHETIC_HEAD = 'b'.repeat(40);
    if (failure === 'recipe mismatch') {
      const changed = JSON.stringify({
        ...setup.capture,
        actions: [{ type: 'add', ref: 'SYNTHETIC-ITEM', qty: 2 }],
      });
      writeFileSync(setup.captureFile, changed);
      item.sha256 = sha256(changed);
    }
    if (failure === 'secret scan failure') env.SYNTHETIC_SCAN_FAIL = '1';
    writePlan(rejected);
    const rejectedResult = run(env);
    expect(rejectedResult.status, rejectedResult.stderr).toBe(1);
    const error = {
      'missing source': 'ENOENT',
      'wrong SHA': 'Reviewed import changed',
      'wrong HEAD': 'Prepare must remain on the frozen commit',
      'recipe mismatch': 'Captured case differs from pre-registered recipe',
      'secret scan failure': 'gitleaks failed',
    }[failure];
    expect(rejectedResult.stderr).toContain(error);
    expect(readFileSync(join(root, '.delivery/state.json'))).toEqual(
      originalState,
    );
    expect(readFileSync(join(root, '.delivery/freeze.json'))).toEqual(
      originalFreeze,
    );
    expect(destinations()).toEqual(before);

    // Correct inputs only: no state edits or replacement freeze.
    writeFileSync(setup.captureFile, setup.captureBytes);
    writePlan(plan);
    const retried = run();
    expect(retried.status, retried.stderr).toBe(0);
    expect(retried.stdout).toContain('Prepared at');
    expect(
      JSON.parse(readFileSync(join(root, '.delivery/state.json'), 'utf8')),
    ).toMatchObject({ stage: 'prepared', plan_hash: expect.any(String) });
    expect(readFileSync(join(root, '.delivery/freeze.json'))).toEqual(
      originalFreeze,
    );
    expect(
      readFileSync(
        join(root, 'fixtures/held-out', basename(setup.captureFile)),
        'utf8',
      ),
    ).toBe(setup.captureBytes);
    const scanStates = readFileSync(
      join(root, '.delivery/scan-states.log'),
      'utf8',
    )
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    for (const state of scanStates)
      expect(state).not.toHaveProperty('plan_hash');
    const verdict = readFileSync(join(root, 'VERDICTS.md'));
    expect(run().status).toBe(0);
    expect(readFileSync(join(root, 'VERDICTS.md'))).toEqual(verdict);
    const commands = readFileSync(join(root, '.delivery/commands.log'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    expect(commands.filter((entry) => entry[0] === 'corepack')).toHaveLength(1);
  },
);

it('prepare refuses changes to an already-bound plan without changing freeze, state or verdict', () => {
  const { root, plan, writePlan, run, destinations } = prepareSetup();
  const prepared = run();
  expect(prepared.status, prepared.stderr).toBe(0);
  const state = readFileSync(join(root, '.delivery/state.json'));
  const freeze = readFileSync(join(root, '.delivery/freeze.json'));
  const before = destinations();
  const changed = structuredClone(plan);
  const item = changed.heldout[0];
  if (!item) throw new Error('Synthetic case missing');
  item.session_recipe = 'Changed after binding';
  writePlan(changed);
  const refused = run();
  expect(refused.status).toBe(1);
  expect(refused.stderr).toContain('Reviewed import plan changed');
  expect(readFileSync(join(root, '.delivery/state.json'))).toEqual(state);
  expect(readFileSync(join(root, '.delivery/freeze.json'))).toEqual(freeze);
  expect(destinations()).toEqual(before);
});
