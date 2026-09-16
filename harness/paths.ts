import { fileURLToPath, pathToFileURL } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../', import.meta.url));
export function isMain(url: string): boolean {
  return Boolean(
    process.argv[1] && pathToFileURL(process.argv[1]).href === url,
  );
}
