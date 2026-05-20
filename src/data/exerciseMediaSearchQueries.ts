import exerciseMediaSearchQueriesJson from "./exerciseMediaSearchQueries.json";

/** English search terms for ExerciseDB media lookup. */
export const exerciseMediaSearchQueries: Record<string, string> =
  exerciseMediaSearchQueriesJson;

export function getExerciseMediaSearchQuery(
  _id: string,
  fallbackName: string,
  mediaSearchQuery?: string,
  englishName?: string,
  slug?: string,
): string {
  return (
    mediaSearchQuery?.trim() ||
    englishName?.trim() ||
    slug?.trim() ||
    fallbackName
  );
}
