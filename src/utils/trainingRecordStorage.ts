const STORAGE_KEY = "fitness.training.records.v1";
const MAX_RECORDS = 200;

export type TrainingRecord = {
  id: string;
  completedAt: string;
  workoutTitle: string;
  totalExercises: number;
  totalSets: number;
  durationMinutes: number;
  feeling?: string;
  notes?: string;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParseRecords(raw: string | null): TrainingRecord[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is TrainingRecord => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.completedAt === "string" &&
        typeof item.workoutTitle === "string" &&
        typeof item.totalExercises === "number" &&
        typeof item.totalSets === "number" &&
        typeof item.durationMinutes === "number"
      );
    });
  } catch {
    return [];
  }
}

function writeRecords(records: TrainingRecord[]): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
}

export function getTrainingRecords(): TrainingRecord[] {
  if (!canUseLocalStorage()) return [];
  return safeParseRecords(window.localStorage.getItem(STORAGE_KEY));
}

export function saveTrainingRecord(
  payload: Omit<TrainingRecord, "id" | "completedAt"> & Partial<Pick<TrainingRecord, "id" | "completedAt">>,
): TrainingRecord {
  const record: TrainingRecord = {
    ...payload,
    id: payload.id ?? crypto.randomUUID(),
    completedAt: payload.completedAt ?? new Date().toISOString(),
  };

  const next = [record, ...getTrainingRecords()];
  writeRecords(next);
  return record;
}

export function removeTrainingRecord(recordId: string): void {
  if (!recordId) return;
  const next = getTrainingRecords().filter((record) => record.id !== recordId);
  writeRecords(next);
}

export function clearTrainingRecords(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getTrainingRecordById(recordId: string): TrainingRecord | null {
  if (!recordId) return null;
  return getTrainingRecords().find((record) => record.id === recordId) ?? null;
}
