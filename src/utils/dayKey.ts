const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function isValidDateKey(dateKey: string): boolean {
  if (!DATE_KEY_RE.test(dateKey)) return false;
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function formatDateKeyLabel(dateKey: string): string {
  if (!isValidDateKey(dateKey)) return dateKey;
  const [, m, d] = dateKey.split("-").map(Number);
  return `${m}月${d}日`;
}

export function dateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function todayDateKey(): string {
  return toDateKey(new Date());
}

/** Lexicographic compare works for zero-padded YYYY-MM-DD. */
export function isFutureDateKey(dateKey: string): boolean {
  if (!isValidDateKey(dateKey)) return false;
  return dateKey > todayDateKey();
}
