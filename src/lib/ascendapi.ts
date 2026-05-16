import type { ExerciseMedia } from "@/types/exerciseMedia";

const ASCENDAPI_BASE_URL =
  "https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function firstStringInArray(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.find((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function pickImageUrl(exercise: UnknownRecord): string | undefined {
  return firstString(
    exercise.imageUrl,
    exercise.image_url,
    exercise.image,
    exercise.gifUrl,
    exercise.gif_url,
    exercise.thumbnail,
    exercise.thumbnailUrl,
    firstStringInArray(exercise.images),
    firstStringInArray(exercise.imageUrls),
  );
}

function pickGifUrl(exercise: UnknownRecord): string | undefined {
  return firstString(
    exercise.gifUrl,
    exercise.gif_url,
    exercise.gif,
    exercise.animatedGif,
    exercise.animated_gif,
    firstStringInArray(exercise.gifs),
    firstStringInArray(exercise.gifUrls),
  );
}

function pickVideoUrl(exercise: UnknownRecord): string | undefined {
  return firstString(
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
}

function pickResults(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.data,
    payload.results,
    payload.exercises,
    payload.items,
    payload.response,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = pickResults(candidate);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return strings.length > 0 ? strings : undefined;
}

function toExerciseMedia(value: unknown): ExerciseMedia | null {
  if (!isRecord(value)) return null;

  const imageUrl = pickImageUrl(value);
  const gifUrl = pickGifUrl(value);
  const videoUrl = pickVideoUrl(value);
  if (!imageUrl && !gifUrl && !videoUrl) return null;

  return {
    exerciseId: firstString(value.id, value.exerciseId, value.exercise_id, value.uuid),
    name: firstString(value.name, value.title, value.exerciseName, value.exercise_name),
    imageUrl,
    gifUrl,
    videoUrl,
    targetMuscles: normalizeStringArray(value.targetMuscles ?? value.target_muscles ?? value.target),
    bodyParts: normalizeStringArray(value.bodyParts ?? value.body_parts ?? value.bodyPart),
    equipments: normalizeStringArray(value.equipments ?? value.equipment),
  };
}

export async function getExerciseMediaByName(name: string): Promise<ExerciseMedia | null> {
  const search = name.trim();
  if (!search) return null;

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.ASCENDAPI_HOST ?? process.env.RAPIDAPI_HOST;
  if (!apiKey || !apiHost) return null;

  try {
    const url = `${ASCENDAPI_BASE_URL}?search=${encodeURIComponent(search)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "content-type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload: unknown = await response.json();
    const results = pickResults(payload);
    for (const result of results) {
      const media = toExerciseMedia(result);
      if (media) return media;
    }

    return null;
  } catch {
    return null;
  }
}
