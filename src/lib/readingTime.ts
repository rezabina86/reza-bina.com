/**
 * Reading time for a post body, in whole minutes (~200 wpm, minimum 1).
 *
 * Shared by the post page and the home page's writing tile so the two can
 * never disagree about how long the same essay takes to read.
 */
export function readingMinutes(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}
