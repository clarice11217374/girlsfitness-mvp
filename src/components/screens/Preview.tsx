"use client";

import { useEffect, useState } from "react";
import { workoutByPhase, workoutTemplateMeta } from "@/data/workoutData";
import { getWorkoutTemplateById, type WorkoutPhase, type WorkoutTemplate } from "@/data/workoutTemplates";
import { loadCurrentWorkoutSelection } from "@/utils/currentWorkoutSelectionStorage";

type Props = {
  onBack: () => void;
  onStart: () => void;
  templateId?: string | null;
  onStartWorkout?: (templateId: string | null) => void;
};

type MoveRow = { id: string; name: string; sets: number; reps: string };

const PHASE_ROWS: { key: WorkoutPhase; label: string }[] = [
  { key: "warmup", label: "热身" },
  { key: "strength", label: "力量" },
  { key: "cardio", label: "有氧" },
  { key: "stretch", label: "拉伸" },
];

type PreviewModel =
  | {
      source: "static";
      title: string;
      description: string;
      estimatedMinutes: number;
      intensity: string;
      focus: string;
      trainingType: string;
      equipmentSummary: string;
      phases: { key: WorkoutPhase; label: string; moves: MoveRow[]; count: number }[];
    }
  | {
      source: "template";
      template: WorkoutTemplate;
      phases: { key: WorkoutPhase; label: string; moves: MoveRow[]; count: number }[];
    };

function staticPreviewModel(): PreviewModel {
  const phases = PHASE_ROWS.map((phase) => {
    const moves = workoutByPhase[phase.key].map((m) => ({
      id: m.id,
      name: m.name,
      sets: m.sets,
      reps: m.reps,
    }));
    return { ...phase, moves, count: moves.length };
  });
  return {
    source: "static",
    title: workoutTemplateMeta.title,
    description: workoutTemplateMeta.description,
    estimatedMinutes: workoutTemplateMeta.estimatedMinutes,
    intensity: workoutTemplateMeta.intensity,
    focus: workoutTemplateMeta.focus,
    trainingType: workoutTemplateMeta.trainingType,
    equipmentSummary: workoutTemplateMeta.equipmentSummary,
    phases,
  };
}

function templatePreviewModel(template: WorkoutTemplate): PreviewModel {
  const phases = PHASE_ROWS.map((phase) => {
    const raw = template.workoutByPhase[phase.key];
    const moves = raw.map((m) => ({
      id: m.id,
      name: m.name,
      sets: m.sets,
      reps: m.reps,
    }));
    return { ...phase, moves, count: moves.length };
  });
  return { source: "template", template, phases };
}

export function Preview({ onBack, onStart, templateId = null, onStartWorkout }: Props) {
  const [model, setModel] = useState<PreviewModel>(() => staticPreviewModel());
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const propId = typeof templateId === "string" && templateId.length > 0 ? templateId : null;

    if (propId) {
      const template = getWorkoutTemplateById(propId);
      setModel(templatePreviewModel(template));
      setActiveTemplateId(propId);
      return;
    }

    const selection = loadCurrentWorkoutSelection();
    if (selection?.matchedTemplateId) {
      const tid = selection.matchedTemplateId;
      const template = getWorkoutTemplateById(tid);
      setModel(templatePreviewModel(template));
      setActiveTemplateId(tid);
      return;
    }

    setModel(staticPreviewModel());
    setActiveTemplateId(null);
  }, [templateId]);

  const title = model.source === "static" ? model.title : model.template.meta.title;
  const description = model.source === "static" ? model.description : model.template.meta.description;
  const estimatedMinutes =
    model.source === "static" ? model.estimatedMinutes : model.template.meta.estimatedMinutes;
  const intensity = model.source === "static" ? model.intensity : model.template.meta.intensity;
  const focus = model.source === "static" ? model.focus : model.template.meta.focus;
  const trainingType =
    model.source === "static" ? model.trainingType : model.template.meta.trainingType;
  const equipmentSummary =
    model.source === "static" ? model.equipmentSummary : model.template.meta.equipmentSummary;

  const titleDisplay = title.replace(" · ", "\n");
  const phaseSummary = model.phases;

  const handleStart = () => {
    if (onStartWorkout) {
      onStartWorkout(activeTemplateId);
    } else {
      onStart();
    }
  };

  return (
    <div className="page preview-page">
      <div className="prev-hero">
        <div className="prev-back" onClick={onBack}>
          ←
        </div>
      </div>
      <div className="scrollable preview-scrollable">
        <div className="prev-content">
          <div className="prev-title">{titleDisplay}</div>
          <div className="prev-desc">{description}</div>

          <div className="preview-tags">
            <span className="preview-tag tag-time">⏱ {estimatedMinutes} 分钟</span>
            <span className="preview-tag tag-intensity">🔥 {intensity}</span>
            <span className="preview-tag tag-focus">💪 {focus}</span>
            <span className="preview-tag tag-type">🏋️ {trainingType}</span>
            <span className="preview-tag tag-equip">🔁 {equipmentSummary}</span>
          </div>

          <div className="schedule-list-wrap">
            <div className="flow-title">训练安排</div>
            <div className="schedule-list">
              {phaseSummary.map((phase) => (
                <div key={phase.key} className="schedule-group">
                  <div className="schedule-head">
                    <div className={`phase-dot phase-dot-${phase.key}`} aria-hidden />
                    <div className="phase-name">
                      {phase.label} · {phase.count} 个动作
                    </div>
                    <div className="phase-line" aria-hidden />
                  </div>
                  {phase.moves.map((move) => (
                    <div className="schedule-row" key={move.id}>
                      <div className="compact-name">{move.name}</div>
                      <div className="compact-meta">{formatMoveMeta(move)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="preview-sticky-cta">
        <button className="cta" type="button" onClick={handleStart}>
          开始训练 →
        </button>
      </div>
    </div>
  );
}

function formatMoveMeta(move: Pick<MoveRow, "sets" | "reps">): string {
  if (move.sets > 1) return `${move.sets}组 × ${move.reps}`;

  if (move.reps.includes("分钟")) {
    const matched = move.reps.match(/\d+\s*分钟/);
    return matched?.[0] ?? move.reps;
  }

  if (move.reps.includes("秒")) return move.reps;
  return `1组 × ${move.reps}`;
}
