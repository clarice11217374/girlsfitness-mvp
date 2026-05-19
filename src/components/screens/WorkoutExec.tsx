"use client";

import { useEffect, useRef, useState } from "react";
import { StatusBar } from "@/components/StatusBar";
import {
  getOrderedExercises as getStaticOrderedExercises,
  getPhasePlanForExec as getStaticPhasePlanForExec,
  type ActionGuide,
  type EquipmentGuide,
  workoutTemplateMeta,
} from "@/data/workoutData";
import {
  getOrderedExercises as getTemplateOrderedExercises,
  getPhasePlanForExec as getTemplatePhasePlanRaw,
  getWorkoutTemplateById,
  type WorkoutExercise as TemplateWorkoutExercise,
} from "@/data/workoutTemplates";
import type { ExerciseMediaType } from "@/data/exerciseMediaManifest";
import { loadCurrentWorkoutSelection } from "@/utils/currentWorkoutSelectionStorage";
import {
  getExercisePerformance,
  upsertExercisePerformance,
  type ExercisePerformanceEntryV1,
} from "@/utils/exercisePerformanceStorage";
import { writeWorkoutExecSummary } from "@/utils/workoutExecSummaryStorage";

type Props = { onDone: () => void; templateId?: string | null; onBack?: () => void };

type ExecExercise = {
  id: string;
  name: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: ExerciseMediaType;
  sets: number;
  reps: string;
  visualPlaceholder: string;
  equipment: string;
  equipmentGuide: EquipmentGuide;
  actionGuide: ActionGuide;
  commonMistakesDisplay: string;
  alternative: string;
};

type PhasePlanRow = { label: string; exerciseIndexes: number[] };

const restOptions = [
  { label: "45s", seconds: 45 },
  { label: "60s", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "120s", seconds: 120 },
];

const chineseNums = ["一", "二", "三", "四", "五", "六"];

function toExecFromTemplate(ex: TemplateWorkoutExercise): ExecExercise {
  return {
    id: ex.id,
    name: ex.name,
    imageUrl: ex.imageUrl,
    videoUrl: ex.videoUrl,
    mediaType: ex.mediaType,
    sets: ex.sets,
    reps: ex.reps,
    visualPlaceholder: ex.visualPlaceholder,
    equipment: ex.equipment,
    equipmentGuide: ex.equipmentGuide,
    actionGuide: ex.actionGuide,
    commonMistakesDisplay: ex.commonMistakes.join("、"),
    alternative: ex.alternative,
  };
}

function toExecFromStatic(ex: {
  id: string;
  name: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: ExerciseMediaType;
  sets: number;
  reps: string;
  visualPlaceholder: string;
  equipment: string;
  equipmentGuide: EquipmentGuide;
  actionGuide: ActionGuide;
  commonMistakes: string;
  alternative: string;
}): ExecExercise {
  return {
    id: ex.id,
    name: ex.name,
    imageUrl: ex.imageUrl,
    videoUrl: ex.videoUrl,
    mediaType: ex.mediaType,
    sets: ex.sets,
    reps: ex.reps,
    visualPlaceholder: ex.visualPlaceholder,
    equipment: ex.equipment,
    equipmentGuide: ex.equipmentGuide,
    actionGuide: ex.actionGuide,
    commonMistakesDisplay: ex.commonMistakes,
    alternative: ex.alternative,
  };
}

function buildStaticPhasePlan(): PhasePlanRow[] {
  return getStaticPhasePlanForExec();
}

function buildTemplatePhasePlanForExec(templateId: string): PhasePlanRow[] {
  const raw = getTemplatePhasePlanRaw(templateId);
  let cursor = 0;
  return raw.map((p) => {
    const exerciseIndexes = p.exercises.map((_, i) => cursor + i);
    cursor += p.exercises.length;
    return { label: p.title, exerciseIndexes };
  });
}

