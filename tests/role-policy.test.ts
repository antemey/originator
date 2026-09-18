import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { repoRoot } from '../harness/paths';
import {
  commandPolicy,
  editable,
  normalizedPath,
  parseHookEvent,
  patchPaths,
} from '../scripts/role-policy.mjs';

const temporary: string[] = [];
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true });
});
function temp() {
  const dir = mkdtempSync(join(tmpdir(), 'woo-role-policy-'));
  temporary.push(dir);
  return dir;
}

it('validates hook input as unknown instead of trusting JSON.parse', () => {
  expect(() => parseHookEvent(null)).toThrow();
  expect(() => parseHookEvent({ tool_name: 'Bash', tool_input: [] })).toThrow();
  expect(
    parseHookEvent({ tool_name: 'Bash', tool_input: { command: 'pnpm check' } })
      .tool_name,
  ).toBe('Bash');
});
it('normalizes paths and rejects traversal, protected files and symlink escapes', () => {
  const root = temp();
  mkdirSync(join(root, 'tests'));
  mkdirSync(join(root, 'outside'));
  symlinkSync(join(root, 'outside'), join(root, 'tests/link'));
  expect(normalizedPath(root, 'tests/../target/seed.json')).toBe(
    'target/seed.json',
  );
  expect(editable('impl', normalizedPath(root, 'tests/link/file.ts'))).toBe(
    false,
  );
  for (const role of ['impl', 'verify'] as const) {
    expect(editable(role, 'tests/../target/seed.json')).toBe(false);
    expect(editable(role, 'src/engine/contract.ts')).toBe(false);
    expect(editable(role, 'ai/traces/discovery/new.json')).toBe(false);
    expect(editable(role, 'tests/verify.test.ts')).toBe(true);
  }
  expect(editable('impl', 'src/engine/index.ts')).toBe(true);
  expect(editable('verify', 'src/engine/index.ts')).toBe(false);
});
it('checks every patch path, including moves', () => {
  expect(
    patchPaths(
      '*** Update File: tests/a.ts\n*** Move to: target/seed.json\n*** Delete File: src/a.ts',
    ),
  ).toEqual(['tests/a.ts', 'target/seed.json', 'src/a.ts']);
});
it('allows exact checks while refusing operator commands, pushes and shell expansion', () => {
  for (const role of ['impl', 'verify'] as const) {
    for (const command of [
      'pnpm check',
      'corepack pnpm@10.11.0 test',
      'pnpm scenario --reset-demo fixtures/discovery/_example.json',
    ])
      expect(commandPolicy(command, role)).toBeNull();
    for (const command of [
      'git push',
      'git -C . push',
      'pnpm fixtures:seal',
      'pnpm heldout',
      'pnpm install',
      'pnpm lint:fix',
      'pnpm test --watch',
      'pnpm check; cat ../held-out/a.json',
      'cat $(pwd)/secret',
      'node -e "process.exit()"',
    ])
      expect(commandPolicy(command, role)).not.toBeNull();
  }
  expect(commandPolicy('cat src/engine/contract.ts', 'verify')).toBeNull();
  expect(commandPolicy('cat src/engine/index.ts', 'verify')).not.toBeNull();
  expect(commandPolicy('cat src/engine/index.ts', 'impl')).toBeNull();
  expect(commandPolicy('cat tests/verify.test.ts', 'verify')).toBeNull();
});
it('generates common plus role instructions without client configuration and preserves unrelated files', () => {
  const root = temp();
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, 'ai/roles'), { recursive: true });
  cpSync(
    join(repoRoot, 'scripts/use-role.mjs'),
    join(root, 'scripts/use-role.mjs'),
  );
  cpSync(join(repoRoot, 'ai/roles'), join(root, 'ai/roles'), {
    recursive: true,
  });
  writeFileSync(join(root, 'AGENTS.md'), 'Common sentinel instruction.\n');
  const run = (role: string) =>
    spawnSync(process.execPath, [join(root, 'scripts/use-role.mjs'), role], {
      encoding: 'utf8',
    });
  for (const role of ['impl', 'verify']) {
    expect(run(role).status).toBe(0);
    expect(readFileSync(join(root, 'AGENTS.override.md'), 'utf8')).toContain(
      'Common sentinel instruction.',
    );
    expect(existsSync(join(root, '.codex/config.toml'))).toBe(false);
    expect(readFileSync(join(root, 'AGENTS.override.md'), 'utf8')).toContain(
      role === 'impl' ? '# Implementation role' : '# Verification role',
    );
  }
  mkdirSync(join(root, '.codex'), { recursive: true });
  writeFileSync(
    join(root, '.codex/config.toml'),
    '# originator-generated-role-v1: impl\n',
  );
  expect(run('none').status).toBe(0);
  expect(existsSync(join(root, 'AGENTS.override.md'))).toBe(false);
  expect(existsSync(join(root, '.codex/config.toml'))).toBe(false);
  mkdirSync(join(root, '.delivery'));
  writeFileSync(join(root, '.delivery/freeze.json'), '{}');
  expect(run('impl').status).toBe(1);
  expect(run('verify').status).toBe(1);
  rmSync(join(root, '.delivery/freeze.json'));
  writeFileSync(join(root, '.codex/config.toml'), '# Personal configuration');
  expect(run('impl').status).toBe(1);
  expect(run('none').status).toBe(1);
  expect(readFileSync(join(root, '.codex/config.toml'), 'utf8')).toBe(
    '# Personal configuration',
  );
  rmSync(join(root, '.codex/config.toml'));
  writeFileSync(join(root, 'AGENTS.override.md'), 'Unrelated operator content');
  expect(run('impl').status).toBe(1);
  expect(run('none').status).toBe(1);
  expect(readFileSync(join(root, 'AGENTS.override.md'), 'utf8')).toBe(
    'Unrelated operator content',
  );
});
it('hook denies protected edits, pushes and a commit when the check command fails', () => {
  const root = temp();
  cpSync(join(repoRoot, 'scripts'), join(root, 'scripts'), { recursive: true });
  writeFileSync(
    join(root, 'AGENTS.override.md'),
    '<!-- originator-generated-role-v1: impl -->',
  );
  const run = (tool_name: string, command: string) =>
    spawnSync(process.execPath, [join(root, 'scripts/role-hook.mjs'), 'pre'], {
      encoding: 'utf8',
      input: JSON.stringify({ tool_name, tool_input: { command } }),
      env: { ...process.env, PATH: '/nonexistent-synthetic-path' },
    });
  expect(run('Bash', 'git push').status).toBe(2);
  expect(run('apply_patch', '*** Update File: target/seed.json').status).toBe(
    2,
  );
  const commit = run('Bash', 'git commit -m "Synthetic test"');
  expect(commit.status).toBe(2);
  expect(commit.stdout).toContain('commit blocked');
});

