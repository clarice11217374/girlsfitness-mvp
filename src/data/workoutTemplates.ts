import { withManifestMedia } from "@/data/exerciseMediaManifest";
import {
  buildWorkoutVariantTemplates,
  NEW_WORKOUT_EXERCISES,
} from "@/data/workoutTemplateVariants";

export type WorkoutPhase = "warmup" | "strength" | "cardio" | "stretch";

export type CycleStatus = "period" | "not_period" | "uncertain";
export type EnergyLevel = "low" | "normal" | "high";
export type TargetArea =
  | "lower_body"
  | "upper_push"
  | "upper_pull"
  | "full_body"
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
  mediaSearchQuery?: string;
  englishName?: string;
  slug?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: "image" | "gif" | "video";
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

const legacyWorkoutTemplates: WorkoutTemplate[] = [
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
      targetArea: "upper_push",
    },
    workoutByPhase: {
      warmup: [
        {
          id: "up-push-wu-shoulder-circles",
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
            weightTip: "无需负重。",
          },
          actionGuide: {
            step1: "站直或坐直，肩膀自然放松。",
            step2: "双肩缓慢向前画圈，再向后画圈。",
            step3: "保持动作舒适，不要甩动。",
            breathing: "自然呼吸，不要屏气。",
          },
          commonMistakes: ["动作太快", "耸肩", "用力甩动手臂"],
          alternative: "手臂画小圈降低幅度。",
        },
        {
          id: "up-push-wu-scapula-activation",
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
            weightTip: "弹力带阻力要轻，能稳定控制即可。",
          },
          actionGuide: {
            step1: "双臂向前伸直，肩膀保持放松。",
            step2: "慢慢把肩胛骨向后收。",
            step3: "控制回到起点，不要让弹力带突然回弹。",
            breathing: "向外拉开时呼气，回到起点时吸气。",
          },
          commonMistakes: ["耸肩", "身体后仰借力", "弹力带回弹太快"],
          alternative: "徒手肩胛后收。",
        },
      ],
      strength: [
        {
          id: "up-push-st-machine-chest-press",
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
            weightTip: "选择能完成12次、最后2次稍吃力但动作不变形的重量。",
          },
          actionGuide: {
            step1: "坐稳后，背部贴紧靠垫，双手握住把手。",
            step2: "用胸部发力把把手向前推出，手肘不要完全锁死。",
            step3: "慢慢回收，让把手回到胸口附近。",
            breathing: "推出时呼气，回收时吸气。",
          },
          commonMistakes: ["耸肩", "腰离开靠垫", "手肘完全锁死", "重量过重"],
          alternative: "上斜俯卧撑或哑铃卧推。",
        },
        {
          id: "up-push-st-dumbbell-shoulder-press",
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
            weightTip: "先用较轻哑铃，保证能稳定推起和慢慢放下。",
          },
          actionGuide: {
            step1: "坐稳后，将哑铃放在肩膀两侧。",
            step2: "向上推起哑铃，直到手臂接近伸直。",
            step3: "慢慢把哑铃放回肩旁。",
            breathing: "推起时呼气，下降时吸气。",
          },
          commonMistakes: ["腰部后仰", "耸肩", "哑铃下降太快", "左右手发力不均"],
          alternative: "器械肩推或矿泉水瓶肩推。",
        },
        {
          id: "up-push-st-cable-triceps-pushdown",
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
            weightTip: "选择能控制回弹的重量，不要摆动身体。",
          },
          actionGuide: {
            step1: "站稳后，手肘固定在身体两侧。",
            step2: "把绳索向下压到手臂接近伸直。",
            step3: "慢慢回到起点，保持手肘位置尽量不动。",
            breathing: "下压时呼气，回收时吸气。",
          },
          commonMistakes: ["手肘乱晃", "身体摆动借力", "回收太快", "肩膀耸起"],
          alternative: "哑铃过头臂屈伸。",
        },
        {
          id: "up-push-st-incline-push-up",
          name: "上斜俯卧撑",
          phase: "strength",
          sets: 3,
          reps: "力竭前停止",
          duration: "6分钟",
          equipment: "卧推凳 / 固定支撑",
          visualPlaceholder: "incline-push-up-placeholder",
          equipmentGuide: {
            machineIntro: "上斜俯卧撑是普通俯卧撑的简化版本，负重更小。",
            seatSetup: "选择稳定的卧推凳、桌面或固定支撑面。",
            postureSetup: "身体从头到脚保持一条直线，腹部轻轻收紧。",
            gripSetup: "双手撑在支撑面上，略宽于肩。",
            weightTip: "支撑面越高越简单，越低越接近标准俯卧撑。",
          },
          actionGuide: {
            step1: "双手撑在固定支撑面上，身体保持直线。",
            step2: "慢慢弯曲手肘，让胸口靠近支撑面。",
            step3: "用胸部和手臂力量推回起点。",
            breathing: "下降时吸气，推起时呼气。",
          },
          commonMistakes: ["塌腰", "耸肩", "手肘完全向外打开", "动作过快"],
          alternative: "墙面俯卧撑。",
        },
      ],
      cardio: [
        {
          id: "up-push-ca-elliptical-easy",
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
            weightTip: "选择低到中等阻力，能稳定完成8分钟即可。",
          },
          actionGuide: {
            step1: "双脚踩稳踏板，双手轻握扶手。",
            step2: "保持匀速，不需要冲刺。",
            step3: "让呼吸略微加快，但仍然可以说话。",
            breathing: "保持均匀呼吸。",
          },
          commonMistakes: ["阻力过高", "身体左右晃动", "低头看脚", "速度忽快忽慢"],
          alternative: "跑步机坡度快走。",
        },
      ],
      stretch: [
        {
          id: "up-push-st-chest-stretch",
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
            weightTip: "不需要负重，拉伸应温和。",
          },
          actionGuide: {
            step1: "一只手扶住墙面或门框。",
            step2: "身体轻轻向另一侧转开。",
            step3: "停留在胸前有拉伸感的位置。",
            breathing: "保持缓慢呼吸，不要憋气。",
          },
          commonMistakes: ["拉得太猛", "肩膀耸起", "身体扭转过度"],
          alternative: "双手背后交握拉伸。",
        },
        {
          id: "up-push-st-front-shoulder-stretch",
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
            weightTip: "无需负重，保持轻柔拉伸即可。",
          },
          actionGuide: {
            step1: "站直或坐直，肩膀放松。",
            step2: "双手在身后轻轻交握，胸口微微打开。",
            step3: "保持舒适拉伸感，不要强行后拉。",
            breathing: "自然呼吸，呼气时放松肩颈。",
          },
          commonMistakes: ["过度挺胸", "耸肩", "手臂向后拉得太猛"],
          alternative: "墙面胸肩拉伸。",
        },
      ],
    },
  },
  {
    meta: {
      id: "upper-pull-strength-day",
      title: "上肢拉 · 力量日",
      description:
        "以背部、后肩与手臂前侧弯举为主，帮助改善圆肩久坐感；器械重量从轻开始更稳。",
      estimatedMinutes: 45,
      intensity: "中等强度",
      focus: "背、后肩、肱二头",
      trainingType: "上肢拉",
      equipmentSummary: "高位下拉机、坐姿划船机、绳索架、哑铃、有氧设备",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "upper_pull",
    },
    workoutByPhase: {
      warmup: [
        {
          id: "up-pull-wu-band-pull-apart",
          name: "弹力带胸前拉开",
          phase: "warmup",
          sets: 1,
          reps: "15次",
          duration: "1分钟",
          equipment: "长弹力带",
          visualPlaceholder: "band-pull-apart-placeholder",
          equipmentGuide: {
            machineIntro: "弹力带用于轻阻力，激活上背部与后肩，不是比力气。",
            seatSetup: "站姿即可，双脚与肩同宽踩稳。",
            postureSetup: "肋骨不要外翻，下巴微收，眼睛平视。",
            gripSetup: "双手握住弹力带，手臂向前伸直与肩同高。",
            weightTip: "选最轻或中等弹力，能拉开到胸口两侧即可。",
          },
          actionGuide: {
            step1: "双臂前伸与肩同高，肩胛先微微下沉。",
            step2: "呼气，将弹力带向两侧拉开，像打开一扇门。",
            step3: "吸气缓慢回到起点，不要让弹力带弹回撞胸。",
            breathing: "拉开呼气，还原吸气。",
          },
          commonMistakes: ["耸肩", "用手臂猛甩", "身体后仰借力"],
          alternative: "徒手肩胛后收夹背。",
        },
        {
          id: "up-pull-wu-dead-hang-light",
          name: "悬垂肩袖激活（轻悬吊）",
          phase: "warmup",
          sets: 1,
          reps: "20～30秒",
          duration: "30秒",
          equipment: "引体向上架 / 史密斯杠低位",
          visualPlaceholder: "dead-hang-activation-placeholder",
          equipmentGuide: {
            machineIntro: "在单杠或固定横杆上轻悬吊，让肩关节在自重下温和活动。",
            seatSetup: "若够不到杠，脚下可垫稳踏板或跳箱。",
            postureSetup: "双手握杠，身体垂直，核心轻收，不要完全松垮。",
            gripSetup: "正握略宽于肩，手腕保持中立。",
            weightTip: "脚尖可轻点地分担部分体重，以无痛为原则。",
          },
          actionGuide: {
            step1: "握稳横杆，双脚可轻点地减轻负重。",
            step2: "轻轻下沉肩胛再轻微上提，像小幅度「耸肩—沉肩」。",
            step3: "全程肩部无刺痛即停止，不要硬撑时间。",
            breathing: "自然呼吸，不要憋气。",
          },
          commonMistakes: ["完全吊死肩关节", "握距过宽导致不适", "肩部已有疼痛仍坚持"],
          alternative: "站姿绳索直臂下压极小重量热身。",
        },
      ],
      strength: [
        {
          id: "up-pull-st-lat-pulldown",
          name: "高位下拉",
          phase: "strength",
          sets: 4,
          reps: "10～12次",
          duration: "8分钟",
          equipment: "高位下拉机",
          visualPlaceholder: "lat-pulldown-placeholder",
          equipmentGuide: {
            machineIntro: "高位下拉主要练背阔肌，是新手建立「背发力感」的常用器械。",
            seatSetup: "坐稳后大腿上方压住固定垫，脚平踩地。",
            postureSetup: "胸口微挺、肋骨不外翻，脊柱中立。",
            gripSetup: "宽握或略宽于正肩，全握横杆，拇指绕杠。",
            weightTip: "先选能标准完成12次的重量，最后2次略吃力即可。",
          },
          actionGuide: {
            step1: "坐稳握杠，先沉肩再开始下拉。",
            step2: "把横杆拉向胸口上方，肘朝身体两侧斜后方走。",
            step3: "控制还原到手臂接近伸直，不要猛弹回去。",
            breathing: "下拉呼气，还原吸气。",
          },
          commonMistakes: ["用腰后仰猛拉", "耸肩", "下拉幅度过小", "还原过快"],
          alternative: "弹力带高位下拉或辅助引体。",
        },
        {
          id: "up-pull-st-seated-cable-row",
          name: "坐姿划船",
          phase: "strength",
          sets: 3,
          reps: "12次",
          duration: "7分钟",
          equipment: "坐姿划船机 / 低位拉力器",
          visualPlaceholder: "seated-row-placeholder",
          equipmentGuide: {
            machineIntro: "坐姿划船练中背部与肩胛稳定，适合久坐人群。",
            seatSetup: "胸贴靠垫或坐稳后脚蹬踏板，膝微屈。",
            postureSetup: "脊柱中立，不要圆背也不要过度反弓。",
            gripSetup: "窄握或中握把手，手腕中立。",
            weightTip: "以能「先收肩胛再拉手」为准，不要靠腰甩。",
          },
          actionGuide: {
            step1: "手臂伸直时先沉肩，想象腋下夹纸。",
            step2: "把手拉向腹部或下胸位置，肘贴近身体。",
            step3: "停顿1秒再缓慢伸直手臂，感受背部拉长。",
            breathing: "拉手呼气，还原吸气。",
          },
          commonMistakes: ["圆背猛拉", "身体前后晃动", "耸肩", "手肘飞得太开"],
          alternative: "单臂哑铃划船（扶凳）。",
        },
        {
          id: "up-pull-st-face-pull",
          name: "绳索面拉",
          phase: "strength",
          sets: 3,
          reps: "15次",
          duration: "6分钟",
          equipment: "绳索架（高位滑轮）",
          visualPlaceholder: "face-pull-placeholder",
          equipmentGuide: {
            machineIntro: "面拉主要练后肩与上背部，帮助平衡「推」类训练。",
            seatSetup: "通常站姿完成，可半蹲微屈膝更稳。",
            postureSetup: "身体略后倾，核心收紧，头颈中立。",
            gripSetup: "绳索端分两头，大拇指可朝向自己或绳索末端。",
            weightTip: "重量宜轻，重点是控制和外旋感，不是拉得飞快。",
          },
          actionGuide: {
            step1: "绳索拉向面部高度，手肘高于肩或与肩平。",
            step2: "拉到末端时想象「展示二头肌」，肩外旋打开。",
            step3: "缓慢还原，感受后肩持续张力。",
            breathing: "拉向面部呼气，还原吸气。",
          },
          commonMistakes: ["身体大幅后仰借力", "肘垂得太低", "用脖子前伸"],
          alternative: "俯身弹力带面拉。",
        },
        {
          id: "up-pull-st-dumbbell-curl",
          name: "哑铃弯举",
          phase: "strength",
          sets: 3,
          reps: "12次",
          duration: "6分钟",
          equipment: "哑铃",
          visualPlaceholder: "dumbbell-curl-placeholder",
          equipmentGuide: {
            machineIntro: "哑铃弯举练手臂前侧肱二头肌，动作简单但要控制晃动。",
            seatSetup: "可站姿或坐姿，坐姿更不易借腰。",
            postureSetup: "大臂贴身体两侧或微前夹，肋骨不外翻。",
            gripSetup: "对握或旋后握均可，手腕保持中立不塌。",
            weightTip: "选择全程不甩腰、不耸肩的重量。",
          },
          actionGuide: {
            step1: "双臂自然下垂握住哑铃。",
            step2: "屈肘将哑铃抬向肩前，小臂垂直地面附近即可。",
            step3: "用3秒缓慢放下，不要自由落体。",
            breathing: "弯举呼气，下放吸气。",
          },
          commonMistakes: ["身体前后晃", "肘往前飞", "手腕过度反弓", "借力甩起"],
          alternative: "绳索弯举或锤式弯举。",
        },
      ],
      cardio: [
        {
          id: "up-pull-ca-rower-easy",
          name: "划船机轻松划行",
          phase: "cardio",
          sets: 1,
          reps: "6分钟低桨频",
          duration: "6分钟",
          equipment: "划船机",
          visualPlaceholder: "rower-easy-placeholder",
          equipmentGuide: {
            machineIntro: "划船机可温和调动全身，对拉类训练日也有「收尾」感。",
            seatSetup: "坐稳滑座，脚带系紧，脚跟可微抬。",
            postureSetup: "腰背保持中立，不要圆背塌腰。",
            gripSetup: "双手握把，肩放松下沉。",
            weightTip: "阻力或桨频选低到中，能边划边说话为宜。",
          },
          actionGuide: {
            step1: "先推腿再倾躯干再拉手，顺序像「腿—髋—手」。",
            step2: "还原时先伸臂再回髋再屈膝，动作连贯不猛冲。",
            step3: "保持每分钟桨频在舒适区间，不追求冲刺。",
            breathing: "拉手呼气，还原吸气。",
          },
          commonMistakes: ["圆背猛拉", "只用胳膊不用腿", "桨频过快气喘"],
          alternative: "坐姿固定自行车轻松骑行。",
        },
      ],
      stretch: [
        {
          id: "up-pull-st-lat-stretch",
          name: "背阔肌侧屈拉伸",
          phase: "stretch",
          sets: 1,
          reps: "每侧30秒",
          duration: "1分钟",
          equipment: "固定立柱 / 龙门架立柱",
          visualPlaceholder: "lat-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "扶固定物做侧向身体拉长，放松背阔肌与体侧。",
            seatSetup: "站姿完成即可。",
            postureSetup: "双脚站稳，骨盆保持中正不前移。",
            gripSetup: "一手握柱或扶高位置，另一手自然下垂。",
            weightTip: "无需负重，以轻微牵拉感为度。",
          },
          actionGuide: {
            step1: "握柱的手伸直，身体向对侧缓慢侧移。",
            step2: "感受腋下到腰侧有拉伸即可，不要追求疼痛。",
            step3: "换另一侧重复。",
            breathing: "缓慢深呼吸，呼气时略加深牵拉。",
          },
          commonMistakes: ["扭转身体成旋转", "憋气", "脚离地失衡"],
          alternative: "坐姿举手过头向对侧轻屈。",
        },
        {
          id: "up-pull-st-biceps-stretch",
          name: "肱二头肌扶墙拉伸",
          phase: "stretch",
          sets: 1,
          reps: "每侧25秒",
          duration: "50秒",
          equipment: "墙面",
          visualPlaceholder: "biceps-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "通过手臂后伸扶墙，温和拉长手臂前侧肌肉。",
            seatSetup: "站姿侧向墙面。",
            postureSetup: "身体面向正前，不要扭腰。",
            gripSetup: "手掌贴墙，手指朝下或朝后，高度约肩高。",
            weightTip: "无痛牵拉，有刺痛即降低幅度或停止。",
          },
          actionGuide: {
            step1: "手臂伸直贴墙，身体缓慢反向离开墙面。",
            step2: "直到前臂前侧有牵拉感即停住。",
            step3: "换另一侧。",
            breathing: "自然呼吸，不要憋气。",
          },
          commonMistakes: ["手腕角度过大不适", "强行转身", "耸肩"],
          alternative: "背后交扣手指抬手拉伸。",
        },
      ],
    },
  },
  {
    meta: {
      id: "lower-core-strength-day",
      title: "臀腿核心 · 稳定训练",
      description:
        "腿举、髋外展与腿弯举建立下肢基础，再配合死虫式强化核心稳定，适合想「站得稳、蹲得好」的新手。",
      estimatedMinutes: 50,
      intensity: "中等强度",
      focus: "臀腿、腘绳肌、核心抗伸展",
      trainingType: "下肢与核心",
      equipmentSummary: "腿举机、髋外展机、腿弯举机、瑜伽垫、椭圆机",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "lower_body",
    },
    workoutByPhase: {
      warmup: [
        {
          id: "lower-wu-hip-circle",
          name: "扶墙髋部绕环",
          phase: "warmup",
          sets: 1,
          reps: "每侧8次",
          duration: "1分钟",
          equipment: "墙面",
          visualPlaceholder: "hip-circle-warmup-placeholder",
          equipmentGuide: {
            machineIntro: "徒手髋关节活动，帮助深蹲与腿举前关节润滑。",
            seatSetup: "无需座椅，单手扶墙保持平衡。",
            postureSetup: "躯干直立，支撑腿微屈膝站稳。",
            gripSetup: "扶墙手轻扶即可，不要全身重量压手上。",
            weightTip: "无负重，幅度以舒适为准。",
          },
          actionGuide: {
            step1: "一侧腿微抬离地面，用髋画小圈。",
            step2: "顺时针与逆时针各数圈后换腿。",
            step3: "保持骨盆尽量不大幅摇晃。",
            breathing: "自然呼吸。",
          },
          commonMistakes: ["为了画大圈而扭腰", "支撑腿锁死打直", "扶墙手过度用力"],
          alternative: "原地高抬膝踏步代替绕环。",
        },
        {
          id: "lower-wu-bodyweight-squat",
          name: "徒手深蹲热身",
          phase: "warmup",
          sets: 1,
          reps: "10次",
          duration: "1分钟",
          equipment: "无需器械",
          visualPlaceholder: "bodyweight-squat-warmup-placeholder",
          equipmentGuide: {
            machineIntro: "用自重熟悉蹲起轨迹，为腿举热身。",
            seatSetup: "无需座椅。",
            postureSetup: "双脚与肩同宽或略宽，脚尖与膝方向一致。",
            gripSetup: "双手可抱胸或前平举保持平衡。",
            weightTip: "下蹲深度以无痛为准，不必强求平行。",
          },
          actionGuide: {
            step1: "吸气下蹲，膝盖朝脚尖方向打开。",
            step2: "蹲到大腿前侧有张力即可站起。",
            step3: "节奏放慢，感受脚跟踩实。",
            breathing: "下蹲吸气，站起呼气。",
          },
          commonMistakes: ["膝盖内扣", "脚跟离地", "弓背低头"],
          alternative: "扶椅背半蹲。",
        },
      ],
      strength: [
        {
          id: "lower-st-leg-press",
          name: "腿举机",
          phase: "strength",
          sets: 4,
          reps: "12次",
          duration: "9分钟",
          equipment: "倒蹬/腿举机",
          visualPlaceholder: "leg-press-placeholder",
          equipmentGuide: {
            machineIntro: "腿举用腿部大肌群发力，轨迹固定相对安全，适合新手找「腿发力」感觉。",
            seatSetup: "背部贴紧靠垫，调整座椅使脚在踏板中上部常见位置（以器械说明为准）。",
            postureSetup: "腰贴垫，下放时腰不要拱离靠垫。",
            gripSetup: "双手扶两侧把手，稳定躯干。",
            weightTip: "从空杆或最轻档开始，全程可控再加重。",
          },
          actionGuide: {
            step1: "双脚与肩同宽踩稳踏板，解锁安全栓。",
            step2: "屈髋屈膝有控制地下放，膝盖与脚尖同向。",
            step3: "蹬起到膝微屈即可，不要完全锁死膝关节。",
            breathing: "蹬起呼气，下放吸气。",
          },
          commonMistakes: ["腰离垫", "膝盖内扣", "底部弹振", "重量过大幅度变浅"],
          alternative: "史密斯深蹲或高脚杯哑铃深蹲。",
        },
        {
          id: "lower-st-hip-abduction",
          name: "坐姿髋外展",
          phase: "strength",
          sets: 3,
          reps: "15次",
          duration: "6分钟",
          equipment: "坐姿髋外展机",
          visualPlaceholder: "hip-abduction-placeholder",
          equipmentGuide: {
            machineIntro: "训练臀中肌等髋外展肌群，帮助膝盖稳定。",
            seatSetup: "坐稳，背部靠垫，调整腿挡板在膝盖外侧附近。",
            postureSetup: "骨盆坐正，不要严重前倾或后仰。",
            gripSetup: "扶前方把手，轻扶即可。",
            weightTip: "以能慢速完成、臀部外侧有酸胀感为准。",
          },
          actionGuide: {
            step1: "双腿并拢为起始。",
            step2: "呼气向外打开到舒适幅度，感受臀外侧。",
            step3: "吸气缓慢合拢，不要撞击发出巨响。",
            breathing: "外展呼气，合拢吸气。",
          },
          commonMistakes: ["身体前后晃", "用脚尖发力扭脚", "速度过快"],
          alternative: "侧卧弹力带蚌式。",
        },
        {
          id: "lower-st-leg-curl",
          name: "腿弯举机",
          phase: "strength",
          sets: 3,
          reps: "12次",
          duration: "6分钟",
          equipment: "俯卧或坐姿腿弯举机",
          visualPlaceholder: "leg-curl-placeholder",
          equipmentGuide: {
            machineIntro: "主要练大腿后侧腘绳肌，平衡腿前侧力量。",
            seatSetup: "按器械类型俯卧或坐姿，滚轴压在脚踝上方附近。",
            postureSetup: "髋部压稳垫板，骨盆不要抬起。",
            gripSetup: "扶好把手，颈部保持中立。",
            weightTip: "避免用臀部猛顶借力，重量宁轻勿甩。",
          },
          actionGuide: {
            step1: "起始腿伸直，脚踝贴住滚轴。",
            step2: "屈膝把滚轴向臀部方向卷起。",
            step3: "顶端停1秒再缓慢放下。",
            breathing: "弯举呼气，放下吸气。",
          },
          commonMistakes: ["骨盆抬起", "动作幅度过小", "下放失控"],
          alternative: "瑞士球臀桥弯腿。",
        },
        {
          id: "lower-st-dead-bug",
          name: "死虫式",
          phase: "strength",
          sets: 3,
          reps: "每侧10次",
          duration: "6分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "dead-bug-placeholder",
          equipmentGuide: {
            machineIntro: "仰卧交替伸腿伸臂，训练核心抗伸展与骨盆稳定，对新手很友好。",
            seatSetup: "仰卧在垫上，腰椎轻贴地面。",
            postureSetup: "肋骨下沉，腰与垫之间留很小自然隙或贴紧二选一以无痛为准。",
            gripSetup: "双臂垂直指向天花板，大腿屈膝90度抬起。",
            weightTip: "徒手即可，熟练后可手持小哑铃增加难度。",
          },
          actionGuide: {
            step1: "对侧手脚缓慢向地面方向伸出，不触地或轻触。",
            step2: "保持腰部尽量不拱起离开垫面。",
            step3: "回到起始换对侧。",
            breathing: "伸出呼气，收回吸气。",
          },
          commonMistakes: ["腰拱起", "伸腿太低", "憋气", "速度过快"],
          alternative: "只伸腿不伸手臂，或脚踩墙滑踵。",
        },
      ],
      cardio: [
        {
          id: "lower-ca-elliptical-recovery",
          name: "椭圆机匀速放松有氧",
          phase: "cardio",
          sets: 1,
          reps: "8分钟",
          duration: "8分钟",
          equipment: "椭圆机",
          visualPlaceholder: "elliptical-lower-placeholder",
          equipmentGuide: {
            machineIntro: "低冲击有氧，帮助下肢训练后温和循环与放松心率。",
            seatSetup: "双脚踩稳踏板。",
            postureSetup: "身体直立，目视前方。",
            gripSetup: "轻扶活动扶手或固定扶手。",
            weightTip: "阻力中低，保持匀速。",
          },
          actionGuide: {
            step1: "从慢速开始逐渐到稳定节奏。",
            step2: "全程可对话强度，不冲刺。",
            step3: "结束前1分钟略微降速。",
            breathing: "均匀鼻吸口呼。",
          },
          commonMistakes: ["阻力过大腿酸影响次日训练", "趴扶手上", "踮脚"],
          alternative: "固定自行车坐姿轻松骑行。",
        },
      ],
      stretch: [
        {
          id: "lower-st-quad-stretch",
          name: "站姿股四头肌拉伸",
          phase: "stretch",
          sets: 1,
          reps: "每侧30秒",
          duration: "1分钟",
          equipment: "墙面可扶",
          visualPlaceholder: "quad-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "牵拉大腿前侧，腿举日后常用。",
            seatSetup: "单腿站立可扶墙。",
            postureSetup: "骨盆微前顶，身体直立。",
            gripSetup: "同侧手握脚踝拉向臀部，膝并拢。",
            weightTip: "无痛牵拉，站不稳一定要扶墙。",
          },
          actionGuide: {
            step1: "扶墙站稳，屈膝手拉脚踝。",
            step2: "膝盖指向地面不要外开。",
            step3: "停留舒适牵拉感。",
            breathing: "缓慢呼吸，勿憋气。",
          },
          commonMistakes: ["身体过度前倾", "膝盖外展", "站不稳硬拉"],
          alternative: "侧卧拉脚拉伸股四头。",
        },
        {
          id: "lower-st-glute-pigeon-lite",
          name: "坐姿臀部拉伸（简易版）",
          phase: "stretch",
          sets: 1,
          reps: "每侧30秒",
          duration: "1分钟",
          equipment: "瑜伽垫或椅子",
          visualPlaceholder: "glute-stretch-chair-placeholder",
          equipmentGuide: {
            machineIntro: "坐姿跷二郎腿身体前倾，温和拉伸臀肌与髋外侧。",
            seatSetup: "坐稳椅子边缘，双脚能踩实地面。",
            postureSetup: "背部尽量直，从髋关节前倾。",
            gripSetup: "双手扶膝或小腿防止失衡。",
            weightTip: "无需负重，前倾角度小也有效果。",
          },
          actionGuide: {
            step1: "一脚踝放对侧大腿近膝盖上方。",
            step2: "身体从髋部缓慢前倾。",
            step3: "臀部有牵拉感即停，换边。",
            breathing: "前倾呼气，微还原吸气。",
          },
          commonMistakes: ["弯腰驼背用头去够", "上面腿压迫膝盖不适", "强迫疼痛角度"],
          alternative: "仰卧抱膝拉向胸口。",
        },
      ],
    },
  },
  {
    meta: {
      id: "full-body-cardio-day",
      title: "全身燃脂 · 标准塑形",
      description:
        "先用复合力量动作唤醒全身，再用椭圆机匀速收尾；登山者采用「慢速、小幅度」版本，降低膝盖压力，适合新手理解节奏。",
      estimatedMinutes: 40,
      intensity: "中高强度",
      focus: "全身协调、心肺、基础力量",
      trainingType: "全身代谢",
      equipmentSummary: "哑铃或壶铃、瑜伽垫、椭圆机",
      cycleStatus: "not_period",
      energyLevel: "normal",
      targetArea: "full_body",
    },
    workoutByPhase: {
      warmup: [
        {
          id: "full-wu-arm-leg-swing",
          name: "手臂绕环与摆腿",
          phase: "warmup",
          sets: 1,
          reps: "各30秒",
          duration: "1分钟",
          equipment: "无需器械",
          visualPlaceholder: "arm-leg-swing-warmup-placeholder",
          equipmentGuide: {
            machineIntro: "徒手全身温和活动，提升肩与髋灵活性。",
            seatSetup: "站姿，周围无障碍。",
            postureSetup: "核心轻收，扶墙可选。",
            gripSetup: "手臂自然摆动与绕环。",
            weightTip: "无负重。",
          },
          actionGuide: {
            step1: "肩环绕前后各数圈。",
            step2: "扶墙做前后摆腿，幅度由小到大。",
            step3: "换腿重复，全程无痛。",
            breathing: "自然呼吸。",
          },
          commonMistakes: ["摆腿用力踢高失去控制", "身体大幅后仰"],
          alternative: "原地踏步配合摆臂。",
        },
        {
          id: "full-wu-goblet-hold-squat",
          name: "徒手深蹲节奏热身",
          phase: "warmup",
          sets: 1,
          reps: "8次慢速",
          duration: "1分钟",
          equipment: "无需器械",
          visualPlaceholder: "tempo-squat-warmup-placeholder",
          equipmentGuide: {
            machineIntro: "用慢速深蹲让髋膝踝进入工作状态，为负重动作做准备。",
            seatSetup: "无需座椅。",
            postureSetup: "双脚与肩同宽，脚尖略外八可接受。",
            gripSetup: "双手前平举或抱胸。",
            weightTip: "徒手即可，下蹲3秒站起1～2秒。",
          },
          actionGuide: {
            step1: "吸气下蹲3秒，膝盖顺脚尖。",
            step2: "底部不停顿过久，无疼痛即可。",
            step3: "呼气站起，脚跟踩实。",
            breathing: "下蹲吸气，站起呼气。",
          },
          commonMistakes: ["速度仍过快", "膝盖内扣", "弓背"],
          alternative: "扶桌边半蹲。",
        },
      ],
      strength: [
        {
          id: "full-st-db-rdl",
          name: "哑铃罗马尼亚硬拉",
          phase: "strength",
          sets: 3,
          reps: "10次",
          duration: "7分钟",
          equipment: "哑铃一对",
          visualPlaceholder: "db-rdl-placeholder",
          equipmentGuide: {
            machineIntro: "髋关节主导的后链动作，练臀与大腿后侧，比传统硬拉更易学。",
            seatSetup: "无需座椅，双脚与髋同宽站立。",
            postureSetup: "脊柱中立，肩胛微后收，膝微屈固定角度为主动屈髋。",
            gripSetup: "对握哑铃垂于腿前，靠近身体。",
            weightTip: "先用轻哑铃找「臀部向后推」的感觉，再加重。",
          },
          actionGuide: {
            step1: "吸气屈髋，哑铃沿腿前侧下滑至小腿中上部附近（以柔韧为准）。",
            step2: "感受大腿后侧与臀部牵拉，背部不圆成「驼背」。",
            step3: "呼气伸髋站直，夹臀但不过度顶腰。",
            breathing: "下放吸气，站起呼气。",
          },
          commonMistakes: ["做成深蹲", "圆背", "哑铃离身体太远", "伸膝锁死同时弯腰"],
          alternative: "壶铃硬拉或绳索髋铰链。",
        },
        {
          id: "full-st-db-squat-to-press",
          name: "哑铃深蹲推举",
          phase: "strength",
          sets: 3,
          reps: "8次",
          duration: "7分钟",
          equipment: "哑铃一对",
          visualPlaceholder: "db-squat-press-placeholder",
          equipmentGuide: {
            machineIntro: "下肢蹲起加上肢推举，全身协调的经典组合，哑铃可用小重量起步。",
            seatSetup: "站姿完成。",
            postureSetup: "全程肋骨不外翻，目光平视。",
            gripSetup: "哑铃举在肩侧，掌心相对或略朝前。",
            weightTip: "能标准蹲到底再推举的重量才合适，不要半蹲猛推。",
          },
          actionGuide: {
            step1: "吸气下蹲至大腿至少接近平行（以无痛为准）。",
            step2: "站起同时呼气将哑铃直线推过头顶，手臂不完全锁死。",
            step3: "吸气有控制地下放哑铃回肩侧。",
            breathing: "站起推起呼气，下蹲下放吸气。",
          },
          commonMistakes: ["膝盖内扣", "推起时挺腰", "用腿蹬地惯性弹哑铃"],
          alternative: "分腿站姿降低难度，或拆成「深蹲」与「肩推」分开做。",
        },
        {
          id: "full-st-mountain-climber-slow",
          name: "登山者（慢速低幅度）",
          phase: "strength",
          sets: 3,
          reps: "每侧20次",
          duration: "6分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "mountain-climber-slow-placeholder",
          equipmentGuide: {
            machineIntro: "在平板姿势下交替提膝，慢速小幅度更偏核心与心肺入门，非冲刺跑。",
            seatSetup: "地面垫子上完成。",
            postureSetup: "手在肩下方，身体成一直线，臀部不翘高。",
            gripSetup: "全掌撑地，手指张开增加稳定。",
            weightTip: "可垫高双手在台阶上降低负重。",
          },
          actionGuide: {
            step1: "进入高位平板，收紧腹部。",
            step2: "一侧膝轻提向胸口方向，脚不落地或脚尖点地。",
            step3: "交替换腿，节奏慢、幅度小，骨盆尽量不左右晃。",
            breathing: "保持能说话的呼吸节奏，不要憋气。",
          },
          commonMistakes: ["臀部抬高", "耸肩", "速度过快像冲刺", "手腕疼痛仍坚持"],
          alternative: "站姿交替提膝扶墙，或死虫式。",
        },
        {
          id: "full-st-low-impact-jack",
          name: "低冲击开合步",
          phase: "strength",
          sets: 2,
          reps: "30秒",
          duration: "3分钟",
          equipment: "无需器械",
          visualPlaceholder: "low-impact-jack-placeholder",
          equipmentGuide: {
            machineIntro: "一脚向侧迈、另一脚并拢，无跳跃版本的开合，适合新手膝盖友好燃脂。",
            seatSetup: "站姿，周围空间足够。",
            postureSetup: "微屈膝缓冲，躯干略前倾一点点即可。",
            gripSetup: "双臂可配合侧举或胸前开合。",
            weightTip: "无负重，以节奏稳定为先。",
          },
          actionGuide: {
            step1: "右脚向右迈一步，左脚并步轻点。",
            step2: "再向左迈回，循环如「侧并步」。",
            step3: "手臂与腿节奏轻松配合，不追求高度。",
            breathing: "自然呼吸，鼻吸口呼均可。",
          },
          commonMistakes: ["膝盖内扣", "身体僵硬无缓冲", "步幅过大失衡"],
          alternative: "原地踏步加手臂开合。",
        },
      ],
      cardio: [
        {
          id: "full-ca-elliptical-steady",
          name: "椭圆机匀速全身有氧",
          phase: "cardio",
          sets: 1,
          reps: "10分钟",
          duration: "10分钟",
          equipment: "椭圆机",
          visualPlaceholder: "elliptical-fullbody-placeholder",
          equipmentGuide: {
            machineIntro: "椭圆机对膝盖冲击小，适合作为全身训练日的有氧收尾。",
            seatSetup: "踩稳踏板，系好鞋带。",
            postureSetup: "身体直立，髋膝踝顺滑联动。",
            gripSetup: "可握固定扶手测心率，或活动扶手全身参与。",
            weightTip: "阻力中低，保持匀速，结束前2分钟略降阻力放松。",
          },
          actionGuide: {
            step1: "前2分钟慢热身。",
            step2: "中间保持能简短对话的强度。",
            step3: "最后逐渐减速，不要骤停。",
            breathing: "深呼吸均匀。",
          },
          commonMistakes: ["全程最高阻力导致动作变形", "身体重量压在扶手上", "踮脚"],
          alternative: "跑步机快走或固定自行车。",
        },
      ],
      stretch: [
        {
          id: "full-st-hamstring-stretch",
          name: "坐姿体前屈（腘绳肌）",
          phase: "stretch",
          sets: 1,
          reps: "30秒",
          duration: "30秒",
          equipment: "瑜伽垫",
          visualPlaceholder: "hamstring-stretch-seated-placeholder",
          equipmentGuide: {
            machineIntro: "坐姿单腿或双腿伸直前屈，放松大腿后侧。",
            seatSetup: "坐于垫上，一腿或双腿伸直。",
            postureSetup: "脊柱尽量延长再前倾，而非圆背猛压。",
            gripSetup: "手扶小腿或膝盖，不勉强够脚。",
            weightTip: "无痛牵拉，微屈膝可降低难度。",
          },
          actionGuide: {
            step1: "坐直，脚回勾。",
            step2: "从髋部缓慢前倾至腿后侧有牵拉。",
            step3: "停留，深呼吸。",
            breathing: "呼气略加深幅度，吸气保持。",
          },
          commonMistakes: ["弹振下压", "憋气", "圆背用头去够腿"],
          alternative: "仰卧用弹力带勾脚轻拉。",
        },
        {
          id: "full-st-thoracic-open",
          name: "胸背打开组合拉伸",
          phase: "stretch",
          sets: 1,
          reps: "40秒",
          duration: "40秒",
          equipment: "泡沫轴或毛巾卷（可选）",
          visualPlaceholder: "thoracic-open-stretch-placeholder",
          equipmentGuide: {
            machineIntro: "仰卧或坐姿打开胸廓，缓解推举与划船日后的「含胸」感。",
            seatSetup: "仰卧时泡沫轴横放在上背部（非腰）。",
            postureSetup: "双手托头或交叉抱胸，骨盆稳定。",
            gripSetup: "肘部微开，像打开书本。",
            weightTip: "泡沫轴可用毛巾卷代替，幅度小即可。",
          },
          actionGuide: {
            step1: "仰卧，泡沫轴置于肩胛骨上缘附近。",
            step2: "呼气时胸椎轻轻伸展过轴，幅度小。",
            step3: "吸气还原，可沿上背缓慢移动1～2位置重复。",
            breathing: "伸展呼气，还原吸气。",
          },
          commonMistakes: ["轴放在腰椎", "颈部过度后仰", "追求弹响"],
          alternative: "站姿双手背后交扣打开胸口。",
        },
      ],
    },
  },
  {
    meta: {
      id: "period-recovery-day",
      title: "经期 · 低强度恢复",
      description:
        "以温和活动、浅角度力量与舒缓拉伸为主，不追求燃脂与极限力竭；若明显不适请以休息为主，可只做热身与拉伸。",
      estimatedMinutes: 30,
      intensity: "低强度",
      focus: "舒缓活动、关节温和活动、放松",
      trainingType: "恢复与经期友好",
      equipmentSummary: "瑜伽垫、墙面、室内步行空间",
      cycleStatus: "period",
      energyLevel: "low",
      targetArea: "recovery",
    },
    workoutByPhase: {
      warmup: [
        {
          id: "period-wu-cat-cow",
          name: "猫牛式",
          phase: "warmup",
          sets: 1,
          reps: "10次",
          duration: "1分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "cat-cow-placeholder",
          equipmentGuide: {
            machineIntro: "四足跪姿脊柱屈伸，温和活动背部与骨盆区域。",
            seatSetup: "双膝跪垫，手在肩下方，膝在髋下方。",
            postureSetup: "动作缓慢，幅度以舒适为限。",
            gripSetup: "手掌均匀压地，手指张开。",
            weightTip: "无负重，可在膝下垫毛巾增加舒适。",
          },
          actionGuide: {
            step1: "吸气，抬头让腹部自然下沉（牛式）。",
            step2: "呼气，低头拱背像「发怒的猫」。",
            step3: "骨盆随呼吸轻微联动，不追求极限弯折。",
            breathing: "与动作配合，不憋气。",
          },
          commonMistakes: ["用脖子猛甩", "速度过快", "手腕不适仍坚持"],
          alternative: "坐姿双手扶膝小幅脊柱屈伸。",
        },
        {
          id: "period-wu-easy-walk",
          name: "轻松步行",
          phase: "warmup",
          sets: 1,
          reps: "4～6分钟",
          duration: "5分钟",
          equipment: "室内过道或跑步机（慢走）",
          visualPlaceholder: "easy-walk-warmup-placeholder",
          equipmentGuide: {
            machineIntro: "非常慢的步行或跑步机慢走，让身体温和进入活动状态。",
            seatSetup: "跑步机则扶轻扶手保持平衡，速度设为慢走。",
            postureSetup: "抬头挺胸，肩放松，步幅小。",
            gripSetup: "自然摆臂，不要握死扶手。",
            weightTip: "零坡度或极低坡度，不追求出汗。",
          },
          actionGuide: {
            step1: "从极慢速度开始，逐渐到仍能说完整句子的节奏。",
            step2: "注意脚底柔和落地。",
            step3: "若乏力随时缩短时间。",
            breathing: "自然深呼吸。",
          },
          commonMistakes: ["越走越快变成快走", "低头看手机", "憋气"],
          alternative: "原地极慢踏步。",
        },
      ],
      strength: [
        {
          id: "period-st-wall-sit-shallow",
          name: "靠墙静蹲（浅角度）",
          phase: "strength",
          sets: 2,
          reps: "20～30秒",
          duration: "2分钟",
          equipment: "墙面",
          visualPlaceholder: "wall-sit-shallow-placeholder",
          equipmentGuide: {
            machineIntro: "背贴墙屈膝静态支撑，浅角度对膝盖压力较小，适合低强度日。",
            seatSetup: "背靠平整墙面，脚向前挪出适当距离。",
            postureSetup: "腰尽量贴墙，小腿与地面垂直或略浅。",
            gripSetup: "双手可放大腿上或自然放体侧。",
            weightTip: "角度宁高勿低，以无膝痛为准。",
          },
          actionGuide: {
            step1: "背靠墙下滑到大腿与地面约120～135度角（更浅也可）。",
            step2: "静态保持，均匀呼吸。",
            step3: "结束用手推大腿站起，不要突然松腿。",
            breathing: "缓慢腹式呼吸，不憋气。",
          },
          commonMistakes: ["蹲太深导致膝痛", "脚太近墙", "屏气"],
          alternative: "高椅坐姿「坐—站」重复几次替代静蹲。",
        },
        {
          id: "period-st-clamshell",
          name: "侧卧蚌式开合",
          phase: "strength",
          sets: 2,
          reps: "每侧12次",
          duration: "4分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "clamshell-period-placeholder",
          equipmentGuide: {
            machineIntro: "小幅度髋外展，激活臀中肌，强度低、关节友好。",
            seatSetup: "侧卧，头枕手臂或垫块毛巾。",
            postureSetup: "骨盆垂直地面，不前倒后翻。",
            gripSetup: "上方手扶地保持平衡即可。",
            weightTip: "可在膝上加迷你弹力带，经期建议徒手即可。",
          },
          actionGuide: {
            step1: "屈膝双脚并拢叠放。",
            step2: "上侧膝像贝壳打开，幅度小、速度慢。",
            step3: "感受臀外侧轻微酸胀即够，合拢时控制。",
            breathing: "打开呼气，合拢吸气。",
          },
          commonMistakes: ["骨盆跟着滚", "速度过快", "幅度过大"],
          alternative: "仰卧桥式双膝夹枕外展。",
        },
        {
          id: "period-st-pelvic-tilt-supine",
          name: "仰卧骨盆前后倾",
          phase: "strength",
          sets: 2,
          reps: "12次",
          duration: "3分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "pelvic-tilt-supine-placeholder",
          equipmentGuide: {
            machineIntro: "仰卧屈膝轻微骨盆卷动，强化下腹与骨盆意识，强度很低。",
            seatSetup: "仰卧屈膝，脚踩地与髋同宽。",
            postureSetup: "手臂放体侧，颈部放松。",
            gripSetup: "无需握持。",
            weightTip: "徒手，幅度极小也有效。",
          },
          actionGuide: {
            step1: "吸气准备，呼气时耻骨微微上提、腰贴垫（后倾感）。",
            step2: "吸气还原到自然腰曲，不要刻意猛压。",
            step3: "节奏慢，想象「肚脐与耻骨轻轻靠近再离开」。",
            breathing: "与口令同步，呼气做动作。",
          },
          commonMistakes: ["用腿猛蹬", "臀部离垫过高", "屏气"],
          alternative: "坐姿双手扶膝做小幅骨盆倾动。",
        },
      ],
      cardio: [
        {
          id: "period-ca-walk-talk-test",
          name: "轻松步行（对话强度）",
          phase: "cardio",
          sets: 1,
          reps: "5～8分钟",
          duration: "6分钟",
          equipment: "室内空间或跑步机",
          visualPlaceholder: "easy-walk-cardio-placeholder",
          equipmentGuide: {
            machineIntro: "经期有氧以「轻松、可持续」为原则，不追求心率峰值。",
            seatSetup: "跑步机用慢速平路，或户外平坦路面。",
            postureSetup: "肩放松，步伐小，随时可停。",
            gripSetup: "自然摆臂。",
            weightTip: "不增加负重，不爬坡（除非个人已习惯且无痛）。",
          },
          actionGuide: {
            step1: "以能轻松聊天的速度行走。",
            step2: "微微发热即可，不必出汗很多。",
            step3: "任何腹痛、头晕、乏力加重立即停止。",
            breathing: "自然呼吸。",
          },
          commonMistakes: ["为了完成时间而加快", "忽视身体信号", "空腹过久导致头晕"],
          alternative: "坐姿踝泵与深呼吸替代步行。",
        },
      ],
      stretch: [
        {
          id: "period-st-child-pose",
          name: "婴儿式",
          phase: "stretch",
          sets: 1,
          reps: "45秒",
          duration: "45秒",
          equipment: "瑜伽垫",
          visualPlaceholder: "child-pose-placeholder",
          equipmentGuide: {
            machineIntro: "跪坐前倾放松背部与腰骶，舒缓神经紧张感。",
            seatSetup: "双膝跪垫，双膝可分开给腹部留空间。",
            postureSetup: "臀部尽量靠脚跟（做不到可垫高臀部）。",
            gripSetup: "双臂前伸额头轻放垫上或手背叠放。",
            weightTip: "膝盖不适者加厚垫或改坐姿前倾。",
          },
          actionGuide: {
            step1: "缓慢呼气，身体前倾。",
            step2: "手臂向前延伸，肩胛放松。",
            step3: "深呼吸，感受背部柔和拉长。",
            breathing: "深慢呼吸，呼气时想象放松腰背部。",
          },
          commonMistakes: ["强迫额头贴地憋气", "膝盖疼痛仍跪姿"],
          alternative: "坐姿体前趴在大腿上休息。",
        },
        {
          id: "period-st-supine-spinal-twist",
          name: "仰卧脊柱扭转",
          phase: "stretch",
          sets: 1,
          reps: "每侧30秒",
          duration: "1分钟",
          equipment: "瑜伽垫",
          visualPlaceholder: "supine-twist-placeholder",
          equipmentGuide: {
            machineIntro: "仰卧屈膝倒向一侧，温和旋转胸椎与腰骶，动作应无痛。",
            seatSetup: "仰卧，双臂侧平举或T字。",
            postureSetup: "双肩尽量贴垫，扭转幅度小即可。",
            gripSetup: "可用一手轻按对侧膝辅助稳定。",
            weightTip: "无需负重，有拉伸感即停。",
          },
          actionGuide: {
            step1: "双膝并拢弯屈抬离垫面一点点或保持脚踩地倒膝。",
            step2: "呼气双膝缓慢倒向一侧，头可转向对侧或保持中立。",
            step3: "停留后吸气回正，换边。",
            breathing: "扭转呼气，回正吸气。",
          },
          commonMistakes: ["双肩离地猛扭", "追求弹响", "腹部不适仍扭转"],
          alternative: "坐姿转体扶椅背极小幅度。",
        },
      ],
    },
  },
];

