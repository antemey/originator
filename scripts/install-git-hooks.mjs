import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Repository-local installation only. Never replace another hook setup.
let configured = '';
try {
  configured = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
} catch (error) {
  if (
    !error ||
    typeof error !== 'object' ||
    !('status' in error) ||
    error.status !== 1
  )
    throw error;
}
if (configured && configured !== 'scripts/git-hooks')
  throw new Error(
    'Existing core.hooksPath: operator review required; no hooks replaced',
  );
if (!configured) {
  const directory = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], {
    encoding: 'utf8',
  }).trim();
  for (const name of ['pre-commit', 'pre-push'])
    if (existsSync(resolve(directory, name)))
      throw new Error(
        `Existing ${name}: operator review required; no duplicate hooks installed`,
      );
}
execFileSync('git', [
  'config',
  '--local',
  'core.hooksPath',
  'scripts/git-hooks',
]);
console.log(
  'Local Git workflow hooks installed. No global or client settings changed.',
);
