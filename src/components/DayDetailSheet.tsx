"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getCycleRecord, setCyclePeriod } from "@/utils/cycleRecordStorage";
import { formatDateKeyLabel, isFutureDateKey, pad2 } from "@/utils/dayKey";
import { getTrainingRecords, type TrainingRecord } from "@/utils/trainingRecordStorage";

type Props = {
  open: boolean;
  dateKey: string | null;
  onClose: () => void;
  onCycleUpdated?: () => void;
};

function localDayParts(iso: string): { y: number; m: number; d: number } | null {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
}

function recordDateKey(record: TrainingRecord): string | null {
  const p = localDayParts(record.completedAt);
  if (!p) return null;
  return `${p.y}-${pad2(p.m)}-${pad2(p.d)}`;
}

function latestTrainingOnDay(dateKey: string): TrainingRecord | null {
  const matches = getTrainingRecords().filter((r) => recordDateKey(r) === dateKey);
  if (matches.length === 0) return null;
  return [...matches].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )[0];
}

export function DayDetailSheet({ open, dateKey, onClose, onCycleUpdated }: Props) {
  const [shellEl, setShellEl] = useState<HTMLElement | null>(null);
  const [isPeriod, setIsPeriod] = useState(false);

  useEffect(() => {
    setShellEl(document.querySelector<HTMLElement>(".shell"));
  }, []);

  useEffect(() => {
    if (!open || !dateKey) return;
    const entry = getCycleRecord(dateKey);
    setIsPeriod(entry?.isPeriod === true);
  }, [open, dateKey]);

  const training = useMemo(
    () => (open && dateKey ? latestTrainingOnDay(dateKey) : null),
    [open, dateKey],
  );

  if (!open || !dateKey || !shellEl) return null;

  const isFuture = isFutureDateKey(dateKey);
  const title = formatDateKeyLabel(dateKey);
  const trainingText = training
    ? `${training.workoutTitle} · ${training.durationMinutes}分钟`
    : "暂无训练记录";
  const cycleText = isPeriod ? "经期中" : "未标记";

  const togglePeriod = () => {
    if (isFuture) return;
    const next = !isPeriod;
    setCyclePeriod(dateKey, next);
    setIsPeriod(next);
    onCycleUpdated?.();
  };

  return createPortal(
    <>
      <button
        type="button"
        className="day-sheet-backdrop"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        className="day-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${title}详情`}
      >
        <div className="day-sheet-handle" aria-hidden />
        <div className="day-sheet-date">{title}</div>

        <div className="day-sheet-block">
          <div className="day-sheet-label">训练状态</div>
          <div className="day-sheet-value">{trainingText}</div>
        </div>

        <div className="day-sheet-block">
          <div className="day-sheet-label">周期状态</div>
          <div className={`day-sheet-value${isPeriod ? " day-sheet-value--period" : ""}`}>
            {cycleText}
          </div>
        </div>

        {isFuture ? (
          <p className="day-sheet-hint">未来日期暂不可标记</p>
        ) : null}

        <div className="day-sheet-actions">
          {!isFuture ? (
            <button
              type="button"
              className="day-sheet-btn day-sheet-btn--primary"
              onClick={togglePeriod}
            >
              {isPeriod ? "取消经期标记" : "标记为经期"}
            </button>
          ) : null}
          <button type="button" className="day-sheet-btn day-sheet-btn--ghost" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </>,
    shellEl,
  );
}
