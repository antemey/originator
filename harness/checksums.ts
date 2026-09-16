import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { isMain, repoRoot } from './paths';
import { loadFixture, loadSeed, validateSeed } from './validate';

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}
export function walk(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .sort()
    .flatMap((name) => {
      const file = join(directory, name);
      const stat = lstatSync(file);
      if (stat.isSymbolicLink())
        throw new Error(`Symlinks are not allowed in audited trees: ${file}`);
      return stat.isDirectory() ? walk(file) : [file];
    });
}
export function fixtureFiles(
  root: string,
  group: 'discovery' | 'held-out',
): string[] {
  return walk(join(root, 'fixtures', group)).filter((file) =>
    file.endsWith('.json'),
  );
}
export function manifestContent(root: string): string {
  const roleActive = existsSync(join(root, 'AGENTS.override.md'));
  // Development roles cannot read held-out directories. They cannot start after publication.
  const fixtures = [
    ...fixtureFiles(root, 'discovery'),
    ...(roleActive ? [] : fixtureFiles(root, 'held-out')),
  ];
  const ids = new Set<string>();
  for (const file of fixtures) {
    const fixture = loadFixture(file);
    if (ids.has(fixture.id))
      throw new Error(`Duplicate fixture id: ${fixture.id}`);
    ids.add(fixture.id);
    loadSeed(root, fixture);
  }
  const seeds = walk(join(root, 'target')).filter(
    (file) => file.endsWith('.json') && !file.endsWith('.schema.json'),
  );
  for (const file of seeds) {
    const seed: unknown = JSON.parse(readFileSync(file, 'utf8'));
    validateSeed(seed);
  }
  // Seal every target seed, including currently unreferenced ones, to detect additions.
  return `${[...fixtures, ...seeds]
    .sort()
    .map(
      (file) =>
        `${sha256(readFileSync(file))}  ${relative(root, file).split('\\').join('/')}`,
    )
    .join('\n')}\n`;
}
export function verifyManifest(root: string): void {
  const expected = readFileSync(join(root, 'fixtures/MANIFEST.sha256'), 'utf8');
  if (
    existsSync(join(root, 'AGENTS.override.md')) &&
    expected.includes('fixtures/held-out/')
  )
    throw new Error(
      'Published held-out evidence is incompatible with development roles',
    );
  if (expected !== manifestContent(root))
    throw new Error(
      'Fixture/seed manifest mismatch: changed, added or removed file',
    );
}
if (isMain(import.meta.url)) {
  try {
    const command = process.argv[2];
    if (command === 'write') {
      writeFileSync(
        join(repoRoot, 'fixtures/MANIFEST.sha256'),
        manifestContent(repoRoot),
      );
      console.log(
        'Manifest sealed by operator. Record the change in fixtures/PROVENANCE.md.',
      );
    } else if (command === 'verify') {
      verifyManifest(repoRoot);
      console.log(
        'Fixture and seed integrity verified (including synthetic files).',
      );
    } else throw new Error('Usage: checksums.ts verify|write');
  } catch (error) {
    console.error(String(error));
    process.exitCode = 1;
  }
}
