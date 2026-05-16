import exerciseMediaSearchQueriesJson from "./exerciseMediaSearchQueries.json";

/** English search terms for media lookup (AscendAPI / female gif sources). */
export const exerciseMediaSearchQueries: Record<string, string> =
  exerciseMediaSearchQueriesJson;

export function getExerciseMediaSearchQuery(
  id: string,
  fallbackName: string,
  mediaSearchQuery?: string,
  englishName?: string,
  slug?: string,
): string {
  return (
    mediaSearchQuery?.trim() ||
    englishName?.trim() ||
    slug?.trim() ||
    exerciseMediaSearchQueries[id] ||
    fallbackName
  );
}
