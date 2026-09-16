import { join } from 'node:path';
import { repoRoot } from '../harness/paths';
import { loadFixture, loadSeed } from '../harness/validate';

export function example() {
  return loadFixture(join(repoRoot, 'fixtures/discovery/_example.json'));
}
export function syntheticSeed() {
  return loadSeed(repoRoot, example());
}
