import { exerciseMediaSearchQueries } from "@/data/exerciseMediaSearchQueries";

export type ExerciseMediaRegistryEntry = {
  query: string;
  preferredMatch?: string;
};

export const exerciseMediaRegistry: Record<string, ExerciseMediaRegistryEntry> = Object.fromEntries(
  Object.entries(exerciseMediaSearchQueries).map(([exerciseId, query]) => [
    exerciseId,
    { query },
  ]),
);
