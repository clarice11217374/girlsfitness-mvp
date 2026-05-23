import type { ExerciseMedia } from "@/types/exerciseMedia";
import { getExerciseMediaFromManifest } from "@/data/exerciseMediaManifest";

/** first-gym-starter-day: manifest key === exercise id === public/exercises/{id}.jpg */
const FIRST_GYM_STARTER_EXERCISE_IDS = [
  "fg-starter-wu-shoulder-circles",
  "fg-starter-wu-treadmill-walk",
  "fg-starter-st-chest-press",
  "fg-starter-st-lat-pulldown",
  "fg-starter-ca-elliptical",
  "fg-starter-st-hamstring-stretch",
  "fg-starter-st-seated-side-stretch",
] as const;

function mediaRichnessScore(media: ExerciseMedia): number {
  return (media.videoUrl ? 4 : 0) + (media.gifUrl ? 2 : 0) + (media.imageUrl ? 1 : 0);
}

function mergeExerciseMedia(a: ExerciseMedia, b: ExerciseMedia): ExerciseMedia {
  const primary = mediaRichnessScore(a) >= mediaRichnessScore(b) ? a : b;
  const secondary = primary === a ? b : a;
  return {
    ...secondary,
    ...primary,
    name: primary.name ?? secondary.name,
    exerciseId: primary.exerciseId ?? secondary.exerciseId,
    videoUrl: primary.videoUrl ?? secondary.videoUrl,
    gifUrl: primary.gifUrl ?? secondary.gifUrl,
    imageUrl: primary.imageUrl ?? secondary.imageUrl,
    targetMuscles: primary.targetMuscles ?? secondary.targetMuscles,
    bodyParts: primary.bodyParts ?? secondary.bodyParts,
    equipments: primary.equipments ?? secondary.equipments,
    secondaryMuscles: primary.secondaryMuscles ?? secondary.secondaryMuscles,
    instructions: primary.instructions ?? secondary.instructions,
  };
}

function buildFirstGymStarterLocalMedia(): Record<string, ExerciseMedia> {
  const map: Record<string, ExerciseMedia> = {};
  for (const id of FIRST_GYM_STARTER_EXERCISE_IDS) {
    const entry = getExerciseMediaFromManifest(id);
    if (!entry) continue;
    const media: ExerciseMedia = {};
    if (entry.imageUrl) media.imageUrl = entry.imageUrl;
    if (entry.videoUrl) media.videoUrl = entry.videoUrl;
    if (media.imageUrl || media.videoUrl) {
      map[id] = media;
    }
  }
  return map;
}

