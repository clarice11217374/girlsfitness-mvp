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

const LEGACY_TEMPLATE_IDS = {
  upperPush: "upper-push-strength-day",
  upperPull: "upper-pull-strength-day",
  lowerCore: "lower-core-strength-day",
  fullBody: "full-body-cardio-day",
  periodRecovery: "period-recovery-day",
} as const;

const VARIANT_TEMPLATE_IDS = {
  upperPush: {
    gentle: "upper-push-gentle",
    standard: "upper-push-standard",
    plus: "upper-push-plus",
  },
  upperPull: {
    gentle: "upper-pull-gentle",
    standard: "upper-pull-standard",
    plus: "upper-pull-plus",
  },
  lowerCore: {
    gentle: "lower-core-gentle",
    standard: "lower-core-standard",
    plus: "lower-core-plus",
  },
  periodRecovery: {
    gentle: "period-recovery-gentle",
    standard: "period-recovery-standard",
  },
} as const;

const TARGET_AREA_VALUES: readonly TargetArea[] = [
  "lower_body",
  "upper_push",
  "upper_pull",
  "full_body",
  "core",
  "recovery",
];

type IntensityTier = "gentle" | "standard" | "plus";
type BodyTrainingChoice = Exclude<TrainingChoice, "smart" | "full_body">;

function isTargetArea(value: unknown): value is TargetArea {
  return typeof value === "string" && TARGET_AREA_VALUES.includes(value as TargetArea);
}

function tierFromEnergy(energyLevel: EnergyLevel): IntensityTier {
  if (energyLevel === "low") return "gentle";
  if (energyLevel === "high") return "plus";
  return "standard";
}

function isPeriodCycle(cycleStatus: CycleStatus): boolean {
  return cycleStatus === "period";
}

function templateExists(templateId: string): boolean {
  return workoutTemplates.some((item) => item.meta.id === templateId);
}

function resolveTemplateId(templateId: string): string {
  if (templateExists(templateId)) return templateId;
  return LEGACY_TEMPLATE_IDS.upperPush;
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

function periodTemplateId(energyLevel: EnergyLevel): string {
  return energyLevel === "low"
    ? VARIANT_TEMPLATE_IDS.periodRecovery.gentle
    : VARIANT_TEMPLATE_IDS.periodRecovery.standard;
}

function bodyTemplateId(area: BodyTrainingChoice, tier: IntensityTier): string {
  if (area === "upper_push") return VARIANT_TEMPLATE_IDS.upperPush[tier];
  if (area === "upper_pull") return VARIANT_TEMPLATE_IDS.upperPull[tier];
  return VARIANT_TEMPLATE_IDS.lowerCore[tier];
}

type SmartRoute =
  | { kind: "body"; area: BodyTrainingChoice }
  | { kind: "full_body" }
  | { kind: "recovery" };

function shouldUseRecoveryRoute(cycleStatus: CycleStatus, energyLevel: EnergyLevel): boolean {
  return isPeriodCycle(cycleStatus) || energyLevel === "low";
}

function smartRouteFromLast(
  lastTargetArea: TargetArea | null,
  cycleStatus: CycleStatus,
  energyLevel: EnergyLevel,
): SmartRoute {
  if (lastTargetArea === "upper_push" || lastTargetArea === "upper_pull") {
    return { kind: "body", area: "lower_body" };
  }
  if (lastTargetArea === "lower_body") {
    return { kind: "body", area: "upper_push" };
  }
  if (lastTargetArea === "full_body") {
    return { kind: "body", area: "upper_push" };
  }
  if (lastTargetArea === "recovery") {
    if (shouldUseRecoveryRoute(cycleStatus, energyLevel)) {
      return { kind: "recovery" };
    }
    return { kind: "body", area: "upper_push" };
  }
  return { kind: "full_body" };
}

function matchSmartTemplate(
  lastTargetArea: TargetArea | null,
  energyLevel: EnergyLevel,
  cycleStatus: CycleStatus,
): WorkoutTemplate {
  const tier = tierFromEnergy(energyLevel);
  const route = smartRouteFromLast(lastTargetArea, cycleStatus, energyLevel);

  if (route.kind === "recovery") {
    return getWorkoutTemplateById(
      resolveTemplateId(
        energyLevel === "low"
          ? VARIANT_TEMPLATE_IDS.periodRecovery.gentle
          : VARIANT_TEMPLATE_IDS.periodRecovery.standard,
      ),
    );
  }

  if (route.kind === "full_body") {
    return getWorkoutTemplateById(LEGACY_TEMPLATE_IDS.fullBody);
  }

  return getWorkoutTemplateById(resolveTemplateId(bodyTemplateId(route.area, tier)));
}

export function getMatchedWorkoutTemplate(params: MatchWorkoutParams): WorkoutTemplate {
  const { cycleStatus, energyLevel, selectedTraining, lastTargetArea } = params;

  if (isPeriodCycle(cycleStatus)) {
    return getWorkoutTemplateById(resolveTemplateId(periodTemplateId(energyLevel)));
  }

  const tier = tierFromEnergy(energyLevel);

  if (selectedTraining !== "smart") {
    if (selectedTraining === "full_body") {
      return getWorkoutTemplateById(LEGACY_TEMPLATE_IDS.fullBody);
    }
    return getWorkoutTemplateById(
      resolveTemplateId(bodyTemplateId(selectedTraining, tier)),
    );
  }

  return matchSmartTemplate(lastTargetArea ?? null, energyLevel, cycleStatus);
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
