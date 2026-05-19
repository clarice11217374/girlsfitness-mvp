import { isFutureDateKey, isValidDateKey } from "@/utils/dayKey";

export const CYCLE_RECORDS_KEY = "fitness.cycle.records.v1";

export type CycleRecordEntryV1 = {
  isPeriod: boolean;
  updatedAt: string;
};

export type CycleRecordsV1 = Record<string, CycleRecordEntryV1>;

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function parseEntry(value: unknown): CycleRecordEntryV1 | null {
  if (value === null || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  if (o.isPeriod !== true) return null;
  if (!isNonEmptyString(o.updatedAt)) return null;
  return { isPeriod: true, updatedAt: o.updatedAt };
}

function parseCycleRecords(value: unknown): CycleRecordsV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return {};

  const result: CycleRecordsV1 = {};
  for (const [dateKey, raw] of Object.entries(value)) {
    if (!isValidDateKey(dateKey)) continue;
    const entry = parseEntry(raw);
    if (entry) result[dateKey] = entry;
  }
  return result;
}

function writeCycleRecords(data: CycleRecordsV1): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(CYCLE_RECORDS_KEY, JSON.stringify(data));
}

export function loadCycleRecords(): CycleRecordsV1 {
  if (!canUseLocalStorage()) return {};

  const raw = window.localStorage.getItem(CYCLE_RECORDS_KEY);
  if (!raw) return {};

  try {
    return parseCycleRecords(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function getCycleRecord(dateKey: string): CycleRecordEntryV1 | null {
  if (!isValidDateKey(dateKey)) return null;
  return loadCycleRecords()[dateKey] ?? null;
}

export function setCyclePeriod(dateKey: string, isPeriod: boolean): void {
  if (!isValidDateKey(dateKey)) return;
  if (isPeriod && isFutureDateKey(dateKey)) return;

  const data = loadCycleRecords();
  if (!isPeriod) {
    delete data[dateKey];
    writeCycleRecords(data);
    return;
  }

  data[dateKey] = {
    isPeriod: true,
    updatedAt: new Date().toISOString(),
  };
  writeCycleRecords(data);
}

export function clearCycleRecords(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(CYCLE_RECORDS_KEY);
}
