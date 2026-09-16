import { expect, it } from 'vitest';
import { fixtureFiles, verifyManifest } from '../harness/checksums';
import { replay } from '../harness/compare';
import { repoRoot } from '../harness/paths';
import { loadFixture, loadSeed } from '../harness/validate';
import { createEngine } from '../src/engine';

it('checks sealed discovery and published held-out integrity without officially replaying held-out', () => {
  expect(() => verifyManifest(repoRoot)).not.toThrow();
});
const fixtures = fixtureFiles(repoRoot, 'discovery')
  .map((file) => loadFixture(file))
  .filter((fixture) => fixture.provenance !== 'synthetic');
if (fixtures.length === 0)
  console.log(
    '0 real scenarios: tooling verified, business fidelity not evaluated.',
  );
for (const fixture of fixtures) {
  it(`discovery evidence: ${fixture.id} (${fixture.provenance})`, () => {
    expect(
      replay(createEngine(), loadSeed(repoRoot, fixture), fixture).differences,
    ).toEqual([]);
  });
}
