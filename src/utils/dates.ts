/** Small date helpers for ISO strings and month keys (YYYY-MM). */

/** Returns today's date in ISO format: `YYYY-MM-DD` (local time). */
export function todayISODate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Extracts the month key (`YYYY-MM`) from an ISO date string (`YYYY-MM-DD`). */
export function monthKeyFromISODate(isoDate: string): string {
  // isoDate: YYYY-MM-DD
  return isoDate.slice(0, 7);
}

/** Returns the current month key (`YYYY-MM`) in local time. */
export function currentMonthKey(): string {
  return monthKeyFromISODate(todayISODate());
}

/**
 * Compares ISO dates in descending order (newest first).
 * Lexical comparison works for ISO `YYYY-MM-DD` strings.
 */
export function compareISODateDesc(a: string, b: string): number {
  // lexical compare works for YYYY-MM-DD
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

/** Converts a `YYYY-MM` month key to a localized label (e.g. "January 2026"). */
export function monthLabel(yyyyMm: string): string {
  if (!/^\d{4}-\d{2}$/.test(yyyyMm)) return yyyyMm;
  const [y, m] = yyyyMm.split("-").map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return yyyyMm;
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}
