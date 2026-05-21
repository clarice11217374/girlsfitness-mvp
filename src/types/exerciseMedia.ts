export type ExerciseMedia = {
  exerciseId?: string;
  gifUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  name?: string;
  targetMuscles?: string[];
  bodyParts?: string[];
  equipments?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
};
