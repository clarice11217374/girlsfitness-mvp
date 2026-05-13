"use client";

import { useEffect, useRef, useState } from "react";
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
import { loadCurrentWorkoutSelection } from "@/utils/currentWorkoutSelectionStorage";
import { writeWorkoutExecSummary } from "@/utils/workoutExecSummaryStorage";

type Props = { onDone: () => void; templateId?: string | null; onBack?: () => void };

type ExecExercise = {
  id: string;
  name: string;
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

function writeSummaryForExercises(
  exercises: ExecExercise[],
  meta: {
    title: string;
    templateId: string;
    targetArea: string;
    estimatedMinutes: number;
  },
): void {
  writeWorkoutExecSummary({
    workoutTitle: meta.title,
    templateId: meta.templateId,
    targetArea: meta.targetArea,
    totalExercises: exercises.length,
    totalSets: exercises.reduce((acc, e) => acc + e.sets, 0),
    durationMinutes: meta.estimatedMinutes,
  });
}

function parseNumber(text: string, fallback: number): number {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

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

  const [restSec, setRestSec] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [restPickerOpen, setRestPickerOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const staticPayload = initialStaticPayload();
    const propId = typeof templateId === "string" && templateId.length > 0 ? templateId : null;
    const selectionId = loadCurrentWorkoutSelection()?.matchedTemplateId ?? null;
    const resolvedId = propId ?? selectionId;

    if (resolvedId) {
      const raw = getTemplateOrderedExercises(resolvedId);
      const phases = buildTemplatePhasePlanForExec(resolvedId);
      const mapped = raw.map(toExecFromTemplate);
      const template = getWorkoutTemplateById(resolvedId);

      setExercises(mapped);
      setPhasePlan(phases);
      writeSummaryForExercises(mapped, {
        title: template.meta.title,
        templateId: template.meta.id,
        targetArea: template.meta.targetArea,
        estimatedMinutes: template.meta.estimatedMinutes,
      });
    } else {
      setExercises(staticPayload.exercises);
      setPhasePlan(staticPayload.phasePlan);
      writeSummaryForExercises(staticPayload.exercises, {
        title: workoutTemplateMeta.title,
        templateId: "upper-push-strength-day",
        targetArea: "upper_push",
        estimatedMinutes: workoutTemplateMeta.estimatedMinutes,
      });
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
    setReps(parseNumber(currentExercise.reps, 12));
    setWeight(5);
  }, [currentExercise?.id]);

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

  if (!currentExercise) {
    return (
      <div className="page exec-page" style={{ padding: 24 }}>
        <p>暂无可执行动作</p>
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

  const subtitle = shouldUseWeight
    ? `本次：${weight}kg × ${reps}次 · 共${currentExercise.sets}组`
    : shouldUseRepsControl
      ? `本次：${reps}次 · 共${currentExercise.sets}组`
      : `${currentExercise.reps} · 共${currentExercise.sets}组`;

  return (
    <div className="page exec-page" style={{ paddingBottom: 0 }}>
      <div className="exec-top">
        <div className="sbar" style={{ padding: "0 0 10px" }}>
          <span>9:41</span>
        </div>

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
          <div className="ex-reps">{subtitle}</div>

          <div className="ex-anim">
            <span className="exercise-placeholder-text">{currentExercise.visualPlaceholder}</span>
          </div>

          <div className="guide-card">
            <div className="guide-title">动作指引</div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>1.</strong> {currentExercise.actionGuide.step1}
              </div>
            </div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>2.</strong> {currentExercise.actionGuide.step2}
              </div>
            </div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>3.</strong> {currentExercise.actionGuide.step3}
              </div>
            </div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>呼吸：</strong>
                {currentExercise.actionGuide.breathing}
              </div>
            </div>
          </div>

          <div className={`equip-panel ${equipmentOpen ? "open" : ""}`}>
            <button className="equip-toggle" type="button" onClick={() => setEquipmentOpen((v) => !v)}>
              <span>
                <span className="equip-hint-lbl">器械不会用？查看座椅、握法和重量设置</span>
              </span>
              <span className="equip-hint-arrow">{equipmentOpen ? "▾" : "▸"}</span>
            </button>

            {equipmentOpen && (
              <div className="equip-setup">
                <div className="equip-row">
                  <strong>认机器：</strong>
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
            )}
          </div>

          <div className="guide-card">
            <div className="guide-title">训练提醒</div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>常见错误：</strong>
                {currentExercise.commonMistakesDisplay}
              </div>
            </div>
            <div className="guide-item">
              <div className="guide-text">
                <strong>平替：</strong>
                {currentExercise.alternative}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-bottom-panel">
        {(shouldUseWeight || shouldUseRepsControl) && (
          <div className="exec-metrics">
            {shouldUseWeight && (
              <div className="metric-box">
                <div className="metric-label">重量 kg</div>
                <div className="metric-controls">
                  <button type="button" onClick={() => setWeight((w) => Math.max(0, w - 1))}>
                    −
                  </button>
                  <span>{weight}</span>
                  <button type="button" onClick={() => setWeight((w) => w + 1)}>
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
                  <button type="button" onClick={() => setReps((r) => Math.max(1, r - 1))}>
                    −
                  </button>
                  <span>{reps}</span>
                  <button type="button" onClick={() => setReps((r) => r + 1)}>
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
          <div className="rest-display" onClick={() => !ticking && setRestPickerOpen((v) => !v)}>
            <div className="rest-display-label">{ticking ? "休息中" : "休息闹钟"}</div>
            <div className="rest-display-time">{fmt(restSec)}</div>
          </div>

          <button
            className="next-set-btn"
            type="button"
            onClick={isExerciseComplete ? goNextExerciseOrFinish : completeCurrentSet}
          >
            {mainButtonText}
          </button>
        </div>

        {restPickerOpen && !ticking && (
          <div className="rest-opts" style={{ marginTop: 10 }}>
            {restOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="rest-opt"
                onClick={() => startRest(option.seconds)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {ticking && (
          <div style={{ marginTop: 10 }}>
            <button type="button" className="rest-opt" onClick={stopRest}>
              停止休息
            </button>
          </div>
        )}
      </div>
    </div>
  );
}