function initialStaticPayload(): { exercises: ExecExercise[]; phasePlan: PhasePlanRow[] } {
  const raw = getStaticOrderedExercises();
  return {
    exercises: raw.map(toExecFromStatic),
    phasePlan: buildStaticPhasePlan(),
  };
}

type WorkoutExecMeta = {
  title: string;
  templateId: string;
  targetArea: string;
  estimatedMinutes: number;
};

function resolveDurationMinutes(estimatedMinutes: number, sessionStartedAt: number | null): number {
  if (sessionStartedAt === null) return estimatedMinutes;
  const elapsedMs = Date.now() - sessionStartedAt;
  if (elapsedMs < 60_000) return estimatedMinutes;
  return Math.max(1, Math.round(elapsedMs / 60_000));
}

function writeSummaryForExercises(
  exercises: ExecExercise[],
  meta: WorkoutExecMeta,
  sessionStartedAt: number | null,
): void {
  if (exercises.length === 0) return;

  writeWorkoutExecSummary({
    workoutTitle: meta.title,
    templateId: meta.templateId,
    targetArea: meta.targetArea,
    totalExercises: exercises.length,
    totalSets: exercises.reduce((acc, e) => acc + e.sets, 0),
    durationMinutes: resolveDurationMinutes(meta.estimatedMinutes, sessionStartedAt),
    completedAt: new Date().toISOString(),
  });
}

