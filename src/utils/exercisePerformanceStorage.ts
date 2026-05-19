export const EXERCISE_PERFORMANCE_KEY = "fitness.exercisePerformance.v1";

export type ExercisePerformanceEntryV1 = {
  weightKg?: number;
  reps?: number;
  updatedAt: string;
};

export type ExercisePerformanceV1 = Record<string, Record<string, ExercisePerformanceEntryV1>>;

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function parseEntry(value: unknown): ExercisePerformanceEntryV1 | null {
  if (value === null || typeof value !== "object") return null;

  const o = value as Record<string, unknown>;
  if (!isNonEmptyString(o.updatedAt)) return null;

  const weightKg = isFiniteNumber(o.weightKg) ? o.weightKg : undefined;
  const reps = isFiniteNumber(o.reps) ? o.reps : undefined;
  if (o.weightKg !== undefined && weightKg === undefined) return null;
  if (o.reps !== undefined && reps === undefined) return null;
  if (weightKg === undefined && reps === undefined) return null;

  const entry: ExercisePerformanceEntryV1 = { updatedAt: o.updatedAt };
  if (weightKg !== undefined) entry.weightKg = weightKg;
  if (reps !== undefined) entry.reps = reps;
  return entry;
}

function parseExerciseMap(value: unknown): Record<string, ExercisePerformanceEntryV1> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return {};

  const result: Record<string, ExercisePerformanceEntryV1> = {};
  for (const [exerciseId, rawEntry] of Object.entries(value)) {
    if (!isNonEmptyString(exerciseId)) continue;
    const entry = parseEntry(rawEntry);
    if (entry) result[exerciseId] = entry;
  }
  return result;
}

function parsePerformanceRoot(value: unknown): ExercisePerformanceV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return {};

  const result: ExercisePerformanceV1 = {};
  for (const [templateId, rawExercises] of Object.entries(value)) {
    if (!isNonEmptyString(templateId)) continue;
    const exercises = parseExerciseMap(rawExercises);
    if (Object.keys(exercises).length > 0) {
      result[templateId] = exercises;
    }
  }
  return result;
}

function writePerformance(data: ExercisePerformanceV1): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(EXERCISE_PERFORMANCE_KEY, JSON.stringify(data));
}

export function loadExercisePerformance(): ExercisePerformanceV1 {
  if (!canUseLocalStorage()) return {};

  const raw = window.localStorage.getItem(EXERCISE_PERFORMANCE_KEY);
  if (!raw) return {};

  try {
    return parsePerformanceRoot(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function getExercisePerformance(
  templateId: string,
  exerciseId: string,
): ExercisePerformanceEntryV1 | null {
  if (!isNonEmptyString(templateId) || !isNonEmptyString(exerciseId)) return null;

  const template = loadExercisePerformance()[templateId];
  if (!template) return null;
  return template[exerciseId] ?? null;
}

export function upsertExercisePerformance(
  templateId: string,
  exerciseId: string,
  partial: Partial<Pick<ExercisePerformanceEntryV1, "weightKg" | "reps">>,
): ExercisePerformanceEntryV1 | null {
  if (!isNonEmptyString(templateId) || !isNonEmptyString(exerciseId)) return null;

  if (
    partial.weightKg !== undefined &&
    !isFiniteNumber(partial.weightKg)
  ) {
    return null;
  }
  if (partial.reps !== undefined && !isFiniteNumber(partial.reps)) return null;

  const data = loadExercisePerformance();
  const existing = data[templateId]?.[exerciseId];

  const nextWeight =
    partial.weightKg !== undefined ? partial.weightKg : existing?.weightKg;
  const nextReps = partial.reps !== undefined ? partial.reps : existing?.reps;

  if (nextWeight === undefined && nextReps === undefined) return null;

  const entry: ExercisePerformanceEntryV1 = {
    updatedAt: new Date().toISOString(),
    ...(nextWeight !== undefined ? { weightKg: nextWeight } : {}),
    ...(nextReps !== undefined ? { reps: nextReps } : {}),
  };

  const templateExercises = { ...(data[templateId] ?? {}), [exerciseId]: entry };
  writePerformance({ ...data, [templateId]: templateExercises });
  return entry;
}

export function clearExercisePerformance(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(EXERCISE_PERFORMANCE_KEY);
}
