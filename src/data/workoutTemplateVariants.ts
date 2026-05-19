import type {
  CycleStatus,
  EnergyLevel,
  TargetArea,
  WorkoutExercise,
  WorkoutPhase,
  WorkoutTemplate,
} from "@/data/workoutTemplates";

export type ExerciseRef = {
  id: string;
  sets?: number;
  reps?: string;
  duration?: string;
};

export type VariantSpec = {
  meta: {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    intensity: string;
    focus: string;
    trainingType: string;
    equipmentSummary: string;
    cycleStatus: CycleStatus;
    energyLevel: EnergyLevel;
    targetArea: TargetArea;
  };
  warmup: ExerciseRef[];
  strength: ExerciseRef[];
  cardio: ExerciseRef[];
  stretch: ExerciseRef[];
};

function cloneExercise(
  source: WorkoutExercise,
  overrides?: Partial<Pick<WorkoutExercise, "phase" | "sets" | "reps" | "duration">>,
): WorkoutExercise {
  return {
    ...source,
    ...overrides,
  };
}

function resolvePhase(
  refs: ExerciseRef[],
  phase: WorkoutPhase,
  exerciseById: Map<string, WorkoutExercise>,
): WorkoutExercise[] {
  const result: WorkoutExercise[] = [];
  for (const ref of refs) {
    const base = exerciseById.get(ref.id);
    if (!base) continue;
    result.push(
      cloneExercise(base, {
        phase,
        ...(ref.sets !== undefined ? { sets: ref.sets } : {}),
        ...(ref.reps !== undefined ? { reps: ref.reps } : {}),
        ...(ref.duration !== undefined ? { duration: ref.duration } : {}),
      }),
    );
  }
  return result;
}

export function buildWorkoutVariantTemplates(
  exerciseById: Map<string, WorkoutExercise>,
): WorkoutTemplate[] {
  return VARIANT_SPECS.map((spec) => ({
    meta: spec.meta,
    workoutByPhase: {
      warmup: resolvePhase(spec.warmup, "warmup", exerciseById),
      strength: resolvePhase(spec.strength, "strength", exerciseById),
      cardio: resolvePhase(spec.cardio, "cardio", exerciseById),
      stretch: resolvePhase(spec.stretch, "stretch", exerciseById),
    },
  }));
}

