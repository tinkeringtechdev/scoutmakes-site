import { execFileSync } from 'node:child_process';

/**
 * Date of the last git commit that touched `file` (path relative to the repo root).
 *
 * Commits whose message contains "[skip-updated]" are ignored, so site-wide chores
 * (reformatting, renames) can touch a page without bumping its "Last updated" stamp.
 *
 * Returns null if git is unavailable or the file has no history (e.g. a shallow clone).
 */
export function lastUpdated(file: string): Date | null {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%aI', '--invert-grep', '--grep=\\[skip-updated\\]', '--', file],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}

export function formatUpdated(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
    timeZoneName: 'short',
  }).format(date);
}
