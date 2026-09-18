import {
  existsSync,
  readdirSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = realpathSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '..'),
);
const marker = 'originator-generated-role-v1';
const paths = ['AGENTS.override.md', '.codex/config.toml'].map((file) =>
  join(root, file),
);
try {
  const role = process.argv[2];
  if (
    !role ||
    !['impl', 'verify', 'none'].includes(role) ||
    process.argv.length !== 3
  )
    throw new Error('Usage: ./use-role.sh impl|verify|none');
  for (const file of paths) {
    if (
      existsSync(file) &&
      !readFileSync(file, 'utf8').split('\n')[0]?.includes(marker)
    )
      throw new Error(
        `Refusing to overwrite or remove an unrecognized local file: ${file}`,
      );
  }
  if (role === 'none') {
    for (const file of paths) if (existsSync(file)) unlinkSync(file);
    console.log(
      'No active role. Generated role files removed; global settings unchanged.',
    );
  } else {
    const published = join(root, 'fixtures/held-out');
    if (
      existsSync(join(root, '.delivery/freeze.json')) ||
      existsSync(join(root, 'VERDICTS.md')) ||
      (existsSync(published) &&
        readdirSync(published).some((name) => name !== '.gitkeep'))
    )
      throw new Error(
        'Cannot start development roles after final freeze or held-out publication',
      );
    const common = readFileSync(join(root, 'AGENTS.md'), 'utf8');
    const brief = readFileSync(join(root, `ai/roles/${role}.md`), 'utf8');
    const override = `<!-- ${marker}: ${role} -->\n${common}\n${brief}`;
    writeFileSync(join(root, 'AGENTS.override.md'), override);
    // Retire recognized legacy configuration only after the override is written.
    const legacyConfig = join(root, '.codex/config.toml');
    if (existsSync(legacyConfig)) unlinkSync(legacyConfig);
    console.log(
      `Active role: ${role}. Close the previous session and open a NEW session from this repository root.`,
    );
    console.log('Read AGENTS.override.md. Do not resume or fork another role.');
    console.log(
      'No client configuration is generated. Role rights and operator path review are workflow controls, not a security boundary.',
    );
  }
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
}
