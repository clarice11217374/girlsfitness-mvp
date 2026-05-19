const WORKOUT_EXEC_SUMMARY_KEY = "fitness.workoutExecSummary.v1";

export type WorkoutExecSummaryV1 = {
  workoutTitle: string;
  templateId: string;
  targetArea: string;
  totalExercises: number;
  totalSets: number;
  durationMinutes: number;
  completedAt: string;
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export function writeWorkoutExecSummary(payload: WorkoutExecSummaryV1): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(WORKOUT_EXEC_SUMMARY_KEY, JSON.stringify(payload));
}

export function readWorkoutExecSummary(): WorkoutExecSummaryV1 | null {
  if (!canUseLocalStorage()) return null;
  const raw = window.localStorage.getItem(WORKOUT_EXEC_SUMMARY_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (
      !isNonEmptyString(o.workoutTitle) ||
      !isNonEmptyString(o.templateId) ||
      !isNonEmptyString(o.targetArea) ||
      !isFiniteNumber(o.totalExercises) ||
      !isFiniteNumber(o.totalSets) ||
      !isFiniteNumber(o.durationMinutes)
    ) {
      return null;
    }
    const completedAt = isNonEmptyString(o.completedAt) ? o.completedAt : new Date().toISOString();
    return {
      workoutTitle: o.workoutTitle,
      templateId: o.templateId,
      targetArea: o.targetArea,
      totalExercises: o.totalExercises,
      totalSets: o.totalSets,
      durationMinutes: o.durationMinutes,
      completedAt,
    };
  } catch {
    return null;
  }
}

export function clearWorkoutExecSummary(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(WORKOUT_EXEC_SUMMARY_KEY);
}
