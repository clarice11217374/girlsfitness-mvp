export type ExerciseMediaRegistryItem = {
  query: string;
  aliases?: string[];
  preferredMatch?: string;
  localGifUrl?: string;
  localImageUrl?: string;
  localVideoUrl?: string;
  note?: string;
};

export const exerciseMediaRegistry: Record<string, ExerciseMediaRegistryItem> = {
  "warmup-shoulder-circle": {
    query: "shoulder circles",
    aliases: ["arm circles"],
    preferredMatch: "shoulder circles",
  },
  "warmup-scap-activation": {
    query: "scapular activation",
    aliases: ["scapular pull up", "scapular retraction"],
    preferredMatch: "scapular activation",
  },
  "strength-machine-chest-press": {
    query: "chest press",
    aliases: ["machine chest press", "lever chest press"],
    preferredMatch: "chest press",
  },
  "strength-dumbbell-shoulder-press": {
    query: "dumbbell shoulder press",
    aliases: ["dumbbell seated shoulder press"],
    preferredMatch: "dumbbell shoulder press",
  },
  "strength-cable-pushdown": {
    query: "triceps pushdown",
    aliases: ["cable triceps pushdown", "pushdown"],
    preferredMatch: "triceps pushdown",
  },
  "strength-incline-pushup": {
    query: "incline push up",
    aliases: ["incline push-up", "push up"],
    preferredMatch: "incline push up",
  },
  "cardio-elliptical": {
    query: "elliptical trainer",
    aliases: ["elliptical"],
    preferredMatch: "elliptical trainer",
  },
  "stretch-chest": {
    query: "chest stretch",
    aliases: ["standing chest stretch"],
    preferredMatch: "chest stretch",
  },
  "stretch-front-delt": {
    query: "shoulder stretch",
    aliases: ["front shoulder stretch", "anterior deltoid stretch"],
    preferredMatch: "shoulder stretch",
  },
  "up-push-wu-shoulder-circles": {
    query: "shoulder circles",
    aliases: ["arm circles"],
    preferredMatch: "shoulder circles",
  },
  "up-push-wu-scapula-activation": {
    query: "scapular activation",
    aliases: ["scapular pull up", "scapular retraction"],
    preferredMatch: "scapular activation",
  },
  "up-push-st-machine-chest-press": {
    query: "chest press",
    aliases: ["machine chest press", "lever chest press"],
    preferredMatch: "chest press",
  },
  "up-push-st-dumbbell-shoulder-press": {
    query: "dumbbell shoulder press",
    aliases: ["dumbbell seated shoulder press"],
    preferredMatch: "dumbbell shoulder press",
  },
  "up-push-st-cable-triceps-pushdown": {
    query: "triceps pushdown",
    aliases: ["cable triceps pushdown", "pushdown"],
    preferredMatch: "triceps pushdown",
  },
  "up-push-st-incline-push-up": {
    query: "incline push up",
    aliases: ["incline push-up", "push up"],
    preferredMatch: "incline push up",
  },
  "up-push-ca-elliptical-easy": {
    query: "elliptical trainer",
    aliases: ["elliptical"],
    preferredMatch: "elliptical trainer",
  },
  "up-push-st-chest-stretch": {
    query: "chest stretch",
    aliases: ["standing chest stretch"],
    preferredMatch: "chest stretch",
  },
  "up-push-st-front-shoulder-stretch": {
    query: "shoulder stretch",
    aliases: ["front shoulder stretch", "anterior deltoid stretch"],
    preferredMatch: "shoulder stretch",
  },
  "up-pull-wu-band-pull-apart": {
    query: "band pull apart",
    aliases: ["resistance band pull apart"],
    preferredMatch: "band pull apart",
  },
  "up-pull-wu-dead-hang-light": {
    query: "dead hang",
    aliases: ["scapular pull up", "hanging scapular shrug"],
    preferredMatch: "dead hang",
  },
  "up-pull-st-lat-pulldown": {
    query: "lat pulldown",
    aliases: ["cable lat pulldown"],
    preferredMatch: "lat pulldown",
  },
  "up-pull-st-seated-cable-row": {
    query: "seated cable row",
    aliases: ["cable seated row", "seated row"],
    preferredMatch: "seated cable row",
  },
  "up-pull-st-face-pull": {
    query: "face pull",
    aliases: ["cable face pull"],
    preferredMatch: "face pull",
  },
  "up-pull-st-dumbbell-curl": {
    query: "dumbbell curl",
    aliases: ["dumbbell biceps curl"],
    preferredMatch: "dumbbell curl",
  },
  "up-pull-ca-rower-easy": {
    query: "rowing machine",
    aliases: ["rower", "machine row"],
    preferredMatch: "rowing machine",
  },
  "up-pull-st-lat-stretch": {
    query: "lat stretch",
    aliases: ["latissimus dorsi stretch", "side lat stretch"],
    preferredMatch: "lat stretch",
  },
  "up-pull-st-biceps-stretch": {
    query: "biceps stretch",
    aliases: ["wall biceps stretch"],
    preferredMatch: "biceps stretch",
  },
  "lower-wu-hip-circle": {
    query: "hip circles",
    aliases: ["standing hip circles"],
    preferredMatch: "hip circles",
  },
  "lower-wu-bodyweight-squat": {
    query: "bodyweight squat",
    aliases: ["squat"],
    preferredMatch: "bodyweight squat",
  },
  "lower-st-leg-press": {
    query: "leg press",
    aliases: ["sled leg press"],
    preferredMatch: "leg press",
  },
  "lower-st-hip-abduction": {
    query: "hip abduction",
    aliases: ["seated hip abduction", "abductor machine"],
    preferredMatch: "hip abduction",
  },
  "lower-st-leg-curl": {
    query: "leg curl",
    aliases: ["seated leg curl", "lying leg curl"],
    preferredMatch: "leg curl",
  },
  "lower-st-dead-bug": {
    query: "dead bug",
    aliases: ["dead bug exercise"],
    preferredMatch: "dead bug",
  },
  "lower-ca-elliptical-recovery": {
    query: "elliptical trainer",
    aliases: ["elliptical"],
    preferredMatch: "elliptical trainer",
  },
  "lower-st-quad-stretch": {
    query: "quadriceps stretch",
    aliases: ["standing quadriceps stretch", "quad stretch"],
    preferredMatch: "quadriceps stretch",
  },
  "lower-st-glute-pigeon-lite": {
    query: "pigeon stretch",
    aliases: ["pigeon pose", "seated glute stretch"],
    preferredMatch: "pigeon stretch",
  },
  "full-wu-arm-leg-swing": {
    query: "arm circles",
    aliases: ["leg swings", "standing arm circles"],
    preferredMatch: "arm circles",
  },
  "full-wu-goblet-hold-squat": {
    query: "bodyweight squat",
    aliases: ["squat", "goblet squat"],
    preferredMatch: "bodyweight squat",
  },
  "full-st-db-rdl": {
    query: "dumbbell romanian deadlift",
    aliases: ["dumbbell rdl"],
    preferredMatch: "dumbbell romanian deadlift",
  },
  "full-st-db-squat-to-press": {
    query: "dumbbell squat to press",
    aliases: ["dumbbell thruster", "squat to press"],
    preferredMatch: "dumbbell squat to press",
  },
  "full-st-mountain-climber-slow": {
    query: "mountain climber",
    aliases: ["mountain climbers"],
    preferredMatch: "mountain climber",
  },
  "full-st-low-impact-jack": {
    query: "low impact jumping jack",
    aliases: ["jumping jack", "step jack"],
    preferredMatch: "low impact jumping jack",
  },
  "full-ca-elliptical-steady": {
    query: "elliptical trainer",
    aliases: ["elliptical"],
    preferredMatch: "elliptical trainer",
  },
  "full-st-hamstring-stretch": {
    query: "seated hamstring stretch",
    aliases: ["hamstring stretch"],
    preferredMatch: "seated hamstring stretch",
  },
  "full-st-thoracic-open": {
    query: "chest opener stretch",
    aliases: ["thoracic open book", "open book stretch"],
    preferredMatch: "chest opener stretch",
  },
  "period-wu-cat-cow": {
    query: "cat cow stretch",
    aliases: ["cat cow"],
    preferredMatch: "cat cow stretch",
  },
  "period-wu-easy-walk": {
    query: "walking",
    aliases: ["walk"],
    preferredMatch: "walking",
  },
  "period-st-wall-sit-shallow": {
    query: "wall sit",
    aliases: ["wall squat"],
    preferredMatch: "wall sit",
  },
  "period-st-clamshell": {
    query: "clamshell",
    aliases: ["clamshell exercise"],
    preferredMatch: "clamshell",
  },
  "period-st-pelvic-tilt-supine": {
    query: "pelvic tilt",
    aliases: ["supine pelvic tilt"],
    preferredMatch: "pelvic tilt",
  },
  "period-ca-walk-talk-test": {
    query: "walking",
    aliases: ["walk"],
    preferredMatch: "walking",
  },
  "period-st-child-pose": {
    query: "child pose",
    aliases: ["child's pose"],
    preferredMatch: "child pose",
  },
  "period-st-supine-spinal-twist": {
    query: "supine spinal twist",
    aliases: ["spinal twist", "lying spinal twist"],
    preferredMatch: "supine spinal twist",
  },
};
