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

function mergeInstructions(
  a?: string[],
  b?: string[],
  extras?: string[],
): string[] | undefined {
  const merged = [...(a ?? []), ...(b ?? []), ...(extras ?? [])];
  const unique = [...new Set(merged.filter(Boolean))];
  return unique.length ? unique : undefined;
}

function mergeExerciseMedia(a: ExerciseMedia, b: ExerciseMedia): ExerciseMedia {
  const primary = mediaRichnessScore(a) >= mediaRichnessScore(b) ? a : b;
  const secondary = primary === a ? b : a;
  const extras: string[] = [];
  if (primary.imageUrl && secondary.imageUrl && primary.imageUrl !== secondary.imageUrl) {
    extras.push(`Alternate local image: ${secondary.imageUrl}`);
  }
  if (primary.gifUrl && secondary.gifUrl && primary.gifUrl !== secondary.gifUrl) {
    extras.push(`Alternate local gif: ${secondary.gifUrl}`);
  }
  if (primary.videoUrl && secondary.videoUrl && primary.videoUrl !== secondary.videoUrl) {
    extras.push(`Alternate local video: ${secondary.videoUrl}`);
  }
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
    instructions: mergeInstructions(primary.instructions, secondary.instructions, extras),
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

/** Rebased branch media (videos + /exercise-media/ assets). */
const ADD_PICTURES_LOCAL_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  "warmup-shoulder-circle": {
    imageUrl: "/exercise-media/shoulder-circles.jpeg",
    name: "肩部环绕",
  },
  "up-push-wu-shoulder-circles": {
    imageUrl: "/exercise-media/shoulder-circles.jpeg",
    name: "肩部环绕",
  },
  "warmup-scap-activation": {
    imageUrl: "/exercise-media/scap-activation.jpg",
    name: "肩胛激活",
  },
  "up-push-wu-scapula-activation": {
    imageUrl: "/exercise-media/scap-activation.jpg",
    name: "肩胛激活",
  },
  "strength-machine-chest-press": {
    imageUrl: "/exercise-media/machine-chest-press.jpg",
    name: "器械推胸",
  },
  "up-push-st-machine-chest-press": {
    imageUrl: "/exercise-media/machine-chest-press.jpg",
    name: "器械推胸",
  },
  "strength-incline-pushup": {
    imageUrl: "/exercise-media/incline-push-up.jpg",
    name: "上斜俯卧撑",
  },
  "up-push-st-incline-push-up": {
    imageUrl: "/exercise-media/incline-push-up.jpg",
    name: "上斜俯卧撑",
  },
  "strength-dumbbell-shoulder-press": {
    imageUrl: "/exercise-media/dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-dumbbell-shoulder-press": {
    imageUrl: "/exercise-media/dumbbell-shoulder-press.jpg",
    name: "哑铃肩推",
  },
  "up-push-st-lateral-raise": {
    videoUrl: "/exercise-media/dumbbell-lateral-raise.mp4",
    name: "哑铃侧平举",
  },
  "strength-cable-pushdown": {
    imageUrl: "/exercise-media/cable-pushdown.jpg",
    name: "绳索下压",
  },
  "up-push-st-cable-triceps-pushdown": {
    imageUrl: "/exercise-media/cable-pushdown.jpg",
    name: "绳索下压",
  },
  "cardio-elliptical": {
    videoUrl: "/exercise-media/elliptical.mp4",
    imageUrl: "/exercise-media/elliptical-light.png",
    instructions: ["Alternate local image (Add Pictures): /exercise-media/elliptical.jpg"],
    name: "椭圆机轻有氧",
  },
  "up-push-ca-elliptical-easy": {
    videoUrl: "/exercise-media/elliptical.mp4",
    imageUrl: "/exercise-media/elliptical-light.png",
    instructions: ["Alternate local image (Add Pictures): /exercise-media/elliptical.jpg"],
    name: "椭圆机轻有氧",
  },
  "lower-ca-elliptical-recovery": {
    videoUrl: "/exercise-media/elliptical-recovery.mp4",
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机匀速放松有氧",
  },
  "full-ca-elliptical-steady": {
    videoUrl: "/exercise-media/elliptical-steady.mp4",
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机匀速全身有氧",
  },
  "stretch-chest": {
    imageUrl: "/exercise-media/chest-stretch.jpg",
    name: "胸部拉伸",
  },
  "up-push-st-chest-stretch": {
    imageUrl: "/exercise-media/chest-stretch.jpg",
    name: "胸部拉伸",
  },
  "stretch-front-delt": {
    imageUrl: "/exercise-media/front-delt-stretch.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-push-st-front-shoulder-stretch": {
    imageUrl: "/exercise-media/front-delt-stretch.jpg",
    name: "肩前三角肌拉伸",
  },
  "up-pull-wu-band-pull-apart": {
    videoUrl: "/exercise-media/band-pull-apart.mp4",
    name: "弹力带胸前拉开",
  },
  "up-pull-wu-dead-hang-light": {
    imageUrl: "/exercise-media/dead-hang-light.png",
    instructions: ["Alternate local image (main): /exercise-media/dead-hang-light.jpeg"],
    name: "悬垂肩袖激活（轻悬吊）",
  },
  "up-pull-st-lat-pulldown": {
    imageUrl: "/exercise-media/lat-pulldown.png",
    name: "高位下拉",
  },
  "up-pull-st-seated-cable-row": {
    videoUrl: "/exercise-media/seated-cable-row.mp4",
    name: "坐姿划船",
  },
  "up-pull-st-face-pull": {
    imageUrl: "/exercise-media/face-pull.jpeg",
    name: "绳索面拉",
  },
  "up-pull-st-dumbbell-curl": {
    videoUrl: "/exercise-media/dumbbell-curl.mp4",
    name: "哑铃弯举",
  },
  "up-pull-ca-rower-easy": {
    videoUrl: "/exercise-media/rower-easy.mp4",
    name: "划船机轻松划行",
  },
  "up-pull-st-lat-stretch": {
    videoUrl: "/exercise-media/lat-stretch.mp4",
    name: "背阔肌侧屈拉伸",
  },
  "up-pull-st-biceps-stretch": {
    imageUrl: "/exercise-media/biceps-wall-stretch.png",
    name: "肱二头肌扶墙拉伸",
  },
  "lower-wu-hip-circle": {
    imageUrl: "/exercise-media/hip-circle.png",
    name: "扶墙髋部绕环",
  },
  "lower-wu-bodyweight-squat": {
    videoUrl: "/exercise-media/bodyweight-squat-warmup.mp4",
    imageUrl: "/exercise-media/bodyweight-squat.jpg",
    name: "徒手深蹲热身",
  },
  "lower-st-leg-press": {
    videoUrl: "/exercise-media/leg-press.mp4",
    name: "腿举机",
  },
  "lower-st-hip-abduction": {
    videoUrl: "/exercise-media/hip-abduction.mp4",
    name: "坐姿髋外展",
  },
  "lower-st-leg-curl": {
    imageUrl: "/exercise-media/leg-curl.png",
    name: "腿弯举机",
  },
  "lower-st-dead-bug": {
    imageUrl: "/exercise-media/dead-bug.jpg",
    name: "死虫式",
  },
  "lower-st-quad-stretch": {
    imageUrl: "/exercise-media/quad-stretch.png",
    name: "站姿股四头肌拉伸",
  },
  "lower-st-glute-pigeon-lite": {
    imageUrl: "/exercise-media/seated-glute-stretch.jpg",
    name: "坐姿臀部拉伸（简易版）",
  },
  "full-wu-goblet-hold-squat": {
    videoUrl: "/exercise-media/bodyweight-squat-warmup.mp4",
    imageUrl: "/exercise-media/bodyweight-squat.jpg",
    name: "徒手深蹲节奏热身",
  },
  "full-wu-arm-leg-swing": {
    imageUrl: "/exercise-media/arm-leg-swing.jpg",
    name: "手臂绕环与摆腿",
  },
  "full-st-db-rdl": {
    imageUrl: "/exercise-media/db-rdl.jpg",
    name: "哑铃罗马尼亚硬拉",
  },
  "full-st-db-squat-to-press": {
    imageUrl: "/exercise-media/db-squat-to-press.jpg",
    name: "哑铃深蹲推举",
  },
  "full-st-mountain-climber-slow": {
    imageUrl: "/exercise-media/mountain-climber.jpg",
    name: "登山者（慢速低幅度）",
  },
  "full-st-low-impact-jack": {
    imageUrl: "/exercise-media/low-impact-jack.jpeg",
    name: "低冲击开合步",
  },
  "full-st-hamstring-stretch": {
    imageUrl: "/exercise-media/seated-forward-fold.jpg",
    name: "坐姿体前屈（腘绳肌）",
  },
  "full-st-thoracic-open": {
    imageUrl: "/exercise-media/thoracic-open.jpg",
    name: "胸背打开组合拉伸",
  },
  "period-wu-cat-cow": {
    videoUrl: "/exercise-media/cat-cow.mp4",
    name: "猫牛式",
  },
  "period-wu-easy-walk": {
    imageUrl: "/exercise-media/easy-walk.png",
    instructions: ["Alternate local image (main): /exercise-media/easy-walk.jpg"],
    name: "轻松步行",
  },
  "period-st-wall-sit-shallow": {
    videoUrl: "/exercise-media/wall-sit-shallow.mp4",
    name: "靠墙静蹲（浅角度）",
  },
  "period-st-clamshell": {
    imageUrl: "/exercise-media/clamshell.png",
    name: "侧卧蚌式开合",
  },
  "period-st-pelvic-tilt-supine": {
    imageUrl: "/exercise-media/pelvic-tilt-supine.png",
    name: "仰卧骨盆前后倾",
  },
  "period-ca-walk-talk-test": {
    imageUrl: "/exercise-media/walk-talk-test.png",
    name: "轻松步行（对话强度）",
  },
  "period-st-child-pose": {
    videoUrl: "/exercise-media/child-pose.mp4",
    name: "婴儿式",
  },
  "period-st-supine-spinal-twist": {
    imageUrl: "/exercise-media/supine-spinal-twist.png",
    name: "仰卧脊柱扭转",
  },
  "up-push-st-pec-fly": {
    imageUrl: "/exercise-media/pec-fly.jpg",
    name: "蝴蝶机夹胸",
  },
  "up-pull-st-reverse-pec-fly": {
    videoUrl: "/exercise-media/reverse-pec-fly.mp4",
    name: "蝴蝶机反向飞鸟",
  },
  "lower-st-hip-adduction": {
    videoUrl: "/exercise-media/hip-adduction.mp4",
    name: "坐姿内收",
  },
  "lower-st-glute-bridge": {
    videoUrl: "/exercise-media/glute-bridge.mp4",
    name: "臀桥",
  },
  "lower-st-plank": {
    videoUrl: "/exercise-media/plank.mp4",
    imageUrl: "/exercise-media/plank.png",
    name: "平板支撑",
  },
  "lower-st-bird-dog": {
    imageUrl: "/exercise-media/bird-dog.png",
    name: "对侧伸展",
  },
};

/**
 * Main-branch entries to merge in (ExerciseDB /exercises/ paths remapped to /exercise-media/ where available).
 * Overlapping ids are merged via mergeExerciseMedia — richer Add Pictures media wins field priority.
 */
const MAIN_LOCAL_EXERCISE_MEDIA: Record<string, ExerciseMedia> = {
  "cardio-elliptical": {
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "up-push-ca-elliptical-easy": {
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机轻有氧",
  },
  "lower-ca-elliptical-recovery": {
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机匀速放松有氧",
  },
  "full-ca-elliptical-steady": {
    imageUrl: "/exercise-media/elliptical.jpg",
    name: "椭圆机匀速全身有氧",
  },
  "period-wu-easy-walk": {
    imageUrl: "/exercise-media/easy-walk.jpg",
    name: "轻松步行",
  },
  "period-ca-walk-talk-test": {
    imageUrl: "/exercise-media/easy-walk.jpg",
    instructions: ["Main used easy-walk.jpg for walk-talk-test; UI uses walk-talk-test.png"],
    name: "轻松步行（对话强度）",
  },
  "up-pull-wu-dead-hang-light": {
    imageUrl: "/exercise-media/dead-hang-light.jpeg",
    name: "悬垂肩袖激活（轻悬吊）",
  },
  "full-st-thoracic-open": {
    imageUrl: "/exercise-media/chest-stretch.jpg",
    instructions: ["Main fallback used chest-stretch.jpg"],
    name: "胸背打开组合拉伸",
  },
  "period-st-supine-spinal-twist": {
    instructions: ["Main placeholder used period-st-child-pose.jpg; Add Pictures uses supine-spinal-twist.png"],
    name: "仰卧脊柱扭转",
  },
  "lower-st-plank": {
    videoUrl: "/exercise-media/plank.mp4",
    name: "平板支撑",
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
  ADD_PICTURES_LOCAL_EXERCISE_MEDIA,
  MAIN_LOCAL_EXERCISE_MEDIA,
  buildFirstGymStarterLocalMedia(),
);
