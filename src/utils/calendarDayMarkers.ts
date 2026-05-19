import { isFutureDateKey } from "@/utils/dayKey";

/** Shared calendar dot / circle rules for Home and Record. */
export type DayMarkerState = {
  /** Blush circle (Record --done / Home dnum--trained). */
  trainedOnCircle: boolean;
  /** Plum dot below the day; only one dot when trained + period. */
  showPeriodDot: boolean;
  /** Blue training dot; hidden when period is also marked. */
  showTrainingDot: boolean;
};

function visibleDayStatus(
  dateKey: string,
  hasTraining: boolean,
  hasPeriod: boolean,
): { hasTraining: boolean; hasPeriod: boolean } {
  if (isFutureDateKey(dateKey)) {
    return { hasTraining: false, hasPeriod: false };
  }
  return { hasTraining, hasPeriod };
}

export function dayMarkerState(
  dateKey: string,
  hasTraining: boolean,
  hasPeriod: boolean,
): DayMarkerState {
  const status = visibleDayStatus(dateKey, hasTraining, hasPeriod);
  return {
    trainedOnCircle: status.hasTraining,
    showPeriodDot: status.hasPeriod,
    showTrainingDot: status.hasTraining && !status.hasPeriod,
  };
}
