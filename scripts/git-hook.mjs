import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const hook = process.argv[2];
if (hook === 'pre-push') {
  console.error(
    'Workflow pushes are blocked. Only Antoine may publish the audited commit manually; see docs/delivery.md.',
  );
  process.exitCode = 1;
} else if (hook === 'pre-commit') {
  if (existsSync('AGENTS.override.md')) {
    console.error(
      'Only the operator commits, outside role sessions. No role checkpoint exception.',
    );
    process.exitCode = 1;
  } else {
    const result = spawnSync('corepack', ['pnpm@10.11.0', 'check'], {
      stdio: 'inherit',
    });
    const exception = process.env.ORIGINATOR_CHECKPOINT_EXCEPTION;
    const record = process.env.ORIGINATOR_EXCEPTION_RECORD ?? '';
    const documented =
      /^docs\/[A-Za-z0-9_./-]+\.md$/.test(record) &&
      !record.split('/').includes('..') &&
      existsSync(record) &&
      readFileSync(record, 'utf8').trim().length > 0;
    if (result.status === 0) process.exitCode = 0;
    else if (
      ['reference', 'verification'].includes(exception ?? '') &&
      documented
    ) {
      console.error(
        `Operator-only ${exception} checkpoint exception: ${record}. Full check failed; this is not an accepted implementation or delivery.`,
      );
    } else {
      console.error(
        'Full pnpm check failed: commit blocked. See docs/delivery.md for the narrowly scoped operator exception.',
      );
      process.exitCode = 1;
    }
  }
} else {
  console.error('Usage: git-hook.mjs pre-commit|pre-push');
  process.exitCode = 1;
}
