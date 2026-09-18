import { spawnSync } from 'node:child_process';
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
import { repoRoot } from '../harness/paths';

const temporary: string[] = [];
afterEach(() => {
  for (const root of temporary.splice(0)) rmSync(root, { recursive: true });
});
function setup() {
  const root = mkdtempSync(join(tmpdir(), 'originator-hooks-'));
  temporary.push(root);
  mkdirSync(join(root, 'bin'));
  mkdirSync(join(root, 'docs'));
  writeFileSync(
    join(root, 'bin/corepack'),
    '#!/bin/sh\nprintf "%s\\n" "$*" > invoked\nexit "$SYNTHETIC_GATE_EXIT"\n',
    { mode: 0o755 },
  );
  writeFileSync(
    join(root, 'docs/exception.md'),
    'Synthetic operator checkpoint explanation.',
  );
  const run = (hook: string, env: Record<string, string> = {}) =>
    spawnSync(
      process.execPath,
      [join(repoRoot, 'scripts/git-hook.mjs'), hook],
      {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          SYNTHETIC_GATE_EXIT: '0',
          ORIGINATOR_CHECKPOINT_EXCEPTION: '',
          ORIGINATOR_EXCEPTION_RECORD: '',
          ...env,
          PATH: join(root, 'bin'),
        },
      },
    );
  return { root, run };
}
it('pre-commit runs the full check and blocks failures', () => {
  const { root, run } = setup();
  expect(run('pre-commit').status).toBe(0);
  expect(readFileSync(join(root, 'invoked'), 'utf8')).toBe(
    'pnpm@10.11.0 check\n',
  );
  expect(run('pre-commit', { SYNTHETIC_GATE_EXIT: '1' }).status).toBe(1);
});
it('allows only documented operator checkpoint exceptions and never allows them in a role', () => {
  const { root, run } = setup();
  const env = {
    SYNTHETIC_GATE_EXIT: '1',
    ORIGINATOR_CHECKPOINT_EXCEPTION: 'reference',
    ORIGINATOR_EXCEPTION_RECORD: 'docs/exception.md',
  };
  expect(run('pre-commit', env).status).toBe(0);
  expect(
    run('pre-commit', { ...env, ORIGINATOR_CHECKPOINT_EXCEPTION: 'delivery' })
      .status,
  ).toBe(1);
  expect(
    run('pre-commit', {
      ...env,
      ORIGINATOR_EXCEPTION_RECORD: 'docs/missing.md',
    }).status,
  ).toBe(1);
  writeFileSync(join(root, 'AGENTS.override.md'), 'Synthetic role');
  expect(run('pre-commit', env).status).toBe(1);
});
it('blocks pre-push without attempting a network operation', () => {
  expect(setup().run('pre-push').status).toBe(1);
});
it('installs once locally and refuses to replace existing hooks or hook paths', () => {
  const { root } = setup();
  cpSync(join(repoRoot, 'scripts'), join(root, 'scripts'), { recursive: true });
  expect(spawnSync('git', ['init', '-q', root]).status).toBe(0);
  const run = () =>
    spawnSync(process.execPath, ['scripts/install-git-hooks.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });
  writeFileSync(join(root, '.git/hooks/pre-commit'), '# Personal hook');
  expect(run().status).not.toBe(0);
  rmSync(join(root, '.git/hooks/pre-commit'));
  expect(run().status).toBe(0);
  expect(run().status).toBe(0);
  expect(
    spawnSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
      cwd: root,
      encoding: 'utf8',
    }).stdout.trim(),
  ).toBe('scripts/git-hooks');
  spawnSync('git', ['config', '--local', 'core.hooksPath', 'personal-hooks'], {
    cwd: root,
  });
  expect(run().status).not.toBe(0);
});
