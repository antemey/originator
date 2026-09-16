import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sentinelPaths = [
  resolve(root, '../held-out/_setup-sentinel.txt'),
  join(root, 'fixtures/held-out/_setup-sentinel.txt'),
];
/** @type {{role: string, check: string, status: string, exit: number | null, output: string}[]} */
const results = [];
/** @type {string[]} */
const created = [];
/** @param {string} role */
function select(role) {
  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/use-role.mjs'), role],
    { cwd: root, encoding: 'utf8' },
  );
  if (result.status !== 0) throw new Error(result.stderr);
}
/** Convert only this project's single-line TOML assignments to explicit diagnostic overrides.
 * The sandbox subcommand does not automatically load the trusted project config here.
 * @param {string} config @returns {string[]}
 */
function overrides(config) {
  let section = '';
  /** @type {string[]} */ const args = [];
  /** @type {string[]} */ let entries = [];
  const flush = () => {
    if (section && entries.length)
      args.push('-c', `${section}={${entries.join(', ')}}`);
    entries = [];
  };
  for (const line of config.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      flush();
      section = trimmed.slice(1, -1);
      continue;
    }
    if (
      !/^(?:[A-Za-z_]+|"[^"\n]+")\s*=\s*(?:"[^"\n]*"|true|false)$/.test(trimmed)
    )
      throw new Error('Unsupported diagnostic template syntax');
    if (section) entries.push(trimmed);
    else args.push('-c', trimmed);
  }
  flush();
  return args;
}
try {
  for (const file of sentinelPaths) {
    mkdirSync(dirname(file), { recursive: true });
    if (readdirSync(dirname(file)).some((name) => name !== '.gitkeep'))
      throw new Error(
        'Synthetic sandbox check requires empty held-out directories',
      );
  }
  for (const role of ['impl', 'verify']) {
    select(role);
    const args = overrides(
      readFileSync(join(root, '.codex/config.toml'), 'utf8'),
    );
    for (const file of sentinelPaths) {
      writeFileSync(file, 'SYNTHETIC SETUP SENTINEL\n', { flag: 'wx' });
      created.push(file);
    }
    /** @param {string} label @param {string[]} command @param {boolean} shouldPass */
    const test = (label, command, shouldPass) => {
      const result = spawnSync(
        'codex',
        ['sandbox', ...args, '-P', role, '--', ...command],
        { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
      );
      const pass = shouldPass
        ? result.status === 0
        : result.status !== 0 &&
          /EPERM|EACCES|Operation not permitted|Permission denied/.test(
            result.stderr,
          );
      results.push({
        role,
        check: label,
        status: pass ? 'PASS' : 'FAIL',
        exit: result.status,
        output: `${result.stdout}${result.stderr}`.trim(),
      });
      console.log(
        `${pass ? 'PASS' : 'FAIL'} ${role}: ${label} (exit ${result.status})`,
      );
    };
    for (const file of sentinelPaths) {
      test(
        `deny shell read ${file}`,
        [
          process.execPath,
          '-e',
          'require("node:fs").readFileSync(process.argv[1])',
          file,
        ],
        false,
      );
      test(
        `deny shell write ${file}`,
        [
          process.execPath,
          '-e',
          'require("node:fs").appendFileSync(process.argv[1], "forbidden")',
          file,
        ],
        false,
      );
    }
    for (const [path, allowed] of [
      ['tests/_permission-probe.txt', true],
      ['target/_permission-probe.txt', false],
      ['src/_permission-probe.txt', role === 'impl'],
    ]) {
      const file = join(root, String(path));
      if (existsSync(file))
        throw new Error(`Refusing to touch existing probe: ${file}`);
      test(
        `write boundary ${path}`,
        [
          process.execPath,
          '-e',
          'require("node:fs").writeFileSync(process.argv[1], "synthetic", {flag:"wx"})',
          file,
        ],
        Boolean(allowed),
      );
      if (existsSync(file)) unlinkSync(file);
    }
    test(
      'engine remains runtime-readable',
      [
        process.execPath,
        '-e',
        'require("node:fs").readFileSync("src/engine/index.ts")',
      ],
      true,
    );
    test(
      'pnpm check inside role sandbox',
      ['corepack', 'pnpm@10.11.0', 'check'],
      true,
    );
    for (const file of created.splice(0)) unlinkSync(file);
  }
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
} finally {
  for (const file of created) if (existsSync(file)) unlinkSync(file);
  select('none');
  mkdirSync(join(root, '.setup-audit'), { recursive: true });
  writeFileSync(
    join(root, '.setup-audit/role-sandbox.json'),
    `${JSON.stringify(results, null, 2)}\n`,
  );
  if (results.some((result) => result.status !== 'PASS')) process.exitCode = 1;
}
