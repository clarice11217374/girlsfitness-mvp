import { exerciseMediaRegistry, type ExerciseMediaRegistryItem } from "@/data/exerciseMediaRegistry";

export type ExerciseMediaQueryable = {
  id: string;
  name: string;
  mediaSearchQuery?: string;
  englishName?: string;
  slug?: string;
};

export function getExerciseMediaRegistryItem(exercise: Pick<ExerciseMediaQueryable, "id">): ExerciseMediaRegistryItem | undefined {
  return exerciseMediaRegistry[exercise.id];
}

export function getExerciseMediaQuery(exercise: ExerciseMediaQueryable): string {
  return (
    exerciseMediaRegistry[exercise.id]?.query.trim() ||
    exercise.mediaSearchQuery?.trim() ||
    exercise.englishName?.trim() ||
    exercise.slug?.trim() ||
    exercise.name
  );
}