const UI_SYH_LOCAL_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  "warmup-shoulder-circle": {
    imageUrl: "/exercise-local/shoulder-circles.jpeg",
    name: "肩部环绕",
  },
  "up-push-wu-shoulder-circles": {
    imageUrl: "/exercise-local/shoulder-circles.jpeg",
    name: "肩部环绕",
  },
  "warmup-scap-activation": {
    imageUrl: "/exercises/warmup-scap-activation.jpg",
    name: "肩胛激活",
  },
  "up-push-wu-scapula-activation": {
    imageUrl: "/exercises/up-push-wu-scapula-activation.jpg",
    name: "肩胛激活",
  },
  "strength-machine-chest-press": {
    imageUrl: "/exercise-local/machine-chest-press.jpg",
    name: "器械推胸",
  },
  "up-push-st-machine-chest-press": {
    imageUrl: "/exercise-local/machine-chest-press.jpg",
    name: "器械推胸",
  },
  "strength-incline-pushup": {
    imageUrl: "/exercise-local/incline-push-up.jpg",
    name: "上斜俯卧撑",
  },
  "up-push-st-incline-push-up": {
    imageUrl: "/exercise-local/incline-push-up.jpg",
    name: "上斜俯卧撑",
  },
  "strength-dumbbell-shoulder-press": {
    imageUrl: "/exercises/strength-dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-dumbbell-shoulder-press": {
    imageUrl: "/exercises/up-push-st-dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-lateral-raise": {
    videoUrl: "/exercise-local/dumbbell-lateral-raise.mp4",
    name: "哑铃侧平举",
  },
  "strength-cable-pushdown": {
    imageUrl: "/exercises/strength-cable-pushdown.jpg",
    name: "绳索下压",
  },
  "up-push-st-cable-triceps-pushdown": {
    imageUrl: "/exercises/up-push-st-cable-triceps-pushdown.jpg",
    name: "绳索下压",
  },
  "cardio-elliptical": {
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "up-push-ca-elliptical-easy": {
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "lower-ca-elliptical-recovery": {
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机匀速放松有氧",
  },
  "full-ca-elliptical-steady": {
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机匀速全身有氧",
  },
  "stretch-chest": {
    imageUrl: "/exercises/stretch-chest.jpg",
    name: "胸部拉伸",
  },
  "up-push-st-chest-stretch": {
    imageUrl: "/exercises/up-push-st-chest-stretch.jpg",
    name: "胸部拉伸",
  },
  "stretch-front-delt": {
    imageUrl: "/exercises/stretch-front-delt.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-push-st-front-shoulder-stretch": {
    imageUrl: "/exercises/up-push-st-front-shoulder-stretch.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-pull-wu-band-pull-apart": {
    imageUrl: "/exercises/up-pull-wu-band-pull-apart.jpg",
    name: "弹力带胸前拉开",
  },
  "up-pull-wu-dead-hang-light": {
    imageUrl: "/exercises/up-pull-wu-dead-hang-light.jpg",
    name: "悬垂肩袖激活（轻悬吊）",
  },
  "up-pull-st-lat-pulldown": {
    imageUrl: "/exercises/up-pull-st-lat-pulldown.jpg",
    name: "高位下拉",
  },
  "up-pull-st-seated-cable-row": {
    imageUrl: "/exercises/up-pull-st-seated-cable-row.jpg",
    name: "坐姿划船",
  },
  "up-pull-st-face-pull": {
    imageUrl: "/exercises/up-pull-st-face-pull.jpg",
    name: "绳索面拉",
  },
  "up-pull-st-dumbbell-curl": {
    imageUrl: "/exercises/up-pull-st-dumbbell-curl.jpg",
    name: "哑铃弯举",
  },
  "up-pull-ca-rower-easy": {
    imageUrl: "/exercises/up-pull-ca-rower-easy.jpg",
    name: "划船机轻松划行",
  },
  "up-pull-st-lat-stretch": {
    imageUrl: "/exercises/up-pull-st-lat-stretch.jpg",
    name: "背阔肌侧屈拉伸",
  },
  "up-pull-st-biceps-stretch": {
    imageUrl: "/exercises/up-pull-st-biceps-stretch.jpg",
    name: "肱二头肌扶墙拉伸",
  },
  "lower-wu-hip-circle": {
    imageUrl: "/exercises/lower-wu-hip-circle.jpg",
    name: "扶墙髋部绕环",
  },
  "lower-wu-bodyweight-squat": {
    imageUrl: "/exercise-local/bodyweight-squat.jpg",
    name: "徒手深蹲热身",
  },
  "lower-st-leg-press": {
    imageUrl: "/exercises/lower-st-leg-press.jpg",
    name: "腿举机",
  },
  "lower-st-hip-abduction": {
    imageUrl: "/exercises/lower-st-hip-abduction.jpg",
    name: "坐姿髋外展",
  },
  "lower-st-leg-curl": {
    imageUrl: "/exercises/lower-st-leg-curl.jpg",
    name: "腿弯举机",
  },
  "lower-st-dead-bug": {
    imageUrl: "/exercises/lower-st-dead-bug.jpg",
    name: "死虫式",
  },
  "lower-st-quad-stretch": {
    imageUrl: "/exercises/lower-st-quad-stretch.jpg",
    name: "站姿股四头肌拉伸",
  },
  "lower-st-glute-pigeon-lite": {
    imageUrl: "/exercises/lower-st-glute-pigeon-lite.jpg",
    name: "坐姿臀部拉伸（简易版）",
  },
  "full-wu-goblet-hold-squat": {
    imageUrl: "/exercise-local/bodyweight-squat.jpg",
    name: "徒手深蹲节奏热身",
  },
  "full-wu-arm-leg-swing": {
    imageUrl: "/exercise-local/arm-leg-swing.jpg",
    name: "手臂绕环与摆腿",
  },
  "full-st-db-rdl": {
    imageUrl: "/exercise-local/db-rdl.jpg",
    name: "哑铃罗马尼亚硬拉",
  },
  "full-st-db-squat-to-press": {
    imageUrl: "/exercise-local/db-squat-to-press.jpg",
    name: "哑铃深蹲推举",
  },
  "full-st-mountain-climber-slow": {
    imageUrl: "/exercise-local/mountain-climber.jpg",
    name: "登山者（慢速低幅度）",
  },
  "full-st-low-impact-jack": {
    imageUrl: "/exercise-local/low-impact-jack.jpeg",
    name: "低冲击开合步",
  },
  "full-st-hamstring-stretch": {
    imageUrl: "/exercise-local/seated-forward-fold.jpg",
    name: "坐姿体前屈（腘绳肌）",
  },
  "full-st-thoracic-open": {
    imageUrl: "/exercises/stretch-chest.jpg",
    name: "胸背打开组合拉伸",
  },
  "period-wu-cat-cow": {
    imageUrl: "/exercises/period-wu-cat-cow.jpg",
    name: "猫牛式",
  },
  "period-wu-easy-walk": {
    imageUrl: "/exercises/period-wu-easy-walk.jpg",
    name: "轻松步行",
  },
  "period-st-wall-sit-shallow": {
    imageUrl: "/exercises/period-st-wall-sit-shallow.jpg",
    name: "靠墙静蹲（浅角度）",
  },
  "period-st-clamshell": {
    imageUrl: "/exercises/period-st-clamshell.jpg",
    name: "侧卧蚌式开合",
  },
  "period-st-pelvic-tilt-supine": {
    imageUrl: "/exercises/period-st-pelvic-tilt-supine.jpg",
    name: "仰卧骨盆前后倾",
  },
  "period-ca-walk-talk-test": {
    imageUrl: "/exercises/period-ca-walk-talk-test.jpg",
    name: "轻松步行（对话强度）",
  },
  "period-st-child-pose": {
    imageUrl: "/exercises/period-st-child-pose.jpg",
    name: "婴儿式",
  },
  "period-st-supine-spinal-twist": {
    imageUrl: "/exercises/period-st-child-pose.jpg",
    name: "仰卧脊柱扭转",
  },
};

function mergeLocalExerciseMediaMaps(
  ...maps: Record<string, ExerciseMedia>[]
): Record<string, ExerciseMedia> {
  const result: Record<string, ExerciseMedia> = {};
  for (const map of maps) {
    for (const [id, media] of Object.entries(map)) {
      result[id] = result[id] ? mergeExerciseMedia(result[id], media) : media;
    }
  }
  return result;
}

export const localExerciseMediaMap: Record<string, ExerciseMedia> = mergeLocalExerciseMediaMaps(
  UI_SYH_LOCAL_EXERCISE_MEDIA,
  buildFirstGymStarterLocalMedia(),
);
