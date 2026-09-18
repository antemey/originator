import { execFileSync, spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { assertPreparationReady } from '../harness/check-preparation';
import {
  fixtureFiles,
  manifestContent,
  sha256,
  verifyManifest,
  walk,
} from '../harness/checksums';
import { assertClean, fingerprints, head } from '../harness/freeze';
import { isMain, repoRoot } from '../harness/paths';
import {
  array,
  type Fixture,
  loadFixture,
  loadSeed,
  record,
  text,
} from '../harness/validate';

interface ImportItem {
  source: string;
  sha256: string;
  recipe_file?: string;
  session_recipe?: string;
  action_channel?: string;
  read_endpoint?: string;
  independent_replay?: string;
}
interface Plan {
  freeze_commit: string;
  redaction_reviewed: true;
  sensitive_keys_reviewed: true;
  heldout: ImportItem[];
  probes: ImportItem[];
}
interface State {
  stage: 'frozen' | 'imported' | 'evaluated' | 'prepared';
  plan_hash?: string;
  evidence_hashes?: Record<string, string>;
  evaluation_code?: number;
}
export interface Freeze {
  frozen_at: string;
  recipes: Record<string, string>;
  commit: string;
  hashes: Record<string, string>;
}

function command(program: string, args: string[], cwd = repoRoot): string {
  return execFileSync(program, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
}
function run(program: string, args: string[], cwd = repoRoot): void {
  const result = spawnSync(program, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0)
    throw new Error(
      `${program} failed: exit ${result.status ?? 'unavailable'}`,
    );
}
function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}
function save(file: string, value: unknown): void {
  writeFileSync(`${file}.next`, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(`${file}.next`, file);
}
export function validatePlan(value: unknown): Plan {
  const plan = record(value, 'delivery plan');
  text(plan.freeze_commit, 'freeze_commit');
  if (!/^[a-f0-9]{40,64}$/.test(plan.freeze_commit))
    throw new Error('Plan requires a full frozen commit SHA');
  if (plan.redaction_reviewed !== true || plan.sensitive_keys_reviewed !== true)
    throw new Error('Operator redaction and sensitive-key review are required');
  const parseItems = (input: unknown, heldout: boolean): ImportItem[] =>
    array(input, 'imports').map((entry) => {
      const item = record(entry, 'import');
      text(item.source, 'source');
      text(item.sha256, 'sha256');
      if (!/^[a-f0-9]{64}$/.test(item.sha256))
        throw new Error('Every import requires its reviewed SHA-256');
      if (heldout) {
        for (const key of [
          'recipe_file',
          'session_recipe',
          'action_channel',
          'read_endpoint',
          'independent_replay',
        ])
          text(item[key], key);
        return {
          source: item.source,
          sha256: item.sha256,
          recipe_file: String(item.recipe_file),
          session_recipe: String(item.session_recipe),
          action_channel: String(item.action_channel),
          read_endpoint: String(item.read_endpoint),
          independent_replay: String(item.independent_replay),
        };
      }
      return { source: item.source, sha256: item.sha256 };
    });
  const heldout = parseItems(plan.heldout, true);
  if (!heldout.length)
    throw new Error('A completed replication requires real held-out cases');
  const probes = parseItems(plan.probes, false);
  const destinations = [
    ...heldout.map((item) => `fixtures/held-out/${basename(item.source)}`),
    ...probes.map((item) => `research/probes/${basename(item.source)}`),
  ];
  if (new Set(destinations).size !== destinations.length)
    throw new Error('Duplicate import destinations');
  return {
    freeze_commit: plan.freeze_commit,
    redaction_reviewed: true,
    sensitive_keys_reviewed: true,
    heldout,
    probes,
  };
}
function readFreeze(): Freeze {
  const value = record(
    readJson(join(repoRoot, '.delivery/freeze.json')),
    'freeze',
  );
  text(value.commit, 'freeze.commit');
  const hashes = record(value.hashes, 'freeze.hashes');
  const entries = Object.entries(hashes).map(([key, value]) => {
    text(value, `freeze.hashes.${key}`);
    return [key, value] as const;
  });
  text(value.frozen_at, 'freeze.frozen_at');
  const recipes = record(value.recipes, 'freeze.recipes');
  for (const hash of Object.values(recipes)) text(hash, 'recipe hash');
  return {
    commit: value.commit,
    frozen_at: value.frozen_at,
    recipes: recipes as Record<string, string>,
    hashes: Object.fromEntries(entries),
  };
}
function readState(): State {
  const value = record(
    readJson(join(repoRoot, '.delivery/state.json')),
    'state',
  );
  if (
    !['frozen', 'imported', 'evaluated', 'prepared'].includes(
      String(value.stage),
    )
  )
    throw new Error('Invalid delivery state');
  if (value.plan_hash !== undefined) text(value.plan_hash, 'state.plan_hash');
  if (
    value.evaluation_code !== undefined &&
    ![0, 1, 2].includes(Number(value.evaluation_code))
  )
    throw new Error('Invalid evaluation code');
  const evidence =
    value.evidence_hashes === undefined
      ? undefined
      : record(value.evidence_hashes, 'state.evidence_hashes');
  const evidenceHashes: Record<string, string> = {};
  for (const [key, hash] of Object.entries(evidence ?? {})) {
    text(hash, key);
    evidenceHashes[key] = hash;
  }
  return {
    stage: value.stage as State['stage'],
    ...(value.plan_hash === undefined ? {} : { plan_hash: value.plan_hash }),
    ...(evidence ? { evidence_hashes: evidenceHashes } : {}),
    ...(value.evaluation_code === undefined
      ? {}
      : { evaluation_code: Number(value.evaluation_code) }),
  };
}
function checkFreeze(freeze: Freeze): void {
  if (JSON.stringify(fingerprints(repoRoot)) !== JSON.stringify(freeze.hashes))
    throw new Error(
      'Frozen code/seed/harness/tests/configuration changed: protocol invalidated; do not rerun held-out',
    );
}
function scan(path: string, history = false): void {
  run(
    'gitleaks',
    history
      ? ['git', '--redact', '--no-banner', '--log-opts=--all', path]
      : ['dir', '--redact', '--no-banner', path],
  );
}
function resolveSource(source: string): string {
  const result = realpathSync(resolve(repoRoot, source));
  const roots = [
    resolve(repoRoot, '../held-out'),
    join(repoRoot, 'research/probes'),
  ]
    .filter(existsSync)
    .map((path) => realpathSync(path));
  if (
    !roots.some((root) => {
      const path = relative(root, result);
      return (
        path &&
        path !== '..' &&
        !path.startsWith(`..${sep}`) &&
        !isAbsolute(path)
      );
    })
  )
    throw new Error(
      'Imports must be explicit reviewed files under ../held-out/ or research/probes/',
    );
  if (
    !result.endsWith('.json') ||
    !/^[A-Za-z0-9_-]+\.json$/.test(basename(result))
  )
    throw new Error('Only explicitly selected JSON imports are supported');
  return result;
}
function evidencePaths(plan: Plan): string[] {
  return [
    ...plan.heldout.map((item) => `fixtures/held-out/${basename(item.source)}`),
    ...plan.probes.map((item) => `research/probes/${basename(item.source)}`),
    'VERDICTS.md',
    'ai/traces/delivery-freeze.json',
    ...plan.heldout.map(
      (item) => `ai/traces/heldout-recipes/${basename(item.recipe_file ?? '')}`,
    ),
  ];
}
function readVerdict(): { code: 0 | 2; freezeCommit: string } {
  const markdown = readFileSync(join(repoRoot, 'VERDICTS.md'), 'utf8');
  const block = /```json\n([\s\S]*?)\n```/.exec(markdown)?.[1];
  if (!block) throw new Error('Verdict JSON is missing');
  const value = record(JSON.parse(block), 'verdict');
  if (
    value.complete !== true ||
    (value.exit_code !== 0 && value.exit_code !== 2)
  )
    throw new Error(
      'Official evaluation is incomplete or failed; preserve it and stop',
    );
  text(value.freeze_commit, 'verdict.freeze_commit');
  return { code: value.exit_code, freezeCommit: value.freeze_commit };
}
export function assertReportReady(report: string): void {
  const headings = [
    'Target, slice and reasoning',
    'Candidate approaches and trade-offs',
    'How AI was used',
    'Verification story',
    'Next two days and scaling',
    'Assumptions made',
  ];
  for (const title of headings) {
    const start = report.indexOf(`# ${title}\n`);
    if (start < 0) throw new Error(`Write-up section missing: ${title}`);
    const end = report.indexOf('\n# ', start + title.length + 3);
    const body = report
      .slice(start + title.length + 3, end < 0 ? undefined : end)
      .replace(/^#+.*$/gm, '')
      .trim();
    if (body.length < 80)
      throw new Error(
        `Write-up section is empty or only a placeholder: ${title}`,
      );
  }
  if (/\b(?:TODO|TBD|NOT IMPLEMENTED)\b/.test(report))
    throw new Error('Write-up still contains unfinished placeholders');
}
function assertRealDiscovery(): void {
  assertPreparationReady(repoRoot);
}
function noRole(): void {
  if (existsSync(join(repoRoot, 'AGENTS.override.md')))
    throw new Error(
      'Operator only: close role sessions and run ./use-role.sh none first',
    );
}
function planHash(plan: Plan): string {
  return sha256(JSON.stringify(plan));
}

// Recipes use the existing fixture shape without expected/checkpoints. No new enum.
export function recipePath(root: string, source: string): string {
  if (!/^\.\.\/held-out\/recipes\/[A-Za-z0-9_-]+\.json$/.test(source))
    throw new Error('Recipe must be an explicit ../held-out/recipes/<id>.json');
  const path = realpathSync(resolve(root, source));
  if (dirname(path) !== realpathSync(resolve(root, '../held-out/recipes')))
    throw new Error('Recipe escapes the registered recipe directory');
  return path;
}
export function createCaptureFreeze(root: string, commit: string): Freeze {
  const registration: unknown = readJson(join(root, '.delivery/recipes.json'));
  const recipes: Record<string, string> = {};
  for (const entry of array(registration, 'registered recipes')) {
    const item = record(entry, 'registered recipe');
    text(item.source, 'recipe.source');
    text(item.sha256, 'recipe.sha256');
    const path = recipePath(root, item.source);
    const recipe = loadFixture(path, false);
    if (
      recipe.expected ||
      recipe.checkpoints ||
      recipe.provenance === 'synthetic' ||
      !recipe.seed_file ||
      !recipe.actions.length
    )
      throw new Error(
        'Pre-registered recipe requires explicit seed/actions and no captured outcomes',
      );
    loadSeed(root, recipe);
    if (recipes[item.source] || sha256(readFileSync(path)) !== item.sha256)
      throw new Error('Duplicate or changed pre-registered recipe');
    recipes[item.source] = item.sha256;
  }
  if (!Object.keys(recipes).length)
    throw new Error('Pre-registered recipes are required before freeze');
  const freeze: Freeze = {
    commit,
    frozen_at: new Date().toISOString(),
    hashes: fingerprints(root),
    recipes,
  };
  writeFileSync(
    join(root, '.delivery/freeze.json'),
    `${JSON.stringify(freeze, null, 2)}\n`,
    { flag: 'wx' },
  );
  save(join(root, '.delivery/state.json'), { stage: 'frozen' });
  return freeze;
}
export function assertRecipeMatches(
  root: string,
  freeze: Freeze,
  item: ImportItem,
  fixture: Fixture,
): void {
  if (!item.recipe_file || !freeze.recipes[item.recipe_file])
    throw new Error('Import does not reference a pre-registered recipe');
  const path = recipePath(root, item.recipe_file);
  if (sha256(readFileSync(path)) !== freeze.recipes[item.recipe_file])
    throw new Error('Pre-registered recipe changed after freeze');
  const recipe = loadFixture(path, false);
  for (const key of [
    'id',
    'provenance',
    'context',
    'seed_file',
    'actions',
  ] as const) {
    // Compare JSON structurally, preserving array/action order, ignoring object key order.
    if (canonical(recipe[key]) !== canonical(fixture[key]))
      throw new Error(
        `Captured case differs from pre-registered recipe: ${key}`,
      );
  }
  if (Date.parse(fixture.source.date) < Date.parse(freeze.frozen_at))
    throw new Error('Held-out capture timestamp predates the recorded freeze');
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(',')}}`;
  return JSON.stringify(value) ?? 'undefined';
}
export function validateRecipeSelection(freeze: Freeze, plan: Plan): void {
  const selected = plan.heldout.map((item) => item.recipe_file);
  if (
    new Set(selected).size !== selected.length ||
    canonical([...selected].sort()) !==
      canonical(Object.keys(freeze.recipes).sort())
  )
    throw new Error(
      'Import plan must cover every pre-registered recipe exactly once',
    );
}
function prepare(): void {
  noRole();
  assertRealDiscovery();
  mkdirSync(join(repoRoot, '.delivery'), { recursive: true });
  const stateFile = join(repoRoot, '.delivery/state.json');
  if (!existsSync(stateFile)) {
    assertClean(repoRoot);
    if (
      existsSync(join(repoRoot, 'VERDICTS.md')) ||
      fixtureFiles(repoRoot, 'held-out').length
    )
      throw new Error('Held-out publication/evaluation already exists');
    if (existsSync(join(repoRoot, '.delivery/freeze.json')))
      throw new Error(
        'An unfinished freeze exists without state; inspect it before continuing',
      );
    run('corepack', ['pnpm@10.11.0', 'check']);
    const freeze = createCaptureFreeze(repoRoot, head(repoRoot));
    console.log(
      `Frozen at ${freeze.commit} (${freeze.frozen_at}). STOP for operator capture. Then write the reviewed .delivery/plan.json and rerun prepare. No results imported or evaluated.`,
    );
    return;
  }
  const state = readState();
  const freeze = readFreeze();
  checkFreeze(freeze);
  const planFile = join(repoRoot, '.delivery/plan.json');
  if (!existsSync(planFile)) {
    console.log(
      'Frozen checkpoint preserved; waiting for operator capture and reviewed import plan.',
    );
    return;
  }
  command('gitleaks', ['version']);
  const plan = validatePlan(readJson(planFile));
  if (
    plan.freeze_commit !== freeze.commit ||
    (state.plan_hash !== undefined && planHash(plan) !== state.plan_hash)
  )
    throw new Error(
      'Reviewed import plan changed or names another frozen commit',
    );
  validateRecipeSelection(freeze, plan);
  if (state.stage === 'prepared') {
    console.log(
      'Already prepared. Finalize the write-up, then run ./deliver.sh finalize.',
    );
    return;
  }
  if (head(repoRoot) !== freeze.commit)
    throw new Error('Prepare must remain on the frozen commit');
  if (state.stage === 'frozen') {
    const staging = mkdtempSync(join(repoRoot, '.delivery/import-'));
    const imports = [
      ...plan.heldout.map((item) => ({ item, group: 'fixtures/held-out' })),
      ...plan.probes.map((item) => ({ item, group: 'research/probes' })),
    ];
    for (const { item, group } of imports) {
      const source = resolveSource(item.source);
      const data = readFileSync(source);
      if (sha256(data) !== item.sha256)
        throw new Error(`Reviewed import changed: ${item.source}`);
      const parsed: unknown = JSON.parse(data.toString('utf8'));
      if (group === 'fixtures/held-out') {
        const fixture = loadFixture(source);
        loadSeed(repoRoot, fixture);
        assertRecipeMatches(repoRoot, freeze, item, fixture);
        if (fixture.provenance === 'synthetic')
          throw new Error('Real held-out evidence is required');
      }
      const mentions =
        JSON.stringify(parsed).match(
          /Cookie|Authorization|Cart-Token|nonce/gi,
        ) ?? [];
      if (mentions.length)
        console.log(
          `Review alert: ${item.source} contains ${mentions.length} sensitive-key mentions; operator attestation and exact hash required (values not printed).`,
        );
      const file = join(staging, group, basename(source));
      mkdirSync(dirname(file), { recursive: true });
      copyFileSync(source, file);
    }
    scan(staging);
    if (state.plan_hash === undefined) {
      state.plan_hash = planHash(plan);
      save(stateFile, state);
    }
    for (const file of walk(staging)) {
      const destination = join(repoRoot, relative(staging, file));
      mkdirSync(dirname(destination), { recursive: true });
      if (existsSync(destination)) {
        if (sha256(readFileSync(destination)) !== sha256(readFileSync(file)))
          throw new Error(
            `Refusing to replace existing evidence: ${destination}`,
          );
      } else copyFileSync(file, destination);
    }
    const recipeDirectory = join(repoRoot, 'ai/traces/heldout-recipes');
    mkdirSync(recipeDirectory, { recursive: true });
    for (const source of Object.keys(freeze.recipes)) {
      const path = recipePath(repoRoot, source);
      if (sha256(readFileSync(path)) !== freeze.recipes[source])
        throw new Error('Recipe changed');
      const destination = join(recipeDirectory, basename(source));
      if (
        existsSync(destination) &&
        sha256(readFileSync(destination)) !== freeze.recipes[source]
      )
        throw new Error('Refusing to overwrite a published recipe');
      copyFileSync(path, destination);
    }
    const publishedFreeze = join(repoRoot, 'ai/traces/delivery-freeze.json');
    const freezeBytes = readFileSync(join(repoRoot, '.delivery/freeze.json'));
    if (
      existsSync(publishedFreeze) &&
      sha256(readFileSync(publishedFreeze)) !== sha256(freezeBytes)
    )
      throw new Error('Refusing to overwrite published freeze');
    writeFileSync(publishedFreeze, freezeBytes);
    const provenanceFile = join(repoRoot, 'fixtures/PROVENANCE.md');
    const marker = `<!-- delivery-freeze ${freeze.commit} -->`;
    const provenance = readFileSync(provenanceFile, 'utf8');
    if (!provenance.includes(marker)) {
      const cell = (value: string | undefined) =>
        (value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
      const rows = plan.heldout.map((item) => {
        const fixture = loadFixture(
          join(repoRoot, 'fixtures/held-out', basename(item.source)),
        );
        return `| ${fixture.id} | ${fixture.provenance} | ${fixture.source.date} | ${cell(item.session_recipe)} | ${cell(item.action_channel)}; ${cell(item.read_endpoint)} | ${item.sha256} | ${cell(item.independent_replay)} | ${new Date().toISOString()} |`;
      });
      writeFileSync(
        provenanceFile,
        `${provenance}\n${marker}\n\n| id | provenance | timestamp | session recipe and actions | action channel and read endpoint | sanitized JSON SHA-256 | actual independent replay | held-out entry date |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`,
      );
    }
    state.stage = 'imported';
    save(stateFile, state);
  }
  if (state.stage === 'imported') {
    const expectedFiles = plan.heldout
      .map((item) => basename(item.source))
      .sort();
    const importedFiles = fixtureFiles(repoRoot, 'held-out')
      .map((file) => basename(file))
      .sort();
    if (canonical(expectedFiles) !== canonical(importedFiles))
      throw new Error(
        'Published held-out selection differs from reviewed plan',
      );
    for (const item of plan.heldout) {
      const path = join(repoRoot, 'fixtures/held-out', basename(item.source));
      if (sha256(readFileSync(path)) !== item.sha256)
        throw new Error('Imported evidence changed before evaluation');
      assertRecipeMatches(repoRoot, freeze, item, loadFixture(path));
    }
    if (!existsSync(join(repoRoot, 'VERDICTS.md'))) {
      const result = spawnSync('corepack', ['pnpm@10.11.0', 'heldout'], {
        cwd: repoRoot,
        stdio: 'inherit',
      });
      if (result.status !== 0 && result.status !== 2)
        throw new Error(
          'Official evaluation failed; do not overwrite a verdict or retry executed cases',
        );
    }
    const verdict = readVerdict();
    if (verdict.freezeCommit !== freeze.commit)
      throw new Error('Verdict belongs to another frozen commit');
    state.stage = 'evaluated';
    state.evaluation_code = verdict.code;
    save(stateFile, state);
  }
  if (state.stage === 'evaluated') {
    writeFileSync(
      join(repoRoot, 'fixtures/MANIFEST.sha256'),
      manifestContent(repoRoot),
    );
    state.evidence_hashes = Object.fromEntries(
      evidencePaths(plan).map((file) => [
        file,
        sha256(readFileSync(join(repoRoot, file))),
      ]),
    );
    state.stage = 'prepared';
    save(stateFile, state);
  }
  console.log(
    `Prepared at ${freeze.commit}. Evaluation exit ${state.evaluation_code}; divergences remain reportable. Complete WRITEUP.md without changing frozen code, then run ./deliver.sh finalize.`,
  );
}

export function packagingPath(path: string): boolean {
  return (
    ['README.md', 'WRITEUP.md', 'SETUP-NOTES.md', 'VERDICTS.md'].includes(
      path,
    ) || /^(docs|ai\/traces|fixtures|research\/probes)\//.test(path)
  );
}
async function finalize(): Promise<void> {
  noRole();
  command('gitleaks', ['version']);
  const state = readState();
  if (state.stage !== 'prepared' || !state.evidence_hashes)
    throw new Error('Run prepare successfully before finalize');
  const freeze = readFreeze();
  checkFreeze(freeze);
  const plan = validatePlan(readJson(join(repoRoot, '.delivery/plan.json')));
  if (planHash(plan) !== state.plan_hash)
    throw new Error('Reviewed plan changed');
  for (const [file, hash] of Object.entries(state.evidence_hashes))
    if (sha256(readFileSync(join(repoRoot, file))) !== hash)
      throw new Error(`Evaluated evidence changed: ${file}`);
  const verdict = readVerdict();
  if (verdict.freezeCommit !== freeze.commit)
    throw new Error('Verdict freeze mismatch');
  assertRealDiscovery();
  assertReportReady(readFileSync(join(repoRoot, 'WRITEUP.md'), 'utf8'));
  verifyManifest(repoRoot);
  run('corepack', ['pnpm@10.11.0', 'check']);
  const status = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all', '-z'],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  const paths = status
    ? status
        .split('\0')
        .filter(Boolean)
        .map((entry) => {
          if (
            entry.slice(0, 2).includes('R') ||
            entry.slice(0, 2).includes('C')
          )
            throw new Error(
              'Resolve packaging renames explicitly before finalize',
            );
          return entry.slice(3);
        })
    : [];
  const probes = plan.probes.map(
    (item) => `research/probes/${basename(item.source)}`,
  );
  for (const path of paths)
    if (!packagingPath(path))
      throw new Error(`Unapproved packaging path: ${path}`);
  console.log(command('git', ['diff', 'HEAD', '--', ...paths]));
  console.log(
    `Packaging files:\n${[...new Set([...paths, ...probes])].join('\n')}`,
  );
  for (const file of paths)
    if (
      existsSync(join(repoRoot, file)) &&
      command('git', ['ls-files', '--', file]) === ''
    )
      console.log(
        `New file ${file}:\n${readFileSync(join(repoRoot, file), 'utf8')}`,
      );
  if (
    paths.length ||
    probes.some((file) => command('git', ['ls-files', '--', file]) === '')
  ) {
    if (!stdin.isTTY)
      throw new Error(
        'Finalize requires an operator terminal to review and approve the packaging commit',
      );
    const prompt = createInterface({ input: stdin, output: stdout });
    const answer = await prompt.question(
      'Have you reviewed the complete diff, new files, provenance and verdicts? Type COMMIT to create the local packaging commit: ',
    );
    prompt.close();
    if (answer !== 'COMMIT') throw new Error('Packaging not approved');
    if (paths.length) run('git', ['add', '--', ...paths]);
    if (probes.length) run('git', ['add', '-f', '--', ...probes]);
    run('git', [
      'commit',
      '-m',
      'Package frozen replication evidence and write-up',
    ]);
  }
  assertClean(repoRoot);
  checkFreeze(freeze);
  const delivered = head(repoRoot);
  const clone = mkdtempSync(join(dirname(repoRoot), 'delivery-audit-'));
  run('git', ['clone', '--no-local', repoRoot, clone]);
  run('git', ['checkout', '--detach', delivered], clone);
  if (head(clone) !== delivered) throw new Error('Audit clone HEAD mismatch');
  run('corepack', ['pnpm@10.11.0', 'install', '--frozen-lockfile'], clone);
  run('corepack', ['pnpm@10.11.0', 'check'], clone);
  scan(clone, true);
  const exported = mkdtempSync(join(repoRoot, '.delivery/export-'));
  const archive = execFileSync('git', ['archive', delivered], {
    cwd: clone,
    maxBuffer: 64 * 1024 * 1024,
  });
  const extraction = spawnSync('tar', ['-xf', '-', '-C', exported], {
    input: archive,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  if (extraction.status !== 0)
    throw new Error('Cannot export tracked delivery files for scanning');
  scan(exported);
  if (head(repoRoot) !== delivered || head(clone) !== delivered)
    throw new Error('HEAD moved during delivery audit');
  assertClean(repoRoot);
  save(join(repoRoot, '.delivery/audit.json'), {
    commit: delivered,
    clone,
    audited_at: new Date().toISOString(),
    gitleaks: command('gitleaks', ['version']),
    heldout_exit: verdict.code,
    checks: 'PASS',
  });
  console.log(
    `Delivery commit: ${delivered}\nFresh clone install/check: PASS\nHistory and delivered-file secret scans: PASS\nHeld-out exit: ${verdict.code}${verdict.code === 2 ? ' (known divergences recorded in VERDICTS.md)' : ''}`,
  );
  console.log(
    'Write-up: WRITEUP.md, VERDICTS.md\nRunnable evidence: src/, harness/, target/, fixtures/, tests/, package/lockfile, README.md\nAgent artifacts and working annexes: AGENTS.md, ai/, scripts/, .codex/hooks.json, use-role.sh, deliver.sh, SETUP-NOTES.md, docs/, research/',
  );
  console.log(
    'No push performed. Antoine may push once or archive this exact audited commit.',
  );
}
if (isMain(import.meta.url)) {
  try {
    if (process.argv.length !== 3)
      throw new Error('Usage: ./deliver.sh prepare|finalize');
    if (process.argv[2] === 'prepare') prepare();
    else if (process.argv[2] === 'finalize') await finalize();
    else throw new Error('Usage: ./deliver.sh prepare|finalize');
  } catch (error) {
    console.error(String(error));
    process.exitCode = 1;
  }
}
