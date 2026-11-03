// All "today" and "this month" boundaries use Nepal time (Asia/Kathmandu, UTC+5:45).
// Nepal has a fixed offset and no daylight saving, so a constant offset is enough.
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, '0');

// Shift the instant so UTC getters read the Nepal wall clock.
const toNepal = (d: Date) => new Date(d.getTime() + NEPAL_OFFSET_MS);
const fromNepal = (d: Date) => new Date(d.getTime() - NEPAL_OFFSET_MS);

/** 'YYYY-MM-DD' for the given instant, in Nepal time. */
export function nepalDateKey(value: Date | string): string {
  const n = toNepal(new Date(value));
  return `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(n.getUTCDate())}`;
}

/** Real instant of 00:00 today in Nepal. */
export function startOfNepalDay(now: Date = new Date()): Date {
  const n = toNepal(now);
  return fromNepal(new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())));
}

/** Real instant of 00:00 on the 1st of the current month in Nepal. */
export function startOfNepalMonth(now: Date = new Date()): Date {
  const n = toNepal(now);
  return fromNepal(new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1)));
}

/** Every date key from the 1st of this month up to today, in Nepal time. */
export function monthToDateKeys(now: Date = new Date()): string[] {
  const keys: string[] = [];
  const end = nepalDateKey(now);
  const n = toNepal(startOfNepalMonth(now));
  for (let day = 1; ; day++) {
    const key = `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(day)}`;
    keys.push(key);
    if (key === end) break;
  }
  return keys;
}

/** Money is whole rupees, shown like "Rs 1,250". */
export function formatRs(amount: number): string {
  return `Rs ${amount.toLocaleString('en-US')}`;
}

// Self-check for the day boundary: 18:30 UTC is already the next day in Nepal.
if (import.meta.env.DEV) {
  console.assert(
    nepalDateKey('2026-11-03T18:30:00Z') === '2026-11-04',
    'Nepal day boundary is wrong',
  );
}
