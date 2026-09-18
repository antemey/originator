import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { sha256, walk } from './checksums';

export const frozenPaths = [
  'ai/traces/discovery',
  'research/compose.yml',
  'research/.env.example',
  'research/probe.sh',
  'research/seed',
  'fixtures/discovery',
  'src',
  'target',
  'harness',
  'tests',
  'scripts',
  '.codex/hooks.json',
  'ai/roles',
  'woo/project-store-api.ts',
  'package.json',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'biome.json',
  '.dependency-cruiser.cjs',
  'vitest.config.ts',
  '.node-version',
  '.npmrc',
  'use-role.sh',
  'deliver.sh',
];
export function fingerprints(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const path of frozenPaths) {
    const full = join(root, path);
    if (!existsSync(full)) throw new Error(`Frozen path missing: ${path}`);
    const files = [
      'ai/traces/discovery',
      'research/seed',
      'fixtures/discovery',
      'src',
      'target',
      'harness',
      'tests',
      'scripts',
      'ai/roles',
    ].includes(path)
      ? walk(full)
      : [full];
    for (const file of files)
      result[relative(root, file)] = sha256(readFileSync(file));
  }
  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b)),
  );
}
export function head(root: string): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
}
export function assertClean(root: string): void {
  if (
    execFileSync('git', ['status', '--porcelain'], {
      cwd: root,
      encoding: 'utf8',
    }).trim()
  )
    throw new Error('A clean committed working tree is required');
}
