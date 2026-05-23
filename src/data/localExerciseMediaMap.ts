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

function buildFirstGymStarterLocalMedia(): Record<string, ExerciseMedia> {
  const map: Record<string, ExerciseMedia> = {};
  for (const id of FIRST_GYM_STARTER_EXERCISE_IDS) {
    const entry = getExerciseMediaFromManifest(id);
    if (entry?.imageUrl) {
      map[id] = { imageUrl: entry.imageUrl };
    }
  }
  return map;
}

export const localExerciseMediaMap: Record<string, ExerciseMedia> =
  buildFirstGymStarterLocalMedia();