export const NEW_WORKOUT_EXERCISES: WorkoutExercise[] = [
  {
    id: "up-push-st-pec-fly",
    name: "蝴蝶机夹胸",
    phase: "strength",
    sets: 3,
    reps: "12次",
    duration: "6分钟",
    equipment: "蝴蝶机",
    visualPlaceholder: "pec-fly-placeholder",
    equipmentGuide: {
      machineIntro: "蝴蝶机夹胸主要训练胸部内侧，适合新手控制轨迹。",
      seatSetup: "调整座椅高度，让把手与胸口同高。",
      postureSetup: "背部贴紧靠垫，肩膀下沉，双脚踩稳。",
      gripSetup: "前臂贴靠护垫，肘部微屈固定。",
      weightTip: "从轻重量开始，感受胸部夹紧而非手臂发力。",
    },
    actionGuide: {
      step1: "坐稳后，双臂打开至有轻微拉伸感。",
      step2: "用胸部发力将护垫向前合拢，顶峰轻停。",
      step3: "缓慢打开回到起始位置，保持控制。",
      breathing: "合拢时呼气，打开时吸气。",
    },
    commonMistakes: ["耸肩", "用手臂猛推", "幅度过大", "重量过重"],
    alternative: "弹力带胸前夹胸或哑铃飞鸟轻重量。",
  },
  {
    id: "up-push-st-lateral-raise",
    name: "哑铃侧平举",
    phase: "strength",
    sets: 3,
    reps: "12次",
    duration: "6分钟",
    equipment: "哑铃",
    visualPlaceholder: "lateral-raise-placeholder",
    equipmentGuide: {
      machineIntro: "侧平举主要训练肩部中束，帮助改善溜肩视觉。",
      seatSetup: "站姿训练，无需座椅。",
      postureSetup: "身体直立，核心轻收，肩膀放松下沉。",
      gripSetup: "双手各握一只轻哑铃，自然垂于身侧。",
      weightTip: "宁轻勿重，保证能平稳抬至肩高附近。",
    },
    actionGuide: {
      step1: "站稳后，手肘微屈，哑铃在身侧。",
      step2: "向两侧抬起至大约肩高，小指略高。",
      step3: "缓慢下放，避免身体晃动借力。",
      breathing: "抬起时呼气，下放时吸气。",
    },
    commonMistakes: ["耸肩", "身体后仰", "抬得过高", "下落太快"],
    alternative: "绳索侧平举或徒手侧平举。",
  },
  {
    id: "up-pull-st-reverse-pec-fly",
    name: "蝴蝶机反向飞鸟",
    phase: "strength",
    sets: 3,
    reps: "12次",
    duration: "6分钟",
    equipment: "蝴蝶机",
    visualPlaceholder: "reverse-pec-fly-placeholder",
    equipmentGuide: {
      machineIntro: "反向飞鸟主要训练后肩与上背外侧，改善圆肩。",
      seatSetup: "面向器械，调整座椅使把手与肩同高。",
      postureSetup: "胸部轻贴靠垫，背部挺直，下巴微收。",
      gripSetup: "双手握住把手，肘部微屈。",
      weightTip: "使用轻重量，感受后肩发力而非脖子用力。",
    },
    actionGuide: {
      step1: "坐稳后，双臂向前伸直握住把手。",
      step2: "向后打开至肩胛骨轻夹紧。",
      step3: "缓慢回到前方，保持肩膀下沉。",
      breathing: "向后打开时呼气，回收时吸气。",
    },
    commonMistakes: ["耸肩", "脖子前伸", "用手臂甩动", "重量过大"],
    alternative: "弹力带面前拉开或面拉退阶。",
  },
  {
    id: "lower-st-hip-adduction",
    name: "坐姿内收",
    phase: "strength",
    sets: 3,
    reps: "15次",
    duration: "6分钟",
    equipment: "坐姿内收机",
    visualPlaceholder: "hip-adduction-placeholder",
    equipmentGuide: {
      machineIntro: "坐姿内收主要训练大腿内侧，适合新手固定轨迹。",
      seatSetup: "调整座椅，膝盖与护垫对齐。",
      postureSetup: "背部贴靠，双手扶稳把手，核心轻收。",
      gripSetup: "双腿内侧贴紧护垫。",
      weightTip: "从轻重量开始，全程控制并拢与打开。",
    },
    actionGuide: {
      step1: "坐稳后，双腿放在护垫内侧。",
      step2: "缓慢并拢双腿，顶峰轻停。",
      step3: "控制回到起始位置，不要弹回。",
      breathing: "并拢时呼气，打开时吸气。",
    },
    commonMistakes: ["身体前倾借力", "幅度过大", "弹振", "憋气"],
    alternative: "侧卧腿内收或弹力带内收。",
  },
  {
    id: "lower-st-glute-bridge",
    name: "臀桥",
    phase: "strength",
    sets: 3,
    reps: "12次",
    duration: "6分钟",
    equipment: "瑜伽垫",
    visualPlaceholder: "glute-bridge-placeholder",
    equipmentGuide: {
      machineIntro: "臀桥主要训练臀部与后侧链，适合新手建立发力感。",
      seatSetup: "仰卧于垫上，无需器械。",
      postureSetup: "屈膝脚踩地，膝盖与髋同宽，肋骨下沉。",
      gripSetup: "双臂放身体两侧，掌心向下。",
      weightTip: "徒手即可，感受臀部发力而非腰部过伸。",
    },
    actionGuide: {
      step1: "仰卧屈膝，收紧腹部。",
      step2: "脚跟发力抬臀至身体呈直线。",
      step3: "顶峰轻停后缓慢下放。",
      breathing: "抬臀时呼气，下放时吸气。",
    },
    commonMistakes: ["腰部过伸", "膝盖内扣", "抬得太高", "落地弹振"],
    alternative: "单腿臀桥退阶或弹力带臀桥。",
  },
  {
    id: "lower-st-plank",
    name: "平板支撑",
    phase: "strength",
    sets: 3,
    reps: "30秒",
    duration: "4分钟",
    equipment: "瑜伽垫",
    visualPlaceholder: "plank-placeholder",
    equipmentGuide: {
      machineIntro: "平板支撑主要训练核心稳定，适合新手控制时长。",
      seatSetup: "俯卧于垫上。",
      postureSetup: "肘在肩下，身体呈一直线，臀部不塌不翘。",
      gripSetup: "前臂撑地，双手可交叠。",
      weightTip: "无需负重，保持呼吸均匀。",
    },
    actionGuide: {
      step1: "前臂撑地，脚尖点地。",
      step2: "收紧腹部与臀部，保持身体一条线。",
      step3: "计时结束缓慢跪姿放松。",
      breathing: "保持自然呼吸，不要憋气。",
    },
    commonMistakes: ["塌腰", "翘臀", "耸肩", "憋气"],
    alternative: "跪姿平板或扶墙平板。",
  },
  {
    id: "lower-st-bird-dog",
    name: "对侧伸展",
    phase: "strength",
    sets: 2,
    reps: "每侧8次",
    duration: "5分钟",
    equipment: "瑜伽垫",
    visualPlaceholder: "bird-dog-placeholder",
    equipmentGuide: {
      machineIntro: "对侧伸展训练核心稳定与臀背协调，幅度小即可。",
      seatSetup: "四足跪姿于垫上。",
      postureSetup: "手腕在肩下，膝盖在髋下，背部平直。",
      gripSetup: "手掌全掌撑地，手指张开。",
      weightTip: "无需负重，优先稳定不晃。",
    },
    actionGuide: {
      step1: "四足跪姿，收紧腹部。",
      step2: "对侧手脚缓慢伸展至与背平行。",
      step3: "控制收回后换边。",
      breathing: "伸展时呼气，收回时吸气。",
    },
    commonMistakes: ["腰部塌陷", "抬腿过高", "身体扭转", "动作过快"],
    alternative: "只抬手或只抬腿退阶。",
  },
];

