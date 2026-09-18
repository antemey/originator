import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createEngine } from '../src/engine';
import type { Engine } from '../src/engine/contract';
import { sha256, walk } from './checksums';
import { replay } from './compare';
import { fingerprints, head } from './freeze';
import { isMain, repoRoot } from './paths';
import { loadFixture, loadSeed } from './validate';

interface EvaluationOptions {
  root: string;
  directory: string;
  verdictFile: string;
  engine: Engine;
  freezeCommit: string;
  codeHashes: Record<string, string>;
  allowSynthetic?: boolean;
}
export function evaluateHeldout(options: EvaluationOptions): 0 | 1 | 2 {
  const { root, directory, verdictFile, engine } = options;
  try {
    if (existsSync(verdictFile))
      throw new Error(
        'Original verdict already exists; refusing a second official evaluation',
      );
    const files = walk(directory).filter((file) => file.endsWith('.json'));
    if (!files.length)
      throw new Error(
        'No cases: official evaluation refused; no verdict created',
      );
    const ids = new Set<string>();
    const cases = files.map((file) => {
      const fixture = loadFixture(file);
      if (!options.allowSynthetic && fixture.provenance === 'synthetic')
        throw new Error('Synthetic cases cannot be an official evaluation');
      if (ids.has(fixture.id))
        throw new Error(`Duplicate fixture id: ${fixture.id}`);
      ids.add(fixture.id);
      return { file, fixture, seed: loadSeed(root, fixture) };
    });
    const outcomes = cases.map(({ file, fixture, seed }) => {
      try {
        const result = replay(engine, seed, fixture);
        return {
          id: fixture.id,
          file: relative(root, file),
          hash: sha256(readFileSync(file)),
          status: result.differences.length ? 'DIVERGENCE' : 'PASS',
          differences: result.differences,
        };
      } catch (error) {
        return {
          id: fixture.id,
          file: relative(root, file),
          hash: sha256(readFileSync(file)),
          status: 'ERROR',
          error: String(error),
        };
      }
    });
    const code = outcomes.some((item) => item.status === 'ERROR')
      ? 1
      : outcomes.some((item) => item.status === 'DIVERGENCE')
        ? 2
        : 0;
    const report = {
      evaluated_at: new Date().toISOString(),
      freeze_commit: options.freezeCommit,
      code_hashes: options.codeHashes,
      complete: code !== 1,
      exit_code: code,
      outcomes,
    };
    writeFileSync(
      verdictFile,
      `# Held-out verdicts\n\nOne official pass. Replays do not replace this record.\n\n\`\`\`json\n${JSON.stringify(report, null, 2)}\n\`\`\`\n`,
      { flag: 'wx' },
    );
    console.log(
      `Held-out evaluation recorded: exit ${code}; ${outcomes.length} cases.`,
    );
    return code;
  } catch (error) {
    console.error(String(error));
    return 1;
  }
}

if (isMain(import.meta.url)) {
  try {
    if (process.argv.length !== 2)
      throw new Error(
        'No command-line overrides are allowed for the official evaluation',
      );
    if (existsSync(join(repoRoot, 'AGENTS.override.md')))
      throw new Error('Operator only: leave the active role first');
    const freezeFile = join(repoRoot, '.delivery/freeze.json');
    let freezeCommit: string;
    let codeHashes: Record<string, string>;
    if (existsSync(freezeFile)) {
      const freeze: unknown = JSON.parse(readFileSync(freezeFile, 'utf8'));
      if (
        !freeze ||
        typeof freeze !== 'object' ||
        !('commit' in freeze) ||
        typeof freeze.commit !== 'string' ||
        !('hashes' in freeze)
      )
        throw new Error('Invalid delivery freeze');
      freezeCommit = freeze.commit;
      codeHashes = fingerprints(repoRoot);
      if (JSON.stringify(codeHashes) !== JSON.stringify(freeze.hashes))
        throw new Error('Frozen code changed; protocol invalidated');
      if (head(repoRoot) !== freezeCommit)
        throw new Error('Official evaluation must run at the frozen commit');
    } else {
      throw new Error(
        'Record the pre-capture freeze with ./deliver.sh prepare first',
      );
    }
    process.exitCode = evaluateHeldout({
      root: repoRoot,
      directory: join(repoRoot, 'fixtures/held-out'),
      verdictFile: join(repoRoot, 'VERDICTS.md'),
      engine: createEngine(),
      freezeCommit,
      codeHashes,
    });
  } catch (error) {
    console.error(String(error));
    process.exitCode = 1;
  }
}
