import { expect, it } from 'vitest';
import {
  assertReportReady,
  packagingPath,
  validatePlan,
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