const VARIANT_SPECS: VariantSpec[] = [
  {
    meta: {
      id: "upper-push-gentle",
      title: "胸肩手臂 · 轻量启动",
      description: "以固定器械与绳索为主的上肢推，组数较少，适合精力一般或回归训练。",
      estimatedMinutes: 35,
      intensity: "轻强度",
      focus: "胸、肩、三头",
      trainingType: "上肢推",
      equipmentSummary: "推胸机、蝴蝶机、绳索机、轻哑铃",
      cycleStatus: "not_period",
      energyLevel: "low",
      targetArea: "upper_push",
    },
    warmup: [
      { id: "up-push-wu-shoulder-circles" },
      { id: "up-push-wu-scapula-activation" },
    ],
    strength: [
      { id: "up-push-st-machine-chest-press", sets: 2, reps: "12次" },
      { id: "up-push-st-pec-fly", sets: 2, reps: "12次" },
      { id: "up-push-st-cable-triceps-pushdown", sets: 2, reps: "12次" },
      { id: "up-push-st-lateral-raise", sets: 2, reps: "12次" },
    ],
    cardio: [{ id: "up-push-ca-elliptical-easy" }],
    stretch: [
      { id: "up-push-st-chest-stretch" },
      { id: "up-push-st-front-shoulder-stretch" },
    ],
  },
  {
    meta: {
      id: "upper-push-standard",
      title: "胸肩手臂 · 标准塑形",
      description: "胸肩三头常规配比，适合大多数训练日的上肢推流程。",
      estimatedMinutes: 45,
      intensity: "中等强度",
      focus: "胸、肩、三头",
      trainingType: "上肢推",
      equipmentSummary: "推胸机、哑铃、绳索机",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "upper_push",
    },
    warmup: [
      { id: "up-push-wu-shoulder-circles" },
      { id: "up-push-wu-scapula-activation" },
    ],
    strength: [
      { id: "up-push-st-machine-chest-press", sets: 4, reps: "12次" },
      { id: "up-push-st-dumbbell-shoulder-press", sets: 3, reps: "10次" },
      { id: "up-push-st-cable-triceps-pushdown", sets: 3, reps: "15次" },
      { id: "up-push-st-incline-push-up", sets: 3, reps: "力竭前停止" },
    ],
    cardio: [{ id: "up-push-ca-elliptical-easy" }],
    stretch: [
      { id: "up-push-st-chest-stretch" },
      { id: "up-push-st-front-shoulder-stretch" },
    ],
  },
  {
    meta: {
      id: "upper-push-plus",
      title: "胸肩手臂 · 高能量日",
      description: "在上肢推标准动作上略增组数与动作数，仍保持新手友好器械，无高风险杠铃动作。",
      estimatedMinutes: 50,
      intensity: "中高强度",
      focus: "胸、肩、三头",
      trainingType: "上肢推",
      equipmentSummary: "推胸机、蝴蝶机、哑铃、绳索机",
      cycleStatus: "not_period",
      energyLevel: "high",
      targetArea: "upper_push",
    },
    warmup: [
      { id: "up-push-wu-shoulder-circles" },
      { id: "up-push-wu-scapula-activation" },
    ],
    strength: [
      { id: "up-push-st-machine-chest-press", sets: 4, reps: "10次" },
      { id: "up-push-st-dumbbell-shoulder-press", sets: 3, reps: "10次" },
      { id: "up-push-st-pec-fly", sets: 3, reps: "12次" },
      { id: "up-push-st-cable-triceps-pushdown", sets: 3, reps: "12次" },
      { id: "up-push-st-lateral-raise", sets: 3, reps: "12次" },
    ],
    cardio: [{ id: "up-push-ca-elliptical-easy", duration: "8分钟" }],
    stretch: [
      { id: "up-push-st-chest-stretch" },
      { id: "up-push-st-front-shoulder-stretch" },
    ],
  },
  {
    meta: {
      id: "upper-pull-gentle",
      title: "背部线条 · 轻量启动",
      description: "背部与后肩轻量激活，组数少、器械稳定，适合新手建立拉力感。",
      estimatedMinutes: 35,
      intensity: "轻强度",
      focus: "背、后肩、肱二头",
      trainingType: "上肢拉",
      equipmentSummary: "弹力带、下拉机、划船机、蝴蝶机",
      cycleStatus: "not_period",
      energyLevel: "low",
      targetArea: "upper_pull",
    },
    warmup: [
      { id: "up-pull-wu-band-pull-apart" },
      { id: "up-pull-wu-dead-hang-light" },
    ],
    strength: [
      { id: "up-pull-st-lat-pulldown", sets: 2, reps: "12次" },
      { id: "up-pull-st-seated-cable-row", sets: 2, reps: "12次" },
      { id: "up-pull-st-face-pull", sets: 2, reps: "15次" },
      { id: "up-pull-st-reverse-pec-fly", sets: 2, reps: "12次" },
    ],
    cardio: [{ id: "up-pull-ca-rower-easy" }],
    stretch: [
      { id: "up-pull-st-lat-stretch" },
      { id: "up-pull-st-biceps-stretch" },
    ],
  },
  {
    meta: {
      id: "upper-pull-standard",
      title: "背部线条 · 标准训练",
      description: "背、后肩与肱二头常规配比，适合日常上肢拉训练日。",
      estimatedMinutes: 45,
      intensity: "中等强度",
      focus: "背、后肩、肱二头",
      trainingType: "上肢拉",
      equipmentSummary: "下拉机、划船机、绳索架、哑铃",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "upper_pull",
    },
    warmup: [
      { id: "up-pull-wu-band-pull-apart" },
      { id: "up-pull-wu-dead-hang-light" },
    ],
    strength: [
      { id: "up-pull-st-lat-pulldown", sets: 3, reps: "10次" },
      { id: "up-pull-st-seated-cable-row", sets: 3, reps: "10次" },
      { id: "up-pull-st-face-pull", sets: 3, reps: "12次" },
      { id: "up-pull-st-dumbbell-curl", sets: 3, reps: "12次" },
    ],
    cardio: [{ id: "up-pull-ca-rower-easy" }],
    stretch: [
      { id: "up-pull-st-lat-stretch" },
      { id: "up-pull-st-biceps-stretch" },
    ],
  },
  {
    meta: {
      id: "upper-pull-plus",
      title: "背部线条 · 高能量日",
      description: "略增组数并加入反向飞鸟，仍避免复杂高风险动作。",
      estimatedMinutes: 50,
      intensity: "中高强度",
      focus: "背、后肩、肱二头",
      trainingType: "上肢拉",
      equipmentSummary: "下拉机、划船机、蝴蝶机、哑铃",
      cycleStatus: "not_period",
      energyLevel: "high",
      targetArea: "upper_pull",
    },
    warmup: [
      { id: "up-pull-wu-band-pull-apart" },
      { id: "up-pull-wu-dead-hang-light" },
    ],
    strength: [
      { id: "up-pull-st-lat-pulldown", sets: 4, reps: "10次" },
      { id: "up-pull-st-seated-cable-row", sets: 3, reps: "10次" },
      { id: "up-pull-st-face-pull", sets: 3, reps: "12次" },
      { id: "up-pull-st-reverse-pec-fly", sets: 3, reps: "12次" },
      { id: "up-pull-st-dumbbell-curl", sets: 3, reps: "12次" },
    ],
    cardio: [{ id: "up-pull-ca-rower-easy", duration: "8分钟" }],
    stretch: [
      { id: "up-pull-st-lat-stretch" },
      { id: "up-pull-st-biceps-stretch" },
    ],
  },
  {
    meta: {
      id: "lower-core-gentle",
      title: "臀腿核心 · 轻量启动",
      description: "臀腿与核心以固定器械和自重为主，组数少，适合恢复或低精力日。",
      estimatedMinutes: 35,
      intensity: "轻强度",
      focus: "臀腿、核心",
      trainingType: "臀腿核心",
      equipmentSummary: "内外展机、瑜伽垫、椭圆机",
      cycleStatus: "not_period",
      energyLevel: "low",
      targetArea: "lower_body",
    },
    warmup: [
      { id: "lower-wu-hip-circle" },
      { id: "lower-wu-bodyweight-squat" },
    ],
    strength: [
      { id: "lower-st-hip-abduction", sets: 2, reps: "15次" },
      { id: "lower-st-hip-adduction", sets: 2, reps: "15次" },
      { id: "lower-st-glute-bridge", sets: 2, reps: "12次" },
      { id: "lower-st-dead-bug", sets: 2, reps: "10次" },
      { id: "lower-st-bird-dog", sets: 2, reps: "每侧8次" },
    ],
    cardio: [{ id: "lower-ca-elliptical-recovery" }],
    stretch: [
      { id: "lower-st-quad-stretch" },
      { id: "lower-st-glute-pigeon-lite" },
    ],
  },
  {
    meta: {
      id: "lower-core-standard",
      title: "臀腿核心 · 日常塑形",
      description: "臀腿力量与核心稳定常规配比，适合大多数训练日。",
      estimatedMinutes: 45,
      intensity: "中等强度",
      focus: "臀腿、核心",
      trainingType: "臀腿核心",
      equipmentSummary: "倒蹬机、内外展机、腿屈伸机",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "lower_body",
    },
    warmup: [
      { id: "lower-wu-hip-circle" },
      { id: "lower-wu-bodyweight-squat" },
    ],
    strength: [
      { id: "lower-st-leg-press", sets: 3, reps: "10次" },
      { id: "lower-st-hip-abduction", sets: 3, reps: "12次" },
      { id: "lower-st-leg-curl", sets: 3, reps: "12次" },
      { id: "lower-st-dead-bug", sets: 3, reps: "10次" },
    ],
    cardio: [{ id: "lower-ca-elliptical-recovery" }],
    stretch: [
      { id: "lower-st-quad-stretch" },
      { id: "lower-st-glute-pigeon-lite" },
    ],
  },
  {
    meta: {
      id: "lower-core-plus",
      title: "臀腿核心 · 高能量日",
      description: "在标准臀腿日上略增动作与组数，仍避免传统杠铃硬拉等高风险动作。",
      estimatedMinutes: 50,
      intensity: "中高强度",
      focus: "臀腿、核心",
      trainingType: "臀腿核心",
      equipmentSummary: "倒蹬机、内外展机、腿屈伸机、瑜伽垫",
      cycleStatus: "not_period",
      energyLevel: "high",
      targetArea: "lower_body",
    },
    warmup: [
      { id: "lower-wu-hip-circle" },
      { id: "lower-wu-bodyweight-squat" },
    ],
    strength: [
      { id: "lower-st-leg-press", sets: 4, reps: "10次" },
      { id: "lower-st-hip-abduction", sets: 3, reps: "12次" },
      { id: "lower-st-leg-curl", sets: 3, reps: "12次" },
      { id: "lower-st-hip-adduction", sets: 3, reps: "12次" },
      { id: "lower-st-glute-bridge", sets: 3, reps: "12次" },
      { id: "lower-st-plank", sets: 3, reps: "30秒" },
    ],
    cardio: [{ id: "lower-ca-elliptical-recovery", duration: "8分钟" }],
    stretch: [
      { id: "lower-st-quad-stretch" },
      { id: "lower-st-glute-pigeon-lite" },
    ],
  },
  {
    meta: {
      id: "period-recovery-gentle",
      title: "舒缓恢复 · 温和活动",
      description: "更短、更轻的经期友好活动，以步行、温和激活与拉伸为主。",
      estimatedMinutes: 25,
      intensity: "低强度",
      focus: "舒缓活动、关节温和活动",
      trainingType: "恢复与经期友好",
      equipmentSummary: "瑜伽垫、室内步行",
      cycleStatus: "period",
      energyLevel: "low",
      targetArea: "recovery",
    },
    warmup: [
      { id: "period-wu-cat-cow" },
      { id: "period-wu-easy-walk", duration: "3分钟" },
    ],
    strength: [
      { id: "period-st-clamshell", sets: 2, reps: "12次" },
      { id: "period-st-pelvic-tilt-supine", sets: 2, reps: "10次" },
    ],
    cardio: [{ id: "period-ca-walk-talk-test", duration: "5分钟" }],
    stretch: [
      { id: "period-st-child-pose" },
      { id: "period-st-supine-spinal-twist" },
    ],
  },
  {
    meta: {
      id: "period-recovery-standard",
      title: "舒缓恢复 · 日常恢复",
      description: "经期低强度恢复流程，含浅角度力量与舒缓有氧，不追求力竭。",
      estimatedMinutes: 30,
      intensity: "低强度",
      focus: "舒缓活动、温和力量",
      trainingType: "恢复与经期友好",
      equipmentSummary: "瑜伽垫、墙面、步行空间",
      cycleStatus: "period",
      energyLevel: "normal",
      targetArea: "recovery",
    },
    warmup: [
      { id: "period-wu-cat-cow" },
      { id: "period-wu-easy-walk" },
    ],
    strength: [
      { id: "period-st-wall-sit-shallow", sets: 2, reps: "30秒" },
      { id: "period-st-clamshell", sets: 3, reps: "12次" },
      { id: "period-st-pelvic-tilt-supine", sets: 2, reps: "10次" },
    ],
    cardio: [{ id: "period-ca-walk-talk-test" }],
    stretch: [
      { id: "period-st-child-pose" },
      { id: "period-st-supine-spinal-twist" },
    ],
  },
];
