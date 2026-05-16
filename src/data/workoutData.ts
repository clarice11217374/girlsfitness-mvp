export type WorkoutPhase = "warmup" | "strength" | "cardio" | "stretch";

export type EquipmentGuide = {
  machineIntro: string;
  seatSetup: string;
  postureSetup: string;
  gripSetup: string;
  weightTip: string;
};

export type ActionGuide = {
  step1: string;
  step2: string;
  step3: string;
  breathing: string;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  mediaSearchQuery?: string;
  englishName?: string;
  slug?: string;
  phase: WorkoutPhase;
  sets: number;
  reps: string;
  duration: string;
  equipment: string;
  visualPlaceholder: string;
  equipmentGuide: EquipmentGuide;
  actionGuide: ActionGuide;
  commonMistakes: string;
  alternative: string;
};

export type WorkoutTemplateMeta = {
  title: string;
  description: string;
  estimatedMinutes: number;
  intensity: string;
  focus: string;
  trainingType: string;
  equipmentSummary: string;
};

export const workoutTemplateMeta: WorkoutTemplateMeta = {
  title: "上肢推 · 力量日",
  description: "以胸、肩、三头为主的上肢推训练，适合在健身房按流程完成。",
  estimatedMinutes: 45,
  intensity: "中等强度",
  focus: "胸、肩、三头",
  trainingType: "上肢力量",
  equipmentSummary: "器械推胸机、哑铃、绳索机、椭圆机",
};

const PHASE_ORDER: WorkoutPhase[] = ["warmup", "strength", "cardio", "stretch"];

const PHASE_LABEL: Record<WorkoutPhase, string> = {
  warmup: "热身",
  strength: "力量",
  cardio: "有氧",
  stretch: "拉伸",
};

