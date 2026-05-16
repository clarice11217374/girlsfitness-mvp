import { exerciseMediaRegistry } from "@/data/exerciseMediaRegistry";

type ExerciseMediaQuerySource = {
  id: string;
  name: string;
  mediaSearchQuery?: string;
  englishName?: string;
  slug?: string;
};

export function getExerciseMediaQuery(exercise: ExerciseMediaQuerySource): string {
  return (
    exerciseMediaRegistry[exercise.id]?.query?.trim() ||
    exercise.mediaSearchQuery?.trim() ||
    exercise.englishName?.trim() ||
    exercise.slug?.trim() ||
    exercise.name
  );
}
