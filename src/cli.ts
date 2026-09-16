import { resolve } from 'node:path';
import { diff, replay } from '../harness/compare';
import { isMain, repoRoot } from '../harness/paths';
import { loadFixture, loadSeed } from '../harness/validate';
import { createEngine } from './engine';

export function main(args: string[]): number {
  try {
    const resetDemo = args[0] === '--reset-demo';
    const file = args[resetDemo ? 1 : 0];
    if (!file || args.length !== (resetDemo ? 2 : 1))
      throw new Error('Usage: pnpm scenario [--reset-demo] <fixture.json>');
    const fixture = loadFixture(resolve(file), false);
    const seed = loadSeed(repoRoot, fixture);
    const engine = createEngine();
    const first = replay(engine, seed, fixture);
    if (resetDemo) {
      const second = replay(engine, seed, fixture);
      const differences = diff(first.projection, second.projection);
      const identical =
        differences.length === 0 &&
        JSON.stringify(first.checkpoints) ===
          JSON.stringify(second.checkpoints);
      console.log(
        JSON.stringify(
          { id: fixture.id, identical, first, second, differences },
          null,
          2,
        ),
      );
      return identical ? 0 : 1;
    }
    console.log(JSON.stringify({ id: fixture.id, ...first }, null, 2));
    return first.differences.length ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    console.log(JSON.stringify({ error: message }));
    return 1;
  }
}
if (isMain(import.meta.url)) process.exitCode = main(process.argv.slice(2));
