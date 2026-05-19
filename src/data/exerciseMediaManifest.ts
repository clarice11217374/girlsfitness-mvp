import manifest from "./exerciseMediaManifest.json";

export type ExerciseMediaType = "image" | "gif" | "video";

export type ExerciseMediaManifestEntry = {
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: ExerciseMediaType;
  searchQuery?: string;
  source?: string;
  matchedName?: string;
  /** When true, WorkoutExec may render imageUrl/videoUrl (UI-reviewed assets). */
  execDisplayApproved?: boolean;
};

export type ExerciseMediaManifest = Record<string, ExerciseMediaManifestEntry>;

const mediaManifest = manifest as ExerciseMediaManifest;

export function getExerciseMediaFromManifest(
  exerciseId: string,
): ExerciseMediaManifestEntry | undefined {
  return mediaManifest[exerciseId];
}

export function withManifestMedia<
  T extends { id: string; imageUrl?: string; videoUrl?: string; mediaType?: ExerciseMediaType },
>(exercise: T): T {
  const entry = getExerciseMediaFromManifest(exercise.id);
  if (!entry) return exercise;
  return {
    ...exercise,
    imageUrl: exercise.imageUrl ?? entry.imageUrl,
    videoUrl: exercise.videoUrl ?? entry.videoUrl,
    mediaType: exercise.mediaType ?? entry.mediaType,
  };
}
