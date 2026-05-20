import {
  getWorkoutTemplateById,
  type CycleStatus,
  type EnergyLevel,
  type TargetArea,
} from "@/data/workoutTemplates";

export type SmartResultCopy = {
  reason: string;
  knowledge: string;
  tip: string;
};

export type SmartResultCopyParams = {
  cycleStatus: CycleStatus;
  energyLevel: EnergyLevel;
  matchedTemplateId: string;
  lastTargetArea: TargetArea | null;
};

const AREA_LABEL: Record<TargetArea, string> = {
  lower_body: "臀腿与核心",
  upper_push: "上肢推",
  upper_pull: "上肢拉",
  full_body: "全身",
  core: "核心",
  recovery: "恢复放松",
};

function areaLabel(area: TargetArea | null | undefined): string {
  if (!area) return "全身";
  return AREA_LABEL[area] ?? "全身";
}

function reasonLines(cycleStatus: CycleStatus, energyLevel: EnergyLevel): string {
  if (cycleStatus === "period") {
    return "你标记了经期状态。\n今天更适合轻柔、可随时停下的节奏。";
  }
  if (cycleStatus === "uncertain") {
    if (energyLevel === "low") {
      return "经期状态还不确定，精力也偏低。\n我们按「稳一点」来安排。";
    }
    return "经期状态还不确定。\n训练会偏保守，方便你随时调整。";
  }
  if (energyLevel === "high") {
    return "今天精力不错。\n可以在舒服的前提下，稍微多推进一点。";
  }
  if (energyLevel === "low") {
    return "今天有点累。\n强度会压低一些，动作也更简单。";
  }
  return "状态比较平稳。\n按中等节奏练，留一点余量。";
}

function knowledgeLines(
  templateTitle: string,
  templateFocus: string,
  targetArea: TargetArea,
  lastTargetArea: TargetArea | null,
): string {
  const today = areaLabel(targetArea);
  const focus = templateFocus ? `重点：${templateFocus}` : "";

  if (lastTargetArea && lastTargetArea !== targetArea) {
    return `上次练的是${areaLabel(lastTargetArea)}，\n今天换到${today}——「${templateTitle}」。\n${focus}`.trim();
  }
  if (!lastTargetArea) {
    return `为你选了「${templateTitle}」。\n今天从${today}开始，节奏好上手。\n${focus}`.trim();
  }
  return `延续${today}方向：「${templateTitle}」。\n${focus}`.trim();
}

function tipLines(cycleStatus: CycleStatus, energyLevel: EnergyLevel, targetArea: TargetArea): string {
  if (cycleStatus === "period") {
    return "不舒服就停，不必硬撑。\n拉伸和呼吸可以多做一点。";
  }
  if (targetArea === "recovery") {
    return "以活动度为主，别追求泵感。\n有酸胀感就放慢。";
  }
  if (energyLevel === "low") {
    return "组间可以多歇半分钟。\n重量拿不准就选轻一档。";
  }
  if (energyLevel === "high") {
    return "别一口气加满，先找动作感觉。\n最后两组再决定是否加重。";
  }
  return "动作质量优先于次数。\n口渴了记得补水。";
}

export function buildSmartResultCopy(params: SmartResultCopyParams): SmartResultCopy {
  const template = getWorkoutTemplateById(params.matchedTemplateId);
  const { meta } = template;

  return {
    reason: reasonLines(params.cycleStatus, params.energyLevel),
    knowledge: knowledgeLines(
      meta.title,
      meta.focus,
      meta.targetArea,
      params.lastTargetArea,
    ),
    tip: tipLines(params.cycleStatus, params.energyLevel, meta.targetArea),
  };
}
