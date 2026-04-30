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
  const titleDisplay = meta.title.replace(" · ", "\n");
  const fixedDescription = "以胸、肩、三头为主的上肢推训练";
  const phaseSummary = phaseMeta.map((phase) => ({
    ...phase,
    moves: workoutByPhase[phase.key],
    count: workoutByPhase[phase.key].length,
  }));

  return (
    <div className="page preview-page">
      <div className="prev-hero">
        <div className="prev-back" onClick={onBack}>←</div>
      </div>
      <div className="scrollable preview-scrollable"><div className="prev-content">
        <div className="prev-title">{titleDisplay}</div>
        <div className="prev-desc">{fixedDescription}</div>

        <div className="preview-tags">
          <span className="preview-tag tag-time">⏱ {meta.estimatedMinutes} 分钟</span>
          <span className="preview-tag tag-intensity">🔥 {meta.intensity}</span>
          <span className="preview-tag tag-focus">💪 {meta.focus}</span>
          <span className="preview-tag tag-type">🏋️ {meta.trainingType}</span>
          <span className="preview-tag tag-equip">🔁 {meta.equipmentSummary}</span>
        </div>

        <div className="schedule-list-wrap">
          <div className="flow-title">训练安排</div>
          <div className="schedule-list">
            {phaseSummary.map((phase) => (
              <div key={phase.key} className="schedule-group">
                <div className="schedule-head">
                  <div className={`phase-dot phase-dot-${phase.key}`} aria-hidden />
                  <div className="phase-name">{phase.label}</div>
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
      </div></div>
      <div className="preview-sticky-cta">
        <button className="cta" onClick={onStart}>开始训练 →</button>
      </div>
    </div>
  );
}

function formatMoveMeta(move: WorkoutExercise): string {
  if (move.sets > 1) return `${move.sets}组 × ${move.reps}`;

  if (move.reps.includes("分钟")) {
    const matched = move.reps.match(/\d+\s*分钟/);
    return matched?.[0] ?? move.reps;
  }

  if (move.reps.includes("秒")) return move.reps;
  return `1组 × ${move.reps}`;
}
