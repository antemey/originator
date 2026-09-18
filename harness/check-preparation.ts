import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixtureFiles, walk } from './checksums';
import { isMain, repoRoot } from './paths';
import { loadFixture, loadSeed, validateSeed } from './validate';

// Structural readiness only: never import or execute the engine.
export function preparationReport(root: string) {
  const counts = { target: 0, lab: 0, derived: 0, synthetic: 0, seeds: 0 };
  const blockers: string[] = [];
  const seeds = walk(join(root, 'target')).filter(
    (file) => file.endsWith('.json') && !file.endsWith('.schema.json'),
  );
  for (const file of seeds) {
    const seed: unknown = JSON.parse(readFileSync(file, 'utf8'));
    validateSeed(seed);
    counts.seeds++;
  }
  const cafe: unknown = JSON.parse(
    readFileSync(join(root, 'target/seed.json'), 'utf8'),
  );
  validateSeed(cafe);
  if (!cafe.configured || !cafe.products.length)
    blockers.push(
      'Café seed is not configured with an evidence-backed catalogue.',
    );
  const ids = new Set<string>();
  for (const file of fixtureFiles(root, 'discovery')) {
    const fixture = loadFixture(file);
    if (ids.has(fixture.id))
      throw new Error(`Duplicate fixture id: ${fixture.id}`);
    ids.add(fixture.id);
    if (!fixture.seed_file)
      throw new Error(`Explicit seed_file required: ${fixture.id}`);
    const seed = loadSeed(root, fixture);
    if (fixture.provenance !== 'synthetic') {
      if (!seed.configured)
        throw new Error(`Unconfigured reference seed: ${fixture.id}`);
      if (!fixture.actions.length)
        throw new Error(`Reference has no captured actions: ${fixture.id}`);
      if (!fixture.source.capture_hash || !fixture.source.action_channel)
        throw new Error(
          `Reference capture hash/action channel missing: ${fixture.id}`,
        );
      if (
        fixture.provenance === 'target' &&
        (!fixture.source.url || fixture.seed_file !== 'target/seed.json')
      )
        throw new Error(
          `Direct target reference requires URL and café seed: ${fixture.id}`,
        );
      if (
        fixture.provenance === 'lab' &&
        (!fixture.source.woo_version ||
          !fixture.seed_file.startsWith('target/lab/'))
      )
        throw new Error(
          `Lab reference requires version and separate target/lab/ seed: ${fixture.id}`,
        );
    }
    counts[fixture.provenance]++;
  }
  if (!counts.target)
    blockers.push(
      'At least one complete direct-target discovery fixture is required.',
    );
  return { counts, blockers, engine_fidelity: 'not evaluated' as const };
}

export function assertPreparationReady(root: string): void {
  const report = preparationReport(root);
  if (report.blockers.length) throw new Error(report.blockers.join('\n'));
}

if (isMain(import.meta.url)) {
  try {
    const report = preparationReport(repoRoot);
    console.log(JSON.stringify(report, null, 2));
    console.log(
      'Validated reference counts above; engine fidelity is not evaluated.',
    );
    if (report.blockers.length) process.exitCode = 1;
  } catch (error) {
    console.error(String(error));
    console.error(
      'Preparation validation failed; engine fidelity is not evaluated.',
    );
    process.exitCode = 1;
  }
}
