import { writeFile } from "node:fs/promises";
import { workoutByPhase as staticWorkoutByPhase, type WorkoutExercise as StaticWorkoutExercise } from "../src/data/workoutData";
import {
  workoutTemplates,
  type WorkoutExercise as TemplateWorkoutExercise,
} from "../src/data/workoutTemplates";
import { getExerciseMediaQuery } from "../src/utils/getExerciseMediaQuery";
import { exerciseMediaRegistry } from "../src/data/exerciseMediaRegistry";

type CheckExercise = {
  id: string;
  name: string;
  mediaSearchQuery?: string;
  englishName?: string;
  slug?: string;
};

type MediaResponse = {
  success?: boolean;
  data?: {
    gifUrl?: string | null;
    imageUrl?: string | null;
    videoUrl?: string | null;
    name?: string;
  } | null;
  debug?: {
    searchQuery: string;
    preferredMatch?: string;
    matchedName?: string;
    score: number;
    candidateCount: number;
  };
};

type ReportRow = {
  exerciseId: string;
  name: string;
  searchQuery: string;
  matchedName: string | null;
  hasGif: boolean;
  score: number;
  status: "OK" | "NEEDS_REVIEW";
};

const SCORE_REVIEW_THRESHOLD = 55;
const API_BASE = "http://localhost:3000";

function collectExercises(): CheckExercise[] {
  const byId = new Map<string, CheckExercise>();

  for (const exercises of Object.values(staticWorkoutByPhase)) {
    for (const exercise of exercises as StaticWorkoutExercise[]) {
      byId.set(exercise.id, exercise);
    }
  }

  for (const template of workoutTemplates) {
    for (const exercises of Object.values(template.workoutByPhase)) {
      for (const exercise of exercises as TemplateWorkoutExercise[]) {
        byId.set(exercise.id, exercise);
      }
    }
  }

  return [...byId.values()];
}

async function checkExercise(exercise: CheckExercise): Promise<ReportRow> {
  const registryItem = exerciseMediaRegistry[exercise.id];
  const searchQuery = getExerciseMediaQuery(exercise);
  const params = new URLSearchParams({ name: searchQuery });
  if (registryItem?.preferredMatch) params.set("preferred", registryItem.preferredMatch);

  try {
    const response = await fetch(`${API_BASE}/api/exercises/media?${params.toString()}`);
    const payload = (await response.json()) as MediaResponse;
    const score = payload.debug?.score ?? 0;
    const hasGif = !!(registryItem?.localGifUrl || payload.data?.gifUrl);
    const needsReview = !response.ok || payload.success === false || !hasGif || score < SCORE_REVIEW_THRESHOLD;

    return {
      exerciseId: exercise.id,
      name: exercise.name,
      searchQuery,
      matchedName: payload.debug?.matchedName ?? payload.data?.name ?? null,
      hasGif,
      score,
      status: needsReview ? "NEEDS_REVIEW" : "OK",
    };
  } catch {
    return {
      exerciseId: exercise.id,
      name: exercise.name,
      searchQuery,
      matchedName: null,
      hasGif: !!registryItem?.localGifUrl,
      score: 0,
      status: "NEEDS_REVIEW",
    };
  }
}

async function main() {
  const rows: ReportRow[] = [];

  for (const exercise of collectExercises()) {
    rows.push(await checkExercise(exercise));
  }

  await writeFile("scripts/exercise-media-report.json", `${JSON.stringify(rows, null, 2)}\n`, "utf-8");
  console.table(rows);
}

void main();
