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
    imageUrl: "/exercise-local/scap-activation.jpg",
    name: "肩胛激活",
  },
  "up-push-wu-scapula-activation": {
    imageUrl: "/exercise-local/scap-activation.jpg",
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
    imageUrl: "/exercise-local/dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-dumbbell-shoulder-press": {
    imageUrl: "/exercise-local/dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-lateral-raise": {
    videoUrl: "/exercise-local/dumbbell-lateral-raise.mp4",
    name: "哑铃侧平举",
  },
  "strength-cable-pushdown": {
    imageUrl: "/exercise-local/cable-pushdown.jpg",
    name: "绳索下压",
  },
  "up-push-st-cable-triceps-pushdown": {
    imageUrl: "/exercise-local/cable-pushdown.jpg",
    name: "绳索下压",
  },
  "cardio-elliptical": {
    videoUrl: "/exercise-local/elliptical.mp4",
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "up-push-ca-elliptical-easy": {
    videoUrl: "/exercise-local/elliptical.mp4",
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "lower-ca-elliptical-recovery": {
    videoUrl: "/exercise-local/elliptical-recovery.mp4",
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机匀速放松有氧",
  },
  "full-ca-elliptical-steady": {
    videoUrl: "/exercise-local/elliptical-steady.mp4",
    imageUrl: "/exercise-local/elliptical.jpg",
    name: "椭圆机匀速全身有氧",
  },
  "stretch-chest": {
    imageUrl: "/exercise-local/chest-stretch.jpg",
    name: "胸部拉伸",
  },
  "up-push-st-chest-stretch": {
    imageUrl: "/exercise-local/chest-stretch.jpg",
    name: "胸部拉伸",
  },
  "stretch-front-delt": {
    imageUrl: "/exercise-local/front-delt-stretch.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-push-st-front-shoulder-stretch": {
    imageUrl: "/exercise-local/front-delt-stretch.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-pull-wu-band-pull-apart": {
    videoUrl: "/exercise-local/band-pull-apart.mp4",
    name: "弹力带胸前拉开",
  },
  "up-pull-wu-dead-hang-light": {
    imageUrl: "/exercise-local/dead-hang-light.png",
    name: "悬垂肩袖激活（轻悬吊）",
  },
  "up-pull-st-lat-pulldown": {
    imageUrl: "/exercise-local/lat-pulldown.png",
    name: "高位下拉",
  },
  "up-pull-st-seated-cable-row": {
    videoUrl: "/exercise-local/seated-cable-row.mp4",
    name: "坐姿划船",
  },
  "up-pull-st-face-pull": {
    imageUrl: "/exercise-local/face-pull.jpeg",
    name: "绳索面拉",
  },
  "up-pull-st-dumbbell-curl": {
    videoUrl: "/exercise-local/dumbbell-curl.mp4",
    name: "哑铃弯举",
  },
  "up-pull-ca-rower-easy": {
    videoUrl: "/exercise-local/rower-easy.mp4",
    name: "划船机轻松划行",
  },
  "up-pull-st-lat-stretch": {
    videoUrl: "/exercise-local/lat-stretch.mp4",
    name: "背阔肌侧屈拉伸",
  },
  "up-pull-st-biceps-stretch": {
    imageUrl: "/exercise-local/biceps-wall-stretch.png",
    name: "肱二头肌扶墙拉伸",
  },
  "lower-wu-hip-circle": {
    imageUrl: "/exercise-local/hip-circle.png",
    name: "扶墙髋部绕环",
  },
  "lower-wu-bodyweight-squat": {
    videoUrl: "/exercise-local/bodyweight-squat-warmup.mp4",
    imageUrl: "/exercise-local/bodyweight-squat.jpg",
    name: "徒手深蹲热身",
  },
  "lower-st-leg-press": {
    videoUrl: "/exercise-local/leg-press.mp4",
    name: "腿举机",
  },
  "lower-st-hip-abduction": {
    videoUrl: "/exercise-local/hip-abduction.mp4",
    name: "坐姿髋外展",
  },
  "lower-st-leg-curl": {
    imageUrl: "/exercise-local/leg-curl.png",
    name: "腿弯举机",
  },
  "lower-st-dead-bug": {
    imageUrl: "/exercise-local/dead-bug.jpg",
    name: "死虫式",
  },
  "lower-st-quad-stretch": {
    imageUrl: "/exercise-local/quad-stretch.png",
    name: "站姿股四头肌拉伸",
  },
  "lower-st-glute-pigeon-lite": {
    imageUrl: "/exercise-local/seated-glute-stretch.jpg",
    name: "坐姿臀部拉伸（简易版）",
  },
  "full-wu-goblet-hold-squat": {
    videoUrl: "/exercise-local/bodyweight-squat-warmup.mp4",
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
    imageUrl: "/exercise-local/thoracic-open.jpg",
    name: "胸背打开组合拉伸",
  },
  "period-wu-cat-cow": {
    videoUrl: "/exercise-local/cat-cow.mp4",
    name: "猫牛式",
  },
  "period-wu-easy-walk": {
    imageUrl: "/exercise-local/easy-walk.png",
    name: "轻松步行",
  },
  "period-st-wall-sit-shallow": {
    videoUrl: "/exercise-local/wall-sit-shallow.mp4",
    name: "靠墙静蹲（浅角度）",
  },
  "period-st-clamshell": {
    imageUrl: "/exercise-local/clamshell.png",
    name: "侧卧蚌式开合",
  },
  "period-st-pelvic-tilt-supine": {
    imageUrl: "/exercise-local/pelvic-tilt-supine.png",
    name: "仰卧骨盆前后倾",
  },
  "period-ca-walk-talk-test": {
    imageUrl: "/exercise-local/walk-talk-test.png",
    name: "轻松步行（对话强度）",
  },
  "period-st-child-pose": {
    videoUrl: "/exercise-local/child-pose.mp4",
    name: "婴儿式",
  },
  "period-st-supine-spinal-twist": {
    imageUrl: "/exercise-local/supine-spinal-twist.png",
    name: "仰卧脊柱扭转",
  },
  "up-push-st-pec-fly": {
    imageUrl: "/exercise-local/pec-fly.jpg",
    name: "蝴蝶机夹胸",
  },
  "up-pull-st-reverse-pec-fly": {
    videoUrl: "/exercise-local/reverse-pec-fly.mp4",
    name: "蝴蝶机反向飞鸟",
  },
  "lower-st-hip-adduction": {
    videoUrl: "/exercise-local/hip-adduction.mp4",
    name: "坐姿内收",
  },
  "lower-st-glute-bridge": {
    videoUrl: "/exercise-local/glute-bridge.mp4",
    name: "臀桥",
  },
  "lower-st-plank": {
    imageUrl: "/exercise-local/plank.png",
    name: "平板支撑",
  },
  "lower-st-bird-dog": {
    imageUrl: "/exercise-local/bird-dog.png",
    name: "对侧伸展",
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
