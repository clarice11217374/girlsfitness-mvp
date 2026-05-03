export type WorkoutPhase = "warmup" | "strength" | "cardio" | "stretch";

export type CycleStatus = "period" | "not_period" | "uncertain";
export type EnergyLevel = "low" | "normal" | "high";
export type TargetArea =
  | "lower_body"
  | "upper_push"
  | "upper_pull"
  | "core"
  | "recovery";

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
  phase: WorkoutPhase;
  sets: number;
  reps: string;
  duration: string;
  equipment: string;
  visualPlaceholder: string;
  equipmentGuide: EquipmentGuide;
  actionGuide: ActionGuide;
  commonMistakes: string[];
  alternative: string;
};

export type WorkoutTemplateMeta = {
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

export type WorkoutByPhase = Record<WorkoutPhase, WorkoutExercise[]>;

export type WorkoutTemplate = {
  meta: WorkoutTemplateMeta;
  workoutByPhase: WorkoutByPhase;
};

const phaseOrder: WorkoutPhase[] = ["warmup", "strength", "cardio", "stretch"];

export const workoutTemplates: WorkoutTemplate[] = [
  {
    meta: {
      id: "upper-push-strength-day",
      title: "上肢推 · 力量日",
      description: "以胸、肩、三头为主的上肢推训练，适合在健身房按流程完成。",
      estimatedMinutes: 45,
      intensity: "中等强度",
      focus: "胸、肩、三头",
      trainingType: "上肢力量",
      equipmentSummary: "器械推胸机、哑铃、绳索机、椭圆机",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "upper_push"
    },
    workoutByPhase: {
      warmup: [
        {
          id: "warmup-shoulder-circles",
          name: "肩部环绕",
          phase: "warmup",
          sets: 1,
          reps: "30秒",
          duration: "30秒",
          equipment: "无需器械",
          visualPlaceholder: "shoulder-circles-placeholder",
          equipmentGuide: {
            machineIntro: "这是徒手热身动作，不需要器械。",
            seatSetup: "无需座椅。",
            postureSetup: "站立或坐姿都可以，保持肩膀放松。",
            gripSetup: "双手自然放在身体两侧。",
            weightTip: "无需负重。"
          },
          actionGuide: {
            step1: "站直或坐直，肩膀自然放松。",
            step2: "双肩缓慢向前画圈，再向后画圈。",
            step3: "保持动作舒适，不要甩动。",
            breathing: "自然呼吸，不要屏气。"
          },
          commonMistakes: ["动作太快", "耸肩", "用力甩动手臂"],
          alternative: "手臂画圈。"
        },
        {
          id: "warmup-scapula-activation",
          name: "肩胛激活",
          phase: "warmup",
          sets: 1,
          reps: "12次",
          duration: "1分钟",
          equipment: "无需器械 / 弹力带可选",
          visualPlaceholder: "scapula-activation-placeholder",
          equipmentGuide: {
            machineIntro: "这是肩背激活动作，可以徒手或使用轻阻力弹力带。",
            seatSetup: "无需座椅。",
            postureSetup: "胸口自然打开，肩膀放松，不要塌腰。",
            gripSetup: "如果用弹力带，双手握住两端，手臂向前伸直。",
            weightTip: "弹力带阻力要轻，能稳定控制即可。"
          },
          actionGuide: {
            step1: "双臂向前伸直，肩膀保持放松。",
            step2: "慢慢把肩胛骨向后收。",
            step3: "控制回到起点，不要让弹力带突然回弹。",
            breathing: "向外拉开时呼气，回到起点时吸气。"
          },
          commonMistakes: ["耸肩", "身体后仰借力", "弹力带回弹太快"],
          alternative: "徒手肩胛后收。"
        }
      ],
      strength: [
        {
          id: "strength-machine-chest-press",
          name: "器械推胸",
          phase: "strength",
          sets: 4,
          reps: "12次",
          duration: "8分钟",
          equipment: "器械推胸机",
          visualPlaceholder: "machine-chest-press-placeholder",
          equipmentGuide: {
            machineIntro: "器械推胸机主要训练胸部，也会用到肩前侧和手臂后侧。",
            seatSetup: "调整座椅高度，让把手大约位于胸口中线附近。",
            postureSetup: "背部贴紧靠垫，肩膀放松下沉，双脚踩稳地面。",
            gripSetup: "双手握住把手，手腕保持中立。",
            weightTip: "选择能完成12次、最后2次稍吃力但动作不变形的重量。"
          },
          actionGuide: {
            step1: "坐稳后，背部贴紧靠垫，双手握住把手。",
            step2: "用胸部发力把把手向前推出，手肘不要完全锁死。",
            step3: "慢慢回收，让把手回到胸口附近。",
            breathing: "推出时呼气，回收时吸气。"
          },
          commonMistakes: ["耸肩", "腰离开靠垫", "手肘完全锁死", "重量过重"],
          alternative: "上斜俯卧撑或哑铃卧推。"
        },
        {
          id: "strength-dumbbell-shoulder-press",
          name: "哑铃肩推",
          phase: "strength",
          sets: 3,
          reps: "10次",
          duration: "7分钟",
          equipment: "哑铃",
          visualPlaceholder: "dumbbell-shoulder-press-placeholder",
          equipmentGuide: {
            machineIntro: "哑铃肩推主要训练肩部。",
            seatSetup: "建议坐在有靠背的训练凳上。",
            postureSetup: "背部贴住靠背，腹部轻轻收紧，双脚踩稳。",
            gripSetup: "双手握住哑铃，起始位置放在肩膀两侧。",
            weightTip: "先用较轻哑铃，保证能稳定推起和慢慢放下。"
          },
          actionGuide: {
            step1: "坐稳后，将哑铃放在肩膀两侧。",
            step2: "向上推起哑铃，直到手臂接近伸直。",
            step3: "慢慢把哑铃放回肩旁。",
            breathing: "推起时呼气，下降时吸气。"
          },
          commonMistakes: ["腰部后仰", "耸肩", "哑铃下降太快", "左右手发力不均"],
          alternative: "矿泉水瓶肩推或器械肩推。"
        },
        {
          id: "strength-cable-triceps-pushdown",
          name: "绳索下压",
          phase: "strength",
          sets: 3,
          reps: "15次",
          duration: "6分钟",
          equipment: "绳索机",
          visualPlaceholder: "cable-triceps-pushdown-placeholder",
          equipmentGuide: {
            machineIntro: "绳索下压主要训练手臂后侧，也就是三头肌。",
            seatSetup: "这是站姿动作，不需要座椅。",
            postureSetup: "站在绳索机前，身体微微前倾，核心稳定。",
            gripSetup: "双手握住绳索或直杆，手肘夹在身体两侧。",
            weightTip: "选择能控制回弹的重量，不要摆动身体。"
          },
          actionGuide: {
            step1: "站稳后，手肘固定在身体两侧。",
            step2: "把绳索向下压到手臂接近伸直。",
            step3: "慢慢回到起点，保持手肘位置尽量不动。",
            breathing: "下压时呼气，回收时吸气。"
          },
          commonMistakes: ["手肘乱晃", "身体摆动借力", "回收太快", "肩膀耸起"],
          alternative: "哑铃臂屈伸。"
        },
        {
          id: "strength-incline-push-up",
          name: "上斜俯卧撑",
          phase: "strength",
          sets: 3,
          reps: "失力为止",
          duration: "6分钟",
          equipment: "卧推凳 / 固定支撑",
          visualPlaceholder: "incline-push-up-placeholder",
          equipmentGuide: {
            machineIntro: "上斜俯卧撑是普通俯卧撑的简化版本。",
            seatSetup: "选择稳定的卧推凳、桌面或固定支撑面。",
            postureSetup: "身体从头到脚保持一条直线，腹部轻轻收紧。",
            gripSetup: "双手撑在支撑面上，略宽于肩。",
            weightTip: "支撑面越高越简单，越低越接近标准俯卧撑。"
          },
          actionGuide: {
            step1: "双手撑在固定支撑面上，身体保持直线。",
            step2: "慢慢弯曲手肘，让胸口靠近支撑面。",
            step3: "用胸部和手臂力量推回起点。",
            breathing: "下降时吸气，推起时呼气。"
          },
          commonMistakes: ["塌腰", "耸肩", "手肘完全向外打开", "动作过快"],
          alternative: "墙面俯卧撑。"
        }
      ],
      cardio: [
        {
          id: "cardio-elliptical-easy",
          name: "椭圆机轻有氧",
          phase: "cardio",
          sets: 1,
          reps: "8分钟匀速",
          duration: "8分钟",
          equipment: "椭圆机",
          visualPlaceholder: "elliptical-easy-placeholder",
          equipmentGuide: {
            machineIntro: "椭圆机用于低冲击有氧，适合力量训练后温和提高心率。",
            seatSetup: "无需座椅，双脚踩稳踏板。",
            postureSetup: "身体保持直立，不要趴在扶手上。",
            gripSetup: "双手轻握扶手，保持自然摆动。",
            weightTip: "选择低到中等阻力，能稳定完成8分钟即可。"
          },
          actionGuide: {
            step1: "双脚踩稳踏板，双手轻握扶手。",
            step2: "保持匀速，不需要冲刺。",
            step3: "让呼吸略微加快，但仍然可以说话。",
            breathing: "保持均匀呼吸。"
          },
          commonMistakes: ["阻力过高", "身体左右晃动", "低头看脚", "速度忽快忽慢"],
          alternative: "跑步机坡度快走。"
        }
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
          visualPlaceholder: "chest-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "这是放松胸部的静态拉伸动作。",
            seatSetup: "无需座椅，站在墙边或门框旁。",
            postureSetup: "身体保持直立，肩膀放松下沉。",
            gripSetup: "一只手扶住墙面或门框。",
            weightTip: "不需要负重，拉伸应温和。"
          },
          actionGuide: {
            step1: "一只手扶住墙面或门框。",
            step2: "身体轻轻向另一侧转开。",
            step3: "停留在胸前有拉伸感的位置。",
            breathing: "保持缓慢呼吸，不要憋气。"
          },
          commonMistakes: ["拉得太猛", "肩膀耸起", "身体扭转过度"],
          alternative: "双手背后交握拉伸。"
        },
        {
          id: "stretch-front-shoulder",
          name: "肩前三角肌拉伸",
          phase: "stretch",
          sets: 1,
          reps: "30秒",
          duration: "30秒",
          equipment: "无需器械",
          visualPlaceholder: "front-shoulder-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "这是肩前侧放松动作，不需要器械。",
            seatSetup: "站姿或坐姿都可以完成。",
            postureSetup: "身体保持直立，胸口自然打开。",
            gripSetup: "双手可以在身后轻轻交握，或单侧手臂向后伸展。",
            weightTip: "无需负重，保持轻柔拉伸即可。"
          },
          actionGuide: {
            step1: "站直或坐直，肩膀放松。",
            step2: "双手在身后轻轻交握，胸口微微打开。",
            step3: "保持舒适拉伸感，不要强行后拉。",
            breathing: "自然呼吸，呼气时放松肩颈。"
          },
          commonMistakes: ["过度挺胸", "耸肩", "手臂向后拉得太猛"],
          alternative: "墙面胸肩拉伸。"
        }
      ]
    }
  }
];

export function getOrderedExercises(templateId = "upper-push-strength-day"): WorkoutExercise[] {
  const template = workoutTemplates.find((item) => item.meta.id === templateId) ?? workoutTemplates[0];

  return phaseOrder.flatMap((phase) => template.workoutByPhase[phase]);
}

export function getPhasePlanForExec(templateId = "upper-push-strength-day") {
  const template = workoutTemplates.find((item) => item.meta.id === templateId) ?? workoutTemplates[0];

  return phaseOrder.map((phase) => {
    const exercises = template.workoutByPhase[phase];

    return {
      phase,
      title:
        phase === "warmup"
          ? "热身"
          : phase === "strength"
            ? "力量"
            : phase === "cardio"
              ? "有氧"
              : "拉伸",
      count: exercises.length,
      exercises
    };
  });
}

export function getWorkoutTemplateById(templateId: string): WorkoutTemplate {
  return workoutTemplates.find((item) => item.meta.id === templateId) ?? workoutTemplates[0];
}