export const workoutByPhase: Record<WorkoutPhase, WorkoutExercise[]> = {
  warmup: [
    {
      id: "warmup-shoulder-circle",
      name: "肩部环绕",
      phase: "warmup",
      sets: 1,
      reps: "30秒",
      duration: "30秒",
      equipment: "无需器械",
      visualPlaceholder: "肩部环绕示意占位",
      equipmentGuide: {
        machineIntro: "无需器械，站姿完成肩关节活动准备。",
        seatSetup: "站在开阔区域，双脚与肩同宽。",
        postureSetup: "核心轻收紧，颈部保持中立。",
        gripSetup: "双手放松，手臂自然外展做环绕。",
        weightTip: "无负重，动作幅度以舒适为准。",
      },
      actionGuide: {
        step1: "双臂抬至肩高，向前小圈环绕 15 秒。",
        step2: "改为向后环绕 15 秒，保持节奏平稳。",
        step3: "肩膀持续下沉，不借力甩臂。",
        breathing: "自然呼吸，保持均匀。",
      },
      commonMistakes: "耸肩、甩臂过猛、颈部代偿。",
      alternative: "弹力带肩关节绕环。",
    },
    {
      id: "warmup-scap-activation",
      name: "肩胛激活",
      phase: "warmup",
      sets: 1,
      reps: "12次",
      duration: "约1分钟",
      equipment: "无需器械 / 弹力带可选",
      visualPlaceholder: "肩胛激活示意占位",
      equipmentGuide: {
        machineIntro: "可徒手完成，弹力带仅用于增加轻阻力。",
        seatSetup: "站姿或靠墙，确保上肢活动空间。",
        postureSetup: "胸骨微抬，肩胛先下沉再后收。",
        gripSetup: "若用弹力带，双手与肩同宽握住。",
        weightTip: "阻力以感知肩胛发力为主，不追求负重。",
      },
      actionGuide: {
        step1: "双手前伸，完成肩胛前引。",
        step2: "再做肩胛回收，停顿 1 秒。",
        step3: "连续完成 12 次，动作小而精准。",
        breathing: "回收呼气，前引吸气。",
      },
      commonMistakes: "手臂代偿过多、动作速度过快。",
      alternative: "靠墙肩胛滑动。",
    },
  ],
  strength: [
    {
      id: "strength-machine-chest-press",
      name: "器械推胸",
      phase: "strength",
      sets: 4,
      reps: "12次",
      duration: "约8分钟",
      equipment: "器械推胸机",
      visualPlaceholder: "器械推胸示意占位",
      equipmentGuide: {
        machineIntro: "坐姿器械推胸，固定轨迹更友好。",
        seatSetup: "调到把手与胸部中下部平齐。",
        postureSetup: "后背与臀部贴靠垫，核心收紧。",
        gripSetup: "全掌握把，手腕保持中立。",
        weightTip: "从能稳定完成 12 次的重量开始。",
      },
      actionGuide: {
        step1: "肩胛轻收后启动推举。",
        step2: "向前推至接近伸直，不锁死肘。",
        step3: "控制回程 2 秒，维持张力。",
        breathing: "推出呼气，回收吸气。",
      },
      commonMistakes: "耸肩、塌腰、回程过快。",
      alternative: "哑铃卧推。",
    },
    {
      id: "strength-dumbbell-shoulder-press",
      name: "哑铃肩推",
      phase: "strength",
      sets: 3,
      reps: "10次",
      duration: "约5分钟",
      equipment: "哑铃",
      visualPlaceholder: "哑铃肩推示意占位",
      equipmentGuide: {
        machineIntro: "哑铃肩推可站姿或坐姿完成。",
        seatSetup: "坐姿时背靠凳背，双脚踩稳地面。",
        postureSetup: "骨盆中立，避免腰椎过伸。",
        gripSetup: "哑铃柄压在掌根，拇指扣紧。",
        weightTip: "选择可标准完成 10 次的重量。",
      },
      actionGuide: {
        step1: "哑铃起始于耳侧，小臂垂直地面。",
        step2: "沿耳侧轨迹上推至接近伸直。",
        step3: "缓慢下放回起始位。",
        breathing: "上推呼气，下放吸气。",
      },
      commonMistakes: "腰椎反弓、借腿发力。",
      alternative: "器械坐姿肩推。",
    },
    {
      id: "strength-cable-pushdown",
      name: "绳索下压",
      phase: "strength",
      sets: 3,
      reps: "15次",
      duration: "约4分钟",
      equipment: "绳索机",
      visualPlaceholder: "绳索下压示意占位",
      equipmentGuide: {
        machineIntro: "高位滑轮配绳索，主练肱三头。",
        seatSetup: "站距与肩同宽，膝微屈稳定。",
        postureSetup: "上臂贴近躯干两侧，肘固定。",
        gripSetup: "中立握绳，手腕不过度屈伸。",
        weightTip: "先轻重量确认肘关节稳定再加重。",
      },
      actionGuide: {
        step1: "小臂约 90 度起始，绳索保持张力。",
        step2: "仅前臂下压至接近伸直。",
        step3: "控制回放，不让重量拉走上臂。",
        breathing: "下压呼气，回放吸气。",
      },
      commonMistakes: "身体摆动、耸肩借力。",
      alternative: "弹力带下压。",
    },
    {
      id: "strength-incline-pushup",
      name: "上斜俯卧撑",
      phase: "strength",
      sets: 3,
      reps: "失力为止",
      duration: "约4分钟",
      equipment: "卧推凳 / 固定支撑",
      visualPlaceholder: "上斜俯卧撑示意占位",
      equipmentGuide: {
        machineIntro: "借助固定支撑降低俯卧撑难度。",
        seatSetup: "双手放于凳边或固定台面，宽于肩。",
        postureSetup: "头-背-髋-脚跟保持一线。",
        gripSetup: "掌根压实支撑面，手腕中立。",
        weightTip: "难度不够可降低支撑高度。",
      },
      actionGuide: {
        step1: "屈肘下降，胸口接近支撑面。",
        step2: "保持肘部约 30-45 度夹角。",
        step3: "发力推起至接近伸直。",
        breathing: "下降吸气，推起呼气。",
      },
      commonMistakes: "塌腰、抬臀、动作半程。",
      alternative: "跪姿俯卧撑。",
    },
  ],
  cardio: [
    {
      id: "cardio-elliptical",
      name: "椭圆机轻有氧",
      phase: "cardio",
      sets: 1,
      reps: "8分钟匀速",
      duration: "8分钟",
      equipment: "椭圆机",
      visualPlaceholder: "椭圆机轻有氧示意占位",
      equipmentGuide: {
        machineIntro: "椭圆机低冲击有氧，适合力量后收尾。",
        seatSetup: "调到舒适阻力，步幅自然。",
        postureSetup: "躯干直立，核心轻收。",
        gripSetup: "双手轻握扶手，肩颈放松。",
        weightTip: "保持可说话的匀速强度。",
      },
      actionGuide: {
        step1: "前 2 分钟轻阻力进入状态。",
        step2: "中段保持稳定步频。",
        step3: "最后 1 分钟逐步降速恢复。",
        breathing: "全程均匀呼吸，不憋气。",
      },
      commonMistakes: "阻力过大导致动作变形。",
      alternative: "跑步机快走。",
    },
  ],
  stretch: [
    {
      id: "stretch-chest",
      name: "胸部拉伸",
      phase: "stretch",
      sets: 1,
      reps: "30秒",
      duration: "30秒",
      equipment: "墙面 / 门框",
      visualPlaceholder: "胸部拉伸示意占位",
      equipmentGuide: {
        machineIntro: "借助墙面或门框进行胸肌静态拉伸。",
        seatSetup: "站在墙边，单臂抬到肩高。",
        postureSetup: "胸口打开，身体缓慢旋转离墙。",
        gripSetup: "手掌或前臂轻贴墙面即可。",
        weightTip: "拉伸到酸紧不疼，避免强拉。",
      },
      actionGuide: {
        step1: "单臂贴墙，身体缓慢转开。",
        step2: "保持胸前侧拉伸 30 秒。",
        step3: "换侧重复。",
        breathing: "慢吸慢呼，保持放松。",
      },
      commonMistakes: "猛拉、耸肩、屏气。",
      alternative: "门框胸肌拉伸。",
    },
    {
      id: "stretch-front-delt",
      name: "肩前三角肌拉伸",
      phase: "stretch",
      sets: 1,
      reps: "30秒",
      duration: "30秒",
      equipment: "无需器械",
      visualPlaceholder: "肩前三角肌拉伸示意占位",
      equipmentGuide: {
        machineIntro: "站姿静态拉伸肩前束。",
        seatSetup: "双脚与肩同宽站稳。",
        postureSetup: "肩胛下沉，胸口保持打开。",
        gripSetup: "双手可在身后交握或借助毛巾。",
        weightTip: "幅度以舒适为主，避免反弹。",
      },
      actionGuide: {
        step1: "双手置于身后，手臂微伸直。",
        step2: "轻抬手臂并保持肩膀下沉。",
        step3: "保持 30 秒后放松。",
        breathing: "均匀呼吸，吐气时放松肩前紧张。",
      },
      commonMistakes: "含胸、耸肩、抖动代偿。",
      alternative: "单臂扶墙肩前束拉伸。",
    },
  ],
};

export function getOrderedExercises(): WorkoutExercise[] {
  return PHASE_ORDER.flatMap((phase) => workoutByPhase[phase]);
}

export function getPhasePlanForExec(): { label: string; exerciseIndexes: number[] }[] {
  let cursor = 0;
  return PHASE_ORDER.map((phase) => {
    const chunk = workoutByPhase[phase];
    const exerciseIndexes = chunk.map((_, idx) => cursor + idx);
    cursor += chunk.length;
    return {
      label: PHASE_LABEL[phase],
      exerciseIndexes,
    };
  });
}
