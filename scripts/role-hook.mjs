import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  commandPolicy,
  editable,
  normalizedPath,
  parseHookEvent,
  patchPaths,
} from './role-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const activeFile = join(root, 'AGENTS.override.md');
/** @param {string} reason */
function deny(reason) {
  console.error(reason);
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exitCode = 2;
}
/** @param {string[]} args @returns {boolean} */
function run(args) {
  const result = spawnSync('corepack', ['pnpm@10.11.0', ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.stdout) console.error(result.stdout);
  if (result.stderr) console.error(result.stderr);
  return result.status === 0;
}
try {
  if (existsSync(activeFile)) {
    const role = /originator-generated-role-v1: (impl|verify)/.exec(
      readFileSync(activeFile, 'utf8'),
    )?.[1];
    if (role !== 'impl' && role !== 'verify')
      throw new Error('Unrecognized active role');
    /** @type {unknown} */
    const raw = JSON.parse(readFileSync(0, 'utf8'));
    const event = parseHookEvent(raw);
    const input = event.tool_input;
    const command = input.command ?? input.cmd ?? '';
    if (typeof command !== 'string')
      throw new Error('Hook command must be a string');
    if (process.argv[2] === 'pre') {
      if (
        input.sandbox_permissions === 'require_escalated' ||
        input.dangerouslyDisableSandbox
      )
        deny('Role commands cannot escape the sandbox');
      else if (event.tool_name === 'Bash') {
        const reason = commandPolicy(command, role);
        if (reason) deny(reason);
        else if (/^git commit\b/.test(command) && !run(['check']))
          deny('pnpm check failed: commit blocked');
      } else if (event.tool_name === 'apply_patch') {
        const paths = patchPaths(command);
        if (
          !paths.length ||
          paths.some((file) => !editable(role, normalizedPath(root, file)))
        )
          deny('Patch touches protected or unrecognized paths');
      } else if (event.tool_name === 'view_image') {
        if (typeof input.path !== 'string')
          throw new Error('Image path must be a string');
        const path = normalizedPath(root, input.path);
        if (!path.startsWith('ai/traces/discovery/captures/'))
          deny('Only supplied discovery captures can be viewed');
      } else deny('Tool not enabled for this role; ask the operator');
    } else if (process.argv[2] === 'post') {
      const paths = patchPaths(command).map((file) =>
        normalizedPath(root, file),
      );
      let ok = true;
      for (const path of paths) {
        if (
          editable(role, path) &&
          !path.startsWith('ai/traces/') &&
          existsSync(join(root, path)) &&
          /\.(?:ts|js|mjs|json)$/.test(path)
        ) {
          ok = run(['exec', 'biome', 'check', '--write', path]) && ok;
        }
      }
      ok = run(['typecheck']) && ok;
      console.log(
        JSON.stringify({
          systemMessage: ok
            ? 'Edited-file checks passed; final gate remains pnpm check.'
            : 'Edited-file checks failed; fix before handoff.',
          ...(ok
            ? {}
            : { continue: false, stopReason: 'Edited-file validation failed' }),
        }),
      );
      if (!ok) process.exitCode = 2;
    } else throw new Error('Usage: role-hook.mjs pre|post');
  }
} catch (error) {
  deny(`Role hook error: ${String(error)}`);
}
