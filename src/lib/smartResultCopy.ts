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
  fact: string;
};

const LITTLE_FACTS: readonly string[] = [
  "肌肉是在恢复里慢慢适应训练的。\n今天练完，留一点休息，长期反而更稳。",
  "组间休息够不够用，会直接影响下一个动作的质量。\n宁可多歇半分钟，也别赶节奏。",
  "新手阶段，动作稳比重量重要。\n先把路线走顺，再加量会更安心。",
  "状态好可以稍微推进，状态一般就少练一点。\n这样更容易一直练下去。",
  "不需要每次都练到力竭。\n留一点余量，第二天会轻松很多。",
  "训练是在「练」和「恢复」之间来回的。\n今天认真练，明天好好歇，都算数。",
  "同一个动作，慢做比快做更容易找到发力感。\n质量上去了，次数自然跟得上。",
];

function pickLittleFactIndex(params: SmartResultCopyParams): number {
  const seed = [
    params.matchedTemplateId,
    params.cycleStatus,
    params.energyLevel,
    params.lastTargetArea ?? "none",
  ].join("|");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  }
  return Math.abs(hash) % LITTLE_FACTS.length;
}

function littleFactLines(params: SmartResultCopyParams): string {
  if (params.cycleStatus === "period") {
    return "经期训练以舒服为主。\n恢复到位了，身体才会慢慢适应，不必赶进度。";
  }
  if (params.energyLevel === "low") {
    return "今天精力一般，少练一点也没关系。\n坚持比一次练满更重要。";
  }
  return LITTLE_FACTS[pickLittleFactIndex(params)] ?? LITTLE_FACTS[0];
}

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
    fact: littleFactLines(params),
  };
}
