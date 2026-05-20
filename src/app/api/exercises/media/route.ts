import type { ExerciseMedia } from "@/types/exerciseMedia";

type UnknownRecord = Record<string, unknown>;
type ExerciseMediaDebug = {
  searchQuery: string;
  preferredMatch?: string;
  matchedName?: string;
  score: number;
  candidateCount: number;
};
type ScoredExercise = {
  exercise: unknown;
  name?: string;
  score: number;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function firstStringInArray(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.find((item): item is string => typeof item === "string" && item.trim().length > 0)?.trim();
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return typeof value === "string" && value.trim() ? [value.trim()] : undefined;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items.map((item) => item.trim()) : undefined;
}

function instructionsArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return items.length > 0 ? items.map((item) => item.trim()) : undefined;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return undefined;
}

function normalize(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string | undefined): Set<string> {
  const normalized = normalize(value);
  return new Set(normalized ? normalized.split(/\s+/).filter(Boolean) : []);
}

function wordOverlapScore(a: string | undefined, b: string | undefined): number {
  const aWords = words(a);
  const bWords = words(b);
  if (aWords.size === 0 || bWords.size === 0) return 0;

  let overlap = 0;
  for (const word of aWords) {
    if (bWords.has(word)) overlap += 1;
  }

  const coverage = overlap / Math.max(aWords.size, bWords.size);
  return Math.round(coverage * 40);
}

function getExerciseName(exercise: unknown): string | undefined {
  if (!isRecord(exercise)) return undefined;
  return firstString(exercise.name, exercise.title, exercise.exerciseName, exercise.exercise_name);
}

function scoreExercise(exercise: unknown, query: string, preferredMatch?: string): ScoredExercise {
  const name = getExerciseName(exercise);
  const normalizedName = normalize(name);
  const normalizedQuery = normalize(query);
  const normalizedPreferred = normalize(preferredMatch);

  let score = 0;

  if (normalizedName && normalizedQuery && normalizedName === normalizedQuery) score += 120;
  if (normalizedName && normalizedPreferred && normalizedName === normalizedPreferred) score += 130;
  if (normalizedName && normalizedQuery && normalizedName.includes(normalizedQuery)) score += 80;
  if (normalizedName && normalizedQuery && normalizedQuery.includes(normalizedName)) score += 75;
  if (normalizedName && normalizedPreferred && normalizedName.includes(normalizedPreferred)) score += 90;
  if (normalizedName && normalizedPreferred && normalizedPreferred.includes(normalizedName)) score += 85;

  score += wordOverlapScore(name, query);
  if (preferredMatch) score += wordOverlapScore(name, preferredMatch);

  return { exercise, name, score };
}

function pickBestExercise(results: unknown[], query: string, preferredMatch?: string): ScoredExercise | null {
  const scored = results.map((exercise) => scoreExercise(exercise, query, preferredMatch));
  scored.sort((a, b) => b.score - a.score);
  return scored[0] ?? null;
}

function pickResults(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  const candidates = [payload.data, payload.results, payload.exercises, payload.items, payload.response];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = pickResults(candidate);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

function toMedia(exercise: unknown): ExerciseMedia | null {
  if (!isRecord(exercise)) return null;

  const imageUrl = firstString(
    exercise.imageUrl,
    exercise.image_url,
    exercise.image,
    exercise.thumbnail,
    exercise.thumbnailUrl,
    exercise.thumbnail_url,
    firstStringInArray(exercise.images),
    firstStringInArray(exercise.imageUrls),
  );
  const gifUrl = firstString(
    exercise.gifUrl,
    exercise.gif_url,
    exercise.gif,
    exercise.gifImage,
    exercise.gif_image,
    exercise.animationUrl,
    exercise.animation_url,
    firstStringInArray(exercise.gifs),
    firstStringInArray(exercise.gifUrls),
  );
  const videoUrl = firstString(
    exercise.videoUrl,
    exercise.video_url,
    exercise.video,
    exercise.videoLink,
    exercise.video_link,
    exercise.mp4Url,
    exercise.mp4_url,
    firstStringInArray(exercise.videos),
    firstStringInArray(exercise.videoUrls),
  );

  if (!imageUrl && !gifUrl && !videoUrl) return null;

  return {
    exerciseId: firstString(exercise.exerciseId, exercise.exercise_id, exercise.id, exercise.uuid),
    name: firstString(exercise.name, exercise.title, exercise.exerciseName, exercise.exercise_name),
    gifUrl: gifUrl ?? null,
    imageUrl: imageUrl ?? null,
    videoUrl: videoUrl ?? null,
    targetMuscles: stringArray(exercise.targetMuscles ?? exercise.target_muscles ?? exercise.targetMuscle),
    bodyParts: stringArray(exercise.bodyParts ?? exercise.body_parts ?? exercise.bodyPart),
    equipments: stringArray(exercise.equipments ?? exercise.equipment),
    secondaryMuscles: stringArray(exercise.secondaryMuscles ?? exercise.secondary_muscles ?? exercise.secondaryMuscle),
    instructions: instructionsArray(exercise.instructions ?? exercise.instruction),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();
  const preferredMatch = searchParams.get("preferred")?.trim() || undefined;

  if (!name) {
    return Response.json({ success: false, message: "Missing required query parameter: name" }, { status: 400 });
  }

  const baseUrl = process.env.EXERCISEDB_API_BASE || "https://oss.exercisedb.dev";
  const apiBase = baseUrl.replace(/\/+$/, "");

  try {
    const response = await fetch(`${apiBase}/api/v1/exercises/search?search=${encodeURIComponent(name)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: `ExerciseDB request failed with status ${response.status}`,
          debug: {
            searchQuery: name,
            preferredMatch,
            score: 0,
            candidateCount: 0,
          },
        },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const results = pickResults(payload);
    const best = pickBestExercise(results, name, preferredMatch);
    const media = best ? toMedia(best.exercise) : null;
    const debug: ExerciseMediaDebug = {
      searchQuery: name,
      preferredMatch,
      matchedName: best?.name,
      score: best?.score ?? 0,
      candidateCount: results.length,
    };

    return Response.json({ success: true, data: media, debug });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Unable to fetch exercise media at this time",
        debug: {
          searchQuery: name,
          preferredMatch,
          score: 0,
          candidateCount: 0,
        },
      },
      { status: 502 },
    );
  }
}
