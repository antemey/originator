import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
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
      existsSync(join(root, 'VERDICTS.md')) ||
      (existsSync(published) &&
        readdirSync(published).some((name) => name !== '.gitkeep'))
    )
      throw new Error(
        'Cannot start development roles after held-out publication',
      );
    /** @param {string} value */
    const tomlStringContent = (value) => JSON.stringify(value).slice(1, -1);
    const config = readFileSync(
      join(root, `ai/roles/config.${role}.toml`),
      'utf8',
    )
      .replaceAll('__REPO__', tomlStringContent(root))
      .replaceAll(
        '__HELDOUT__',
        tomlStringContent(resolve(root, '../held-out')),
      )
      .replaceAll('__TMP__', tomlStringContent(realpathSync(tmpdir())));
    mkdirSync(join(root, '.codex'), { recursive: true });
    writeFileSync(
      join(root, 'AGENTS.override.md'),
      `<!-- ${marker}: ${role} -->\n${readFileSync(join(root, 'AGENTS.md'), 'utf8')}\n${readFileSync(join(root, `ai/roles/${role}.md`), 'utf8')}`,
    );
    writeFileSync(
      join(root, '.codex/config.toml'),
      `# ${marker}: ${role}\n${config}`,
    );
    console.log(
      `Active role: ${role}. Close the previous session and open a NEW Codex session from this directory:`,
    );
    console.log(
      `codex --strict-config -c 'default_permissions="${role}"' -a never`,
    );
    console.log(
      'Review project trust, /permissions and /hooks before work. Run the sentinel recipe in SETUP-NOTES.md first. Do not resume or fork another role.',
    );
    console.log(
      'Commands outside the role allowlist are refused; ask the operator from the conversation instead of escalating the shell.',
    );
  }
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
}
