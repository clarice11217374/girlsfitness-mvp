import type { ExerciseMedia } from "@/types/exerciseMedia";

type UnknownRecord = Record<string, unknown>;

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
    imageUrl,
    gifUrl,
    videoUrl,
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

  if (!name) {
    return Response.json({ success: false, message: "Missing required query parameter: name" }, { status: 400 });
  }

  const apiBase = process.env.EXERCISEDB_API_BASE?.replace(/\/+$/, "");

  if (!apiBase) {
    return Response.json({ success: false, message: "ExerciseDB API base URL is not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiBase}/api/v1/exercises/search?search=${encodeURIComponent(name)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { success: false, message: `ExerciseDB request failed with status ${response.status}` },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const results = pickResults(payload);
    const media = results.map(toMedia).find((item): item is ExerciseMedia => item !== null) ?? null;

    return Response.json({ success: true, data: media });
  } catch {
    return Response.json({ success: false, message: "Unable to fetch exercise media at this time" }, { status: 502 });
  }
}