it.each(['AGENTS.md', 'ai/roles/verify.md'])(
  'preserves generated files byte-for-byte when %s is missing',
  (missing) => {
    const root = temp();
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'ai/roles'), { recursive: true });
    mkdirSync(join(root, '.codex'));
    cpSync(
      join(repoRoot, 'scripts/use-role.mjs'),
      join(root, 'scripts/use-role.mjs'),
    );
    writeFileSync(join(root, 'AGENTS.md'), 'Synthetic common instructions.\n');
    writeFileSync(
      join(root, 'ai/roles/verify.md'),
      'Synthetic verification brief.\n',
    );
    const override = Buffer.from(
      '<!-- originator-generated-role-v1: impl -->\nPrevious instructions.\n',
    );
    const config = Buffer.from(
      '# originator-generated-role-v1: impl\nprevious = true\n',
    );
    writeFileSync(join(root, 'AGENTS.override.md'), override);
    writeFileSync(join(root, '.codex/config.toml'), config);
    rmSync(join(root, missing));

    const result = spawnSync(
      process.execPath,
      [join(root, 'scripts/use-role.mjs'), 'verify'],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('ENOENT');
    expect(readFileSync(join(root, 'AGENTS.override.md'))).toEqual(override);
    expect(existsSync(join(root, '.codex/config.toml'))).toBe(true);
    expect(readFileSync(join(root, '.codex/config.toml'))).toEqual(config);
  },
);