function parseNumber(text: string, fallback: number): number {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function formatLastPerformanceHint(
  entry: ExercisePerformanceEntryV1,
  showWeight: boolean,
  showReps: boolean,
): string | null {
  const w = entry.weightKg;
  const r = entry.reps;
  if (showWeight && showReps && w !== undefined && r !== undefined) {
    return `上次记录：${w}kg × ${r}次`;
  }
  if (showWeight && w !== undefined) return `上次记录：${w}kg`;
  if (showReps && r !== undefined) return `上次记录：${r}次`;
  return null;
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** UI-only: premium exec layout; keep selector prefix `.exec-premium`. */
const EXEC_PREMIUM_CSS = `
.exec-premium.exec-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  margin: 0 auto;
  padding-bottom: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.exec-premium .exec-top {
  flex-shrink: 0;
}
.exec-premium .exec-body {
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
  max-height: none;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 20px calc(220px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}
.exec-premium .exec-main { padding: 18px 12px 14px; border-radius: 26px; }
.exec-premium .ex-name {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 8px;
}
.exec-premium .exec-last-record {
  font-size: 11px;
  font-weight: 500;
  color: rgba(74, 63, 92, 0.55);
  text-align: center;
  margin: 4px 0 14px;
  line-height: 1.4;
}

.exec-premium .move-info-card {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif;
  margin-bottom: 14px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 20px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 8px 28px rgba(15, 23, 42, 0.06);
}
.exec-premium .move-info-card-inner {
  padding: 20px 20px 16px;
}
.exec-premium .move-info-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5b5568;
  margin-bottom: 14px;
}
.exec-premium .move-info-tips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.exec-premium .move-info-tips li {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(42, 31, 56, 0.78);
  padding-left: 15px;
  position: relative;
}
.exec-premium .move-info-tips li::before {
  content: "";
  position: absolute;
  left: 0;
  top: calc(0.775em - 2.5px);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(75, 50, 107, 0.35);
}
.exec-premium .move-info-tips li.move-info-tip-breath {
  font-size: 13px;
  line-height: 1.55;
  color: rgba(91, 85, 104, 0.88);
  padding-top: 0;
}
.exec-premium .move-info-tips li.move-info-tip-breath::before {
  top: calc(0.775em - 2.5px);
  background: rgba(91, 85, 104, 0.25);
}
.exec-premium .move-info-divider {
  height: 1px;
  margin: 20px 0 4px;
  background: rgba(15, 23, 42, 0.05);
}
.exec-premium .move-info-equip-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 12px 4px;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  border-radius: 12px;
  transition: background 0.18s ease;
}
.exec-premium .move-info-equip-row:hover {
  background: rgba(15, 23, 42, 0.03);
}
.exec-premium .move-info-equip-row:active {
  background: rgba(75, 50, 107, 0.06);
}
.exec-premium .move-info-equip-row:focus-visible {
  outline: 2px solid rgba(75, 50, 107, 0.35);
  outline-offset: 2px;
}
.exec-premium .move-info-equip-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(111, 76, 255, 0.08);
  color: #4b326b;
}
.exec-premium .move-info-equip-icon-svg {
  width: 22px;
  height: 22px;
}
.exec-premium .move-info-equip-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.exec-premium .move-info-equip-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #2a1f38;
  line-height: 1.35;
}
.exec-premium .move-info-equip-sub {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.35;
  color: rgba(91, 85, 104, 0.72);
}
.exec-premium .move-info-equip-chevron {
  flex-shrink: 0;
  margin-left: auto;
  font-size: 18px;
  font-weight: 500;
  color: rgba(91, 85, 104, 0.38);
  line-height: 1;
  transition: transform 0.32s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.2s ease;
}
.exec-premium .move-info-equip-row[aria-expanded="true"] .move-info-equip-chevron {
  transform: rotate(90deg);
  color: rgba(75, 50, 107, 0.45);
}
.exec-premium .move-info-equip-detail {
  display: block;
  overflow: hidden;
  max-height: none;
  opacity: 1;
  margin: 0;
  padding: 0;
  border: 0;
  pointer-events: auto;
}
.exec-premium .move-info-equip-detail-inner {
  margin-top: 10px;
  padding: 10px 0 18px;
  border-top: 1px solid rgba(15, 23, 42, 0.07);
}
.exec-premium .move-info-equip-detail .equip-setup {
  padding: 0;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(42, 31, 56, 0.72);
}
.exec-premium .move-info-equip-detail .equip-row {
  margin-bottom: 12px;
}
.exec-premium .move-info-equip-detail .equip-row:last-child {
  margin-bottom: 0;
}
.exec-premium .move-info-equip-detail strong {
  font-weight: 600;
  color: rgba(42, 31, 56, 0.88);
}

.exec-premium .exec-reminder-card {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 20px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset, 0 8px 28px rgba(15, 23, 42, 0.06);
  padding: 20px 20px 18px;
}
.exec-premium .exec-reminder-card .guide-title {
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5b5568;
  margin-bottom: 14px;
}
.exec-premium .exec-reminder-card .guide-item {
  margin-bottom: 12px;
}
.exec-premium .exec-reminder-card .guide-item:last-child {
  margin-bottom: 0;
}
.exec-premium .exec-reminder-card .guide-text {
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(42, 31, 56, 0.78);
}
.exec-premium .exec-reminder-card .guide-text strong {
  font-weight: 600;
  color: rgba(42, 31, 56, 0.9);
}

.exec-premium .exec-floating-dock {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: calc(18px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  max-width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.1), 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 18px 20px 20px;
}

.exec-premium .exec-metrics {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: stretch;
  margin-bottom: 16px;
}
.exec-premium .metric-box {
  flex: 1;
  min-width: 0;
  background: rgba(246, 247, 249, 0.98);
  border: 1px solid rgba(15, 23, 42, 0.05);
  border-radius: 16px;
  padding: 12px 8px 14px;
  text-align: center;
}
.exec-premium .metric-label {
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5b5568;
  margin-bottom: 8px;
}
.exec-premium .metric-value {
  font-family: inherit;
  font-size: 22px;
  font-weight: 700;
  color: #2a1f38;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.exec-premium .metric-controls {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.exec-premium .metric-controls span {
  font-family: inherit;
  font-size: 20px;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
  color: #2a1f38;
  letter-spacing: -0.02em;
}
.exec-premium .metric-controls button {
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  font-family: inherit;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  color: rgba(42, 31, 56, 0.55);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.15s ease, transform 0.12s ease, border-color 0.15s ease, color 0.15s ease;
}
.exec-premium .metric-controls button:hover {
  background: rgba(75, 50, 107, 0.08);
  border-color: rgba(75, 50, 107, 0.18);
  color: #4b326b;
}
.exec-premium .metric-controls button:active { transform: scale(0.94); }

.exec-premium .exec-rest-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
}
.exec-premium .rest-timer-card {
  flex: 0 0 auto;
  min-width: 118px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(248, 250, 252, 0.95);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.exec-premium .rest-timer-card:hover {
  border-color: rgba(124, 58, 237, 0.22);
  box-shadow: 0 4px 14px rgba(91, 33, 182, 0.08);
}
.exec-premium .rest-timer-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(111, 76, 255, 0.14);
  border: 1px solid rgba(111, 76, 255, 0.22);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}
.exec-premium .rest-timer-icon-wrap::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4b326b;
  box-shadow: 0 1px 3px rgba(42, 31, 56, 0.18);
  z-index: 0;
}
.exec-premium .rest-timer-icon-wrap::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 15px;
  height: 15px;
  pointer-events: none;
  background: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%229%22 stroke=%22%23ffffff%22 stroke-width=%221.65%22/%3E%3Cpath d=%22M12 8v4.25l2.75 1.65%22 stroke=%22%23ffffff%22 stroke-width=%221.65%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E")
    center / contain no-repeat;
}
.exec-premium .rest-timer-icon {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.exec-premium .rest-timer-text { text-align: left; min-width: 0; }
.exec-premium .rest-display-label {
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #5b5568;
  margin-bottom: 2px;
}
.exec-premium .rest-display-time {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #2a1f38;
  line-height: 1.1;
}

.exec-premium .next-set-btn {
  flex: 1;
  min-height: 54px;
  border-radius: 999px;
  border: none;
  background: #4b326b;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(75, 50, 107, 0.28);
  transition: transform 0.14s ease, box-shadow 0.14s ease, background 0.14s ease;
}
.exec-premium .next-set-btn:hover {
  background: #3d2958;
  box-shadow: 0 10px 26px rgba(75, 50, 107, 0.32);
}
.exec-premium .next-set-btn:active {
  transform: scale(0.98);
  background: #35244d;
  box-shadow: 0 6px 18px rgba(75, 50, 107, 0.22);
}

.exec-premium .exec-stop-wrap { margin-top: 12px; text-align: center; }
.exec-premium .exec-stop-btn {
  background: transparent;
  border: none;
  color: rgba(26, 26, 26, 0.45);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 999px;
  transition: color 0.15s ease, background 0.15s ease;
}
.exec-premium .exec-stop-btn:hover {
  color: #4b326b;
  background: rgba(75, 50, 107, 0.08);
}

.exec-premium .exec-rest-sheet-backdrop {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(2px);
}
.exec-premium .exec-rest-sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 51;
  max-width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", system-ui, sans-serif;
  padding: 10px 20px calc(22px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 255, 255, 0.97);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -8px 40px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-bottom: none;
}
.exec-premium .exec-rest-sheet-handle {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
  margin: 4px auto 14px;
}
.exec-premium .exec-rest-sheet-title {
  text-align: center;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5b5568;
  margin-bottom: 14px;
}
.exec-premium .exec-rest-sheet-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.exec-premium .rest-opt-pill {
  font-family: inherit;
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.55);
  color: rgba(42, 31, 56, 0.55);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
}
.exec-premium .rest-opt-pill:hover {
  border-color: rgba(75, 50, 107, 0.28);
  color: #4b326b;
  background: rgba(75, 50, 107, 0.08);
}
.exec-premium .rest-opt-pill:active { transform: scale(0.97); }
.exec-premium .rest-opt-pill:focus-visible {
  outline: none;
  border-color: rgba(75, 50, 107, 0.45);
  background: rgba(75, 50, 107, 0.12);
  color: #3d2958;
}
`;

function isBodyweightName(name: string): boolean {
  return ["登山者", "平板", "卷腹", "俯卧撑", "支撑", "桥", "自重"].some((keyword) =>
    name.includes(keyword),
  );
}

function isNoLoadEquipment(equipment: string): boolean {
  return (
    equipment.includes("无需器械") ||
    equipment.includes("无器械") ||
    equipment.includes("瑜伽垫") ||
    equipment.includes("墙面") ||
    equipment.includes("门框") ||
    equipment.includes("跑步机") ||
    equipment.includes("椭圆机")
  );
}

export function WorkoutExec({ onDone, templateId = null, onBack }: Props) {
  const initial = initialStaticPayload();
  const [exercises, setExercises] = useState<ExecExercise[]>(initial.exercises);
  const [phasePlan, setPhasePlan] = useState<PhasePlanRow[]>(initial.phasePlan);

  const [exIdx, setExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  const [weight, setWeight] = useState(5);
  const [reps, setReps] = useState(12);
  const [lastPerformanceLabel, setLastPerformanceLabel] = useState<string | null>(null);

  const [restSec, setRestSec] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [restPickerOpen, setRestPickerOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [mediaAssetFailed, setMediaAssetFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartedAtRef = useRef<number | null>(null);
  const workoutMetaRef = useRef<WorkoutExecMeta | null>(null);

  useEffect(() => {
    const staticPayload = initialStaticPayload();
    const propId = typeof templateId === "string" && templateId.length > 0 ? templateId : null;
    const selectionId = loadCurrentWorkoutSelection()?.matchedTemplateId ?? null;
    const resolvedId = propId ?? selectionId;

    sessionStartedAtRef.current = Date.now();

    if (resolvedId) {
      const raw = getTemplateOrderedExercises(resolvedId);
      const phases = buildTemplatePhasePlanForExec(resolvedId);
      const mapped = raw.map(toExecFromTemplate);
      const template = getWorkoutTemplateById(resolvedId);

      setExercises(mapped);
      setPhasePlan(phases);
      workoutMetaRef.current = {
        title: template.meta.title,
        templateId: template.meta.id,
        targetArea: template.meta.targetArea,
        estimatedMinutes: template.meta.estimatedMinutes,
      };
    } else {
      setExercises(staticPayload.exercises);
      setPhasePlan(staticPayload.phasePlan);
      workoutMetaRef.current = {
        title: workoutTemplateMeta.title,
        templateId: "upper-push-strength-day",
        targetArea: "upper_push",
        estimatedMinutes: workoutTemplateMeta.estimatedMinutes,
      };
    }

    setExIdx(0);
    setCurrentSet(0);
    setCompletedSets([]);
    setWeight(5);
    setReps(12);
    setTicking(false);
    setRestSec(0);
    setRestPickerOpen(false);
    setEquipmentOpen(false);
  }, [templateId]);

  const currentExercise = exercises[exIdx];

  useEffect(() => {
    setMediaAssetFailed(false);
  }, [exIdx, currentExercise?.id]);

  const showVideo = !!currentExercise?.videoUrl && !mediaAssetFailed;
  const showImage = !showVideo && !!currentExercise?.imageUrl && !mediaAssetFailed;

  const phaseIdx = Math.max(
    0,
    phasePlan.findIndex((phase) => phase.exerciseIndexes.includes(exIdx)),
  );

  const currentPhaseLabel = phasePlan[phaseIdx]?.label ?? "";
  const isStrengthPhase = currentPhaseLabel === "力量";

  const shouldUseWeight =
    !!currentExercise &&
    isStrengthPhase &&
    !isBodyweightName(currentExercise.name) &&
    !isNoLoadEquipment(currentExercise.equipment);

  const shouldUseRepsControl = isStrengthPhase;

  useEffect(() => {
    if (!currentExercise) return;

    setCurrentSet(0);
    setCompletedSets([]);
    setRestSec(0);
    setTicking(false);
    setRestPickerOpen(false);
    setEquipmentOpen(false);

    const phaseIndex = Math.max(
      0,
      phasePlan.findIndex((phase) => phase.exerciseIndexes.includes(exIdx)),
    );
    const phaseLabel = phasePlan[phaseIndex]?.label ?? "";
    const isStrength = phaseLabel === "力量";
    const useWeight =
      isStrength &&
      !isBodyweightName(currentExercise.name) &&
      !isNoLoadEquipment(currentExercise.equipment);
    const useReps = isStrength;
    const templateId = workoutMetaRef.current?.templateId;

    if (!isStrength || !templateId) {
      setLastPerformanceLabel(null);
      setReps(parseNumber(currentExercise.reps, 12));
      setWeight(5);
      return;
    }

    const history = getExercisePerformance(templateId, currentExercise.id);
    const defaultReps = parseNumber(currentExercise.reps, 12);
    setReps(history?.reps ?? defaultReps);
    setWeight(history?.weightKg ?? 5);
    setLastPerformanceLabel(
      history ? formatLastPerformanceHint(history, useWeight, useReps) : null,
    );
  }, [currentExercise?.id, exIdx, phasePlan]);

  useEffect(() => {
    if (!ticking) return;

    timerRef.current = setTimeout(() => {
      if (restSec <= 1) {
        setTicking(false);
        setRestSec(0);
      } else {
        setRestSec((s) => Math.max(0, s - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ticking, restSec]);

  function startRest(seconds: number) {
    setRestSec(seconds);
    setTicking(true);
    setRestPickerOpen(false);
  }

  function stopRest() {
    setTicking(false);
    setRestSec(0);
  }

  function persistExerciseMetrics(nextWeight: number, nextReps: number) {
    const templateId = workoutMetaRef.current?.templateId;
    if (!templateId || !currentExercise || !isStrengthPhase) return;

    const partial: Partial<Pick<ExercisePerformanceEntryV1, "weightKg" | "reps">> = {};
    if (shouldUseRepsControl) partial.reps = nextReps;
    if (shouldUseWeight) partial.weightKg = nextWeight;
    if (partial.reps === undefined && partial.weightKg === undefined) return;

    upsertExercisePerformance(templateId, currentExercise.id, partial);
  }

  function adjustWeight(delta: number) {
    const nextWeight = Math.max(0, weight + delta);
    setWeight(nextWeight);
    if (shouldUseWeight || shouldUseRepsControl) {
      persistExerciseMetrics(nextWeight, reps);
    }
  }

  function adjustReps(delta: number) {
    const nextReps = Math.max(1, reps + delta);
    setReps(nextReps);
    if (shouldUseWeight || shouldUseRepsControl) {
      persistExerciseMetrics(weight, nextReps);
    }
  }

  function completeCurrentSet() {
    if (!currentExercise) return;

    setCompletedSets((prev) => {
      if (prev.includes(currentSet)) return prev;
      return [...prev, currentSet];
    });

    if (currentSet < currentExercise.sets - 1) {
      setCurrentSet((prev) => prev + 1);
    }
  }

  function goNextExerciseOrFinish() {
    if (!currentExercise) return;
    if (completedSets.length < currentExercise.sets) return;

    if (exIdx < exercises.length - 1) {
      setExIdx((i) => i + 1);
    } else {
      const meta = workoutMetaRef.current;
      if (meta) {
        writeSummaryForExercises(exercises, meta, sessionStartedAtRef.current);
      }
      onDone();
    }
  }

  const getPhaseFill = (index: number) => {
    if (index < phaseIdx) return 100;
    if (index > phaseIdx) return 0;

    const current = phasePlan[index];
    const total = current.exerciseIndexes.length;
    if (total === 0) return 0;

    const localProgress = current.exerciseIndexes.indexOf(exIdx) + 1;
    return Math.round((localProgress / total) * 100);
  };

  if (exercises.length === 0 || !currentExercise) {
    return (
      <div className="page exec-page" style={{ padding: 24 }}>
        <StatusBar style={{ padding: "0 0 10px" }} />
        <p style={{ marginBottom: 16, color: "var(--gray)", lineHeight: 1.5 }}>
          当前训练计划没有可执行动作，请返回预览页重新选择训练。
        </p>
        <button className="cta" type="button" onClick={() => onBack?.()}>
          返回
        </button>
      </div>
    );
  }

  const isExerciseComplete = completedSets.length >= currentExercise.sets;
  const currentSetLabel = chineseNums[currentSet] ?? String(currentSet + 1);

  const mainButtonText = isExerciseComplete
    ? exIdx < exercises.length - 1
      ? "下一个动作"
      : "完成训练"
    : `完成第${currentSetLabel}组`;

  return (
    <div className="page exec-page exec-premium">
      <style dangerouslySetInnerHTML={{ __html: EXEC_PREMIUM_CSS }} />

      <div className="exec-top">
        <StatusBar style={{ padding: "0 0 10px" }} />
        <button className="exec-back" type="button" aria-label="返回" onClick={() => onBack?.()}>
          ←
        </button>

        <div className="phase-track">
          {phasePlan.map((phase, i) => (
            <div
              key={phase.label}
              className={`phase-mini ${i < phaseIdx ? "done" : i === phaseIdx ? "active" : "todo"}`}
            >
              <span className="phase-mini-lbl">{phase.label}</span>
              <span className="phase-mini-bar">
                <span className="phase-mini-fill" style={{ width: `${getPhaseFill(i)}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="exec-body">
        <div className="exec-main">
          <div className="ex-name">{currentExercise.name}</div>
          {lastPerformanceLabel ? (
            <div className="exec-last-record">{lastPerformanceLabel}</div>
          ) : null}

          <div
            className={`ex-anim ${showVideo || showImage ? "has-media" : ""}`}
          >
            {showVideo && (
              <video
                className="exercise-media"
                src={currentExercise.videoUrl}
                poster={currentExercise.imageUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onError={() => setMediaAssetFailed(true)}
              />
            )}
            {showImage && (
              <img
                className="exercise-media"
                src={currentExercise.imageUrl}
                alt={currentExercise.name}
                loading="lazy"
                onError={() => setMediaAssetFailed(true)}
              />
            )}
            {!showVideo && !showImage && (
              <span className="exercise-placeholder-text">{currentExercise.visualPlaceholder}</span>
            )}
          </div>

          <div className="move-info-card">
            <div className="move-info-card-inner">
              <section className="move-info-guide" aria-labelledby="move-info-guide-title">
                <div id="move-info-guide-title" className="move-info-section-title">
                  动作要点
                </div>
                <ul className="move-info-tips">
                  <li>{currentExercise.actionGuide.step1}</li>
                  <li>{currentExercise.actionGuide.step2}</li>
                  <li>{currentExercise.actionGuide.step3}</li>
                  <li className="move-info-tip-breath">呼吸：{currentExercise.actionGuide.breathing}</li>
                </ul>
              </section>

              <div className="move-info-divider" role="presentation" />

              <button
                type="button"
                className="move-info-equip-row"
                aria-expanded={equipmentOpen}
                onClick={() => setEquipmentOpen((v) => !v)}
              >
                <div className="move-info-equip-icon" aria-hidden>
                  <svg
                    className="move-info-equip-icon-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h2.5M16.5 12H19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <rect
                      x="7.5"
                      y="9"
                      width="9"
                      height="6"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="move-info-equip-text">
                  <div className="move-info-equip-title">器械介绍</div>
                  <div className="move-info-equip-sub">查看座椅、握法和重量设置</div>
                </div>
                <span className="move-info-equip-chevron" aria-hidden>
                  ›
                </span>
              </button>

              {equipmentOpen && (
                <div className="move-info-equip-detail is-open">
                  <div className="move-info-equip-detail-inner">
                    <div className="equip-setup">
                      <div className="equip-row">
                        <strong>认识器械：</strong>
                        {currentExercise.equipmentGuide.machineIntro}
                      </div>
                      <div className="equip-row">
                        <strong>调座椅 / 站位：</strong>
                        {currentExercise.equipmentGuide.seatSetup}
                      </div>
                      <div className="equip-row">
                        <strong>姿态：</strong>
                        {currentExercise.equipmentGuide.postureSetup}
                      </div>
                      <div className="equip-row">
                        <strong>握法：</strong>
                        {currentExercise.equipmentGuide.gripSetup}
                      </div>
                      <div className="equip-row">
                        <strong>重量：</strong>
                        {currentExercise.equipmentGuide.weightTip}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="guide-card exec-reminder-card">
            <div className="guide-title">训练提醒</div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>常见错误：</strong>
                {currentExercise.commonMistakesDisplay}
              </div>
            </div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>替代：</strong>
                {currentExercise.alternative}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-floating-dock">
        {(shouldUseWeight || shouldUseRepsControl) && (
          <div className="exec-metrics">
            {shouldUseWeight && (
              <div className="metric-box">
                <div className="metric-label">重量 kg</div>
                <div className="metric-controls">
                  <button type="button" onClick={() => adjustWeight(-1)}>
                    −
                  </button>
                  <span>{weight}</span>
                  <button type="button" onClick={() => adjustWeight(1)}>
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="metric-box">
              <div className="metric-label">当前组</div>
              <div className="metric-value">
                {Math.min(currentSet + 1, currentExercise.sets)}/{currentExercise.sets}
              </div>
            </div>

            {shouldUseRepsControl && (
              <div className="metric-box">
                <div className="metric-label">次数</div>
                <div className="metric-controls">
                  <button type="button" onClick={() => adjustReps(-1)}>
                    −
                  </button>
                  <span>{reps}</span>
                  <button type="button" onClick={() => adjustReps(1)}>
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!shouldUseWeight && !shouldUseRepsControl && (
          <div className="exec-metrics">
            <div className="metric-box">
              <div className="metric-label">当前组</div>
              <div className="metric-value">
                {Math.min(currentSet + 1, currentExercise.sets)}/{currentExercise.sets}
              </div>
            </div>
          </div>
        )}

        <div className="exec-rest-row">
          <div className="rest-timer-card" onClick={() => !ticking && setRestPickerOpen((v) => !v)}>
            <div className="rest-timer-icon-wrap" aria-hidden>
              <span className="rest-timer-icon">铃</span>
            </div>
            <div className="rest-timer-text">
              <div className="rest-display-label">{ticking ? "休息中" : "休息闹钟"}</div>
              <div className="rest-display-time">{fmt(restSec)}</div>
            </div>
          </div>

          <button
            className="next-set-btn"
            type="button"
            onClick={isExerciseComplete ? goNextExerciseOrFinish : completeCurrentSet}
          >
            {mainButtonText}
          </button>
        </div>

        {ticking && (
          <div className="exec-stop-wrap">
            <button type="button" className="exec-stop-btn" onClick={stopRest}>
              停止休息
            </button>
          </div>
        )}
      </div>

      {restPickerOpen && !ticking && (
        <>
          <div
            className="exec-rest-sheet-backdrop"
            aria-hidden
            onClick={() => setRestPickerOpen(false)}
          />
          <div className="exec-rest-sheet" role="dialog" aria-modal="true" aria-label="休息时长">
            <div className="exec-rest-sheet-handle" />
            <div className="exec-rest-sheet-title">休息时长</div>
            <div className="exec-rest-sheet-pills">
              {restOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="rest-opt-pill"
                  onClick={() => startRest(option.seconds)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
