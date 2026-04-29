"use client";

import { workoutByPhase, workoutTemplateMeta, type WorkoutExercise, type WorkoutPhase } from "@/data/workoutData";

type Props = { onBack: () => void; onStart: () => void };

export function Preview({ onBack, onStart }: Props) {
  const phaseMeta: { key: WorkoutPhase; label: string }[] = [
    { key: "warmup", label: "热身" },
    { key: "strength", label: "力量" },
    { key: "cardio", label: "有氧" },
    { key: "stretch", label: "拉伸" },
  ];
  const meta = workoutTemplateMeta;
  const phaseSummary = phaseMeta.map((phase) => ({
    ...phase,
    moves: workoutByPhase[phase.key],
    count: workoutByPhase[phase.key].length,
  }));

  return (
    <div className="page preview-page">
      <div className="prev-hero">
        <div className="prev-back" onClick={onBack}>←</div>
        <div className="prev-body-label">上肢推训练</div>
      </div>
      <div className="scrollable preview-scrollable"><div className="prev-content">
        <div className="prev-title">{meta.title}</div>
        <div className="prev-desc">{meta.description}</div>

        <div className="preview-meta">
          <div className="preview-meta-row">
            <span className="meta-icon meta-icon-time" aria-hidden />
            <span>{meta.estimatedMinutes} 分钟 · {meta.intensity}</span>
          </div>
          <div className="preview-meta-row">
            <span className="meta-icon meta-icon-focus" aria-hidden />
            <span>{meta.focus} · {meta.trainingType}</span>
          </div>
          <div className="preview-meta-row">
            <span className="meta-icon meta-icon-equip" aria-hidden />
            <span>{meta.equipmentSummary}</span>
          </div>
        </div>

        <div className="flow-card">
          <div className="flow-title">训练安排</div>
          <div className="schedule-list">
            {phaseSummary.map((phase) => (
              <div key={phase.key} className="schedule-group">
                <div className="schedule-head">
                  <div className="phase-name">{phase.label}</div>
                  <div className="phase-meta">{phase.count} 个动作</div>
                </div>
                <div className="schedule-card">
                  {phase.moves.map((move) => (
                    <div className="schedule-row" key={move.id}>
                      <div className="compact-name">{move.name}</div>
                      <div className="compact-meta">{formatMoveMeta(move)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div></div>
      <div className="preview-sticky-cta">
        <button className="cta" onClick={onStart}>开始训练 →</button>
      </div>
    </div>
  );
}

function formatMoveMeta(move: WorkoutExercise): string {
  if (move.reps.includes("秒") || move.reps.includes("分钟")) return move.reps;
  return `${move.sets}组 × ${move.reps}`;
}