function indexExercises(templates: WorkoutTemplate[]): Map<string, WorkoutExercise> {
  const map = new Map<string, WorkoutExercise>();
  for (const template of templates) {
    for (const phase of phaseOrder) {
      for (const exercise of template.workoutByPhase[phase]) {
        map.set(exercise.id, exercise);
      }
    }
  }
  return map;
}

const exerciseById = indexExercises(legacyWorkoutTemplates);
for (const exercise of NEW_WORKOUT_EXERCISES) {
  exerciseById.set(exercise.id, exercise);
}

export const workoutTemplates: WorkoutTemplate[] = [
  ...legacyWorkoutTemplates,
  ...buildWorkoutVariantTemplates(exerciseById),
];

/** Legacy ids kept for matchedTemplateId lookup; hidden from Training list UI. */
const HIDDEN_FROM_TEMPLATE_LIST_IDS = new Set([
  "upper-push-strength-day",
  "upper-pull-strength-day",
  "lower-core-strength-day",
  "period-recovery-day",
]);

/** User-visible template picker: new variants + full-body only. */
export const displayableWorkoutTemplates = workoutTemplates.filter(
  (item) => !HIDDEN_FROM_TEMPLATE_LIST_IDS.has(item.meta.id),
);

export function getOrderedExercises(templateId = "upper-push-strength-day"): WorkoutExercise[] {
  const template =
    workoutTemplates.find((item) => item.meta.id === templateId) ?? workoutTemplates[0];

  return phaseOrder.flatMap((phase) => template.workoutByPhase[phase]).map(withManifestMedia);
}

export function getPhasePlanForExec(templateId = "upper-push-strength-day") {
  const template =
    workoutTemplates.find((item) => item.meta.id === templateId) ?? workoutTemplates[0];

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
      exercises,
    };
  });
}

export function getWorkoutTemplateById(templateId: string): WorkoutTemplate {
  return (
    workoutTemplates.find((item) => item.meta.id === templateId) ??
    workoutTemplates.find((item) => item.meta.id === "upper-push-standard") ??
    workoutTemplates.find((item) => item.meta.id === "upper-push-strength-day") ??
    workoutTemplates[0]
  );
}
