import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { evaluateHeldout } from '../harness/run-heldout';
import { createEngine } from '../src/engine';
import { minor } from '../src/engine/money';
import { example, syntheticSeed } from './helpers';

const temporary: string[] = [];
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true });
});
function setup(includeCase = true) {
  const root = mkdtempSync(join(tmpdir(), 'woo-synthetic-heldout-'));
  temporary.push(root);
  const directory = join(root, 'cases');
  mkdirSync(directory);
  mkdirSync(join(root, 'target'));
  writeFileSync(
    join(root, 'target/_synthetic.seed.json'),
    JSON.stringify(syntheticSeed()),
  );
  if (includeCase)
    writeFileSync(join(directory, '_example.json'), JSON.stringify(example()));
  return {
    root,
    directory,
    verdictFile: join(root, 'VERDICTS.md'),
    engine: createEngine(),
    freezeCommit: 'synthetic-test-only',
    codeHashes: { synthetic: 'not-real-code' },
    allowSynthetic: true,
  };
}
it('writes the first synthetic verdict and refuses to replace it', () => {
  const options = setup();
  expect(evaluateHeldout(options)).toBe(0);
  const original = readFileSync(options.verdictFile, 'utf8');
  expect(original).toContain('synthetic-test-only');
  expect(evaluateHeldout(options)).toBe(1);
  expect(readFileSync(options.verdictFile, 'utf8')).toBe(original);
});
it('refuses an empty directory without writing a verdict', () => {
  const options = setup(false);
  expect(evaluateHeldout(options)).toBe(1);
  expect(existsSync(options.verdictFile)).toBe(false);
});
it('distinguishes a recorded divergence (2) from a technical error (1)', () => {
  const divergent = setup();
  const fixture = example();
  if (!fixture.expected) throw new Error('Synthetic expectation missing');
  fixture.expected.totals.total_items = minor(1);
  writeFileSync(
    join(divergent.directory, '_example.json'),
    JSON.stringify(fixture),
  );
  expect(evaluateHeldout(divergent)).toBe(2);
  expect(readFileSync(divergent.verdictFile, 'utf8')).toContain('DIVERGENCE');
  const broken = setup();
  broken.engine.dispatch = () => {
    throw new Error('Synthetic technical failure');
  };
  expect(evaluateHeldout(broken)).toBe(1);
  expect(readFileSync(broken.verdictFile, 'utf8')).toContain(
    '"complete": false',
  );
});
it('rejects invalid input before evaluation and disallows synthetic official evidence', () => {
  const invalid = setup();
  writeFileSync(join(invalid.directory, '_example.json'), '{}');
  expect(evaluateHeldout(invalid)).toBe(1);
  expect(existsSync(invalid.verdictFile)).toBe(false);
  expect(evaluateHeldout({ ...setup(), allowSynthetic: false })).toBe(1);
});
