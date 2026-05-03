import type { CycleStatus, EnergyLevel, TargetArea } from "@/data/workoutTemplates";
import type { TrainingChoice } from "@/lib/workoutMatcher";

export const CURRENT_WORKOUT_SELECTION_KEY = "fitness.currentWorkoutSelection.v1";

export type CurrentWorkoutSelectionV1 = {
  cycleStatus: CycleStatus;
  energyLevel: EnergyLevel;
  selectedTraining: TrainingChoice;
  matchedTemplateId: string;
  matchedTemplateTitle: string;
  targetArea: TargetArea;
  selectedAt: string;
};

const CYCLE: readonly CycleStatus[] = ["period", "not_period", "uncertain"];
const ENERGY: readonly EnergyLevel[] = ["low", "normal", "high"];
const TRAINING: readonly TrainingChoice[] = [
  "smart",
  "upper_push",
  "upper_pull",
  "lower_body",
  "full_body",
];
const TARGET: readonly TargetArea[] = [
  "lower_body",
  "upper_push",
  "upper_pull",
  "full_body",
  "core",
  "recovery",
];

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isCycleStatus(v: unknown): v is CycleStatus {
  return typeof v === "string" && (CYCLE as readonly string[]).includes(v);
}

function isEnergyLevel(v: unknown): v is EnergyLevel {
  return typeof v === "string" && (ENERGY as readonly string[]).includes(v);
}

function isTrainingChoice(v: unknown): v is TrainingChoice {
  return typeof v === "string" && (TRAINING as readonly string[]).includes(v);
}

function isTargetArea(v: unknown): v is TargetArea {
  return typeof v === "string" && (TARGET as readonly string[]).includes(v);
}

export function loadCurrentWorkoutSelection(): CurrentWorkoutSelectionV1 | null {
  if (!canUseLocalStorage()) return null;

  const raw = window.localStorage.getItem(CURRENT_WORKOUT_SELECTION_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") return null;

    const o = parsed as Record<string, unknown>;
    if (
      !isCycleStatus(o.cycleStatus) ||
      !isEnergyLevel(o.energyLevel) ||
      !isTrainingChoice(o.selectedTraining) ||
      typeof o.matchedTemplateId !== "string" ||
      !o.matchedTemplateId ||
      typeof o.matchedTemplateTitle !== "string" ||
      !isTargetArea(o.targetArea) ||
      typeof o.selectedAt !== "string"
    ) {
      return null;
    }

    return {
      cycleStatus: o.cycleStatus,
      energyLevel: o.energyLevel,
      selectedTraining: o.selectedTraining,
      matchedTemplateId: o.matchedTemplateId,
      matchedTemplateTitle: o.matchedTemplateTitle,
      targetArea: o.targetArea,
      selectedAt: o.selectedAt,
    };
  } catch {
    return null;
  }
}

export function saveCurrentWorkoutSelection(payload: CurrentWorkoutSelectionV1): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(CURRENT_WORKOUT_SELECTION_KEY, JSON.stringify(payload));
}
