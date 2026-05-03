import {
  type CycleStatus,
  type EnergyLevel,
  getWorkoutTemplateById,
  type TargetArea,
  type WorkoutTemplate,
  workoutTemplates,
} from "@/data/workoutTemplates";

if (workoutTemplates.length === 0) {
  throw new Error("workoutTemplates: library is empty");
}

const TEMPLATE_IDS = {
  upperPush: "upper-push-strength-day",
  upperPull: "upper-pull-strength-day",
  lowerCore: "lower-core-strength-day",
  fullBody: "full-body-cardio-day",
  periodRecovery: "period-recovery-day",
} as const;

const TARGET_AREA_VALUES: readonly TargetArea[] = [
  "lower_body",
  "upper_push",
  "upper_pull",
  "full_body",
  "core",
  "recovery",
];

function isPeriodLow(cycleStatus: CycleStatus, energyLevel: EnergyLevel): boolean {
  return cycleStatus === "period" && energyLevel === "low";
}

function isTargetArea(value: unknown): value is TargetArea {
  return typeof value === "string" && TARGET_AREA_VALUES.includes(value as TargetArea);
}

export type TrainingChoice =
  | "smart"
  | "upper_push"
  | "upper_pull"
  | "lower_body"
  | "full_body";

export type MatchWorkoutParams = {
  cycleStatus: CycleStatus;
  energyLevel: EnergyLevel;
  selectedTraining: TrainingChoice;
  lastTargetArea?: TargetArea | null;
};

export function getMatchedWorkoutTemplate(params: MatchWorkoutParams): WorkoutTemplate {
  const { cycleStatus, energyLevel, selectedTraining, lastTargetArea } = params;

  if (isPeriodLow(cycleStatus, energyLevel)) {
    return getWorkoutTemplateById(TEMPLATE_IDS.periodRecovery);
  }

  if (selectedTraining !== "smart") {
    const directId: Record<Exclude<TrainingChoice, "smart">, string> = {
      upper_push: TEMPLATE_IDS.upperPush,
      upper_pull: TEMPLATE_IDS.upperPull,
      lower_body: TEMPLATE_IDS.lowerCore,
      full_body: TEMPLATE_IDS.fullBody,
    };
    return getWorkoutTemplateById(directId[selectedTraining]);
  }

  const last = lastTargetArea ?? null;

  if (last === "upper_push" || last === "upper_pull") {
    return getWorkoutTemplateById(TEMPLATE_IDS.lowerCore);
  }

  if (last === "lower_body") {
    return getWorkoutTemplateById(TEMPLATE_IDS.upperPush);
  }

  if (last === "full_body") {
    return getWorkoutTemplateById(TEMPLATE_IDS.upperPush);
  }

  if (last === "recovery" || last === null) {
    return getWorkoutTemplateById(TEMPLATE_IDS.fullBody);
  }

  // lastTargetArea 为 core 等未单独列出的情况：与「无记录」类似，给全身模板
  return getWorkoutTemplateById(TEMPLATE_IDS.fullBody);
}

/** 从记录数组中读取最近一次出现的 targetArea；无有效值时返回 null。 */
export function getLastTargetAreaFromRecords(records: unknown): TargetArea | null {
  if (!Array.isArray(records) || records.length === 0) {
    return null;
  }

  for (let i = records.length - 1; i >= 0; i -= 1) {
    const row = records[i];
    if (row === null || row === undefined || typeof row !== "object") {
      continue;
    }
    const candidate = (row as Record<string, unknown>).targetArea;
    if (isTargetArea(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function getTrainingChoiceLabel(choice: TrainingChoice): string {
  const labels: Record<TrainingChoice, string> = {
    smart: "智能推荐",
    upper_push: "上肢推",
    upper_pull: "上肢拉",
    lower_body: "臀腿核心",
    full_body: "全身燃脂",
  };
  return labels[choice];
}
