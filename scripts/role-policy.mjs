import { existsSync, realpathSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';

/** @typedef {'impl' | 'verify'} Role */
/** @typedef {{ tool_name: string, tool_input: Record<string, unknown> }} HookEvent */

/** @param {unknown} value @returns {HookEvent} */
export function parseHookEvent(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    !('tool_name' in value) ||
    typeof value.tool_name !== 'string' ||
    !('tool_input' in value) ||
    !value.tool_input ||
    typeof value.tool_input !== 'object' ||
    Array.isArray(value.tool_input)
  ) {
    throw new Error(
      'Expected a hook event with tool_name and object tool_input',
    );
  }
  return {
    tool_name: value.tool_name,
    tool_input: /** @type {Record<string, unknown>} */ (value.tool_input),
  };
}

/** @param {string} root @param {string} value @returns {string} */
export function normalizedPath(root, value) {
  const absolute = resolve(root, value);
  let parent = absolute;
  while (!existsSync(parent) && dirname(parent) !== parent)
    parent = dirname(parent);
  const resolved = resolve(realpathSync(parent), relative(parent, absolute));
  return relative(realpathSync(root), resolved).split(sep).join('/');
}
/** @param {Role} role @param {string} path @returns {boolean} */
export function editable(role, path) {
  if (
    path.startsWith('/') ||
    path.split('/').some((part) => part === '..' || part === '.')
  )
    return false;
  if (path.startsWith('ai/traces/discovery/') || path === 'ai/traces/discovery')
    return false;
  if (path.startsWith('tests/') || path.startsWith('ai/traces/')) return true;
  return (
    role === 'impl' &&
    ((path.startsWith('src/') && path !== 'src/engine/contract.ts') ||
      path === 'woo/kernel-model.md')
  );
}
/** @param {string} patch @returns {string[]} */
export function patchPaths(patch) {
  return [
    ...patch.matchAll(
      /^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm,
    ),
  ].map((match) => {
    if (!match[1]) throw new Error('Patch path missing');
    return match[1];
  });
}
/** @param {string} command @param {Role} role @returns {string | null} */
export function commandPolicy(command, role) {
  if (/[\n\r;&|<>`$]/.test(command))
    return 'Compound commands and shell expansion require the operator';
  if (
    /held-out|heldout|fixtures:seal|use-role|deliver\.sh|settings|config\.toml/.test(
      command,
    )
  )
    return 'Operator-only command or protected path';
  if (/\bgit\b.*\bpush\b/.test(command)) return 'Agent pushes are prohibited';
  if (
    role === 'verify' &&
    /src\//.test(
      command.replaceAll('src/engine/contract.ts', 'PUBLIC_CONTRACT'),
    )
  )
    return 'Verification must not inspect engine implementation';
  const normalized = command
    .trim()
    .replace(/^corepack pnpm(?:@10\.11\.0)? /, 'pnpm ');
  if (/^pnpm (check|typecheck|lint|arch|test|fixtures:check)$/.test(normalized))
    return null;
  if (
    /^pnpm scenario (?:--reset-demo )?fixtures\/discovery\/[A-Za-z0-9_-]+\.json$/.test(
      normalized,
    )
  )
    return null;
  if (/^git status(?: --short)?$/.test(normalized) || normalized === 'pwd')
    return null;
  if (/^git diff -- (?:tests|ai\/traces)(?:\/)?$/.test(normalized)) return null;
  if (/^git commit -m (?:"[^"\n]+"|'[^'\n]+')$/.test(normalized)) return null;
  // Deliberately narrow read commands; broad repository scans would expose implementation to verify.
  if (
    /^(?:cat|sed -n '[0-9]+,[0-9]+p') (?:AGENTS(?:\.override)?\.md|(?:src|docs|target|fixtures\/discovery|ai|tests|woo)\/[A-Za-z0-9_./-]+)$/.test(
      normalized,
    )
  ) {
    if (/\.\./.test(normalized)) return 'Parent traversal is not allowed';
    if (
      role === 'verify' &&
      /tests\//.test(normalized) &&
      !/tests\/verify[._/-]/.test(normalized)
    )
      return 'Verification reads its own tests under tests/verify*; other test inspection requires the operator';
    return null;
  }
  return 'Command not on the role allowlist; ask the operator';
}
