"use client";

import { useCallback, useState } from "react";
import { saveTrainingRecord } from "@/utils/trainingRecordStorage";

type Props = { onHome: () => void; onSaved: () => void };

export function Complete({ onHome, onSaved }: Props) {
  const [feel, setFeel] = useState<string>("很好");
  const [hasSaved, setHasSaved] = useState(false);
  const feelOptions = [
    { lbl: "很好", emoji: "💪" },
    { lbl: "平稳", emoji: "👌" },
    { lbl: "有点累", emoji: "😮‍💨" },
  ] as const;

  const persistRecord = useCallback(() => {
    if (hasSaved) return;
    saveTrainingRecord({
      workoutTitle: "上肢推 · 力量日",
      totalExercises: 9,
      totalSets: 13,
      durationMinutes: 45,
      feeling: feel,
      notes: "workoutId:upper-push-strength",
    });
    setHasSaved(true);
  }, [hasSaved, feel]);

  const handleSaveRecord = () => {
    persistRecord();
    onSaved();
  };

  const handleBackHome = () => {
    persistRecord();
    onHome();
  };

  return (
    <div className="page complete-screen">
      <div className="sbar" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}><span>9:41</span><span>●●●</span></div>

      <div className="complete-top">
        <p className="complete-eyebrow">训练完成</p>
        <h1 className="complete-main-title">拥抱每一次进步</h1>
        <p className="complete-sub">
          慢慢呼吸一下
          <br />
          把身体从训练里，轻轻带回日常。
        </p>
      </div>

      <div className="complete-visual">
        <span className="complete-visual-placeholder">情绪载体位</span>
      </div>

      <div className="feeling-sec">
        <div className="feel-title">现在感觉怎么样？</div>
        <div className="feel-row">
          {feelOptions.map(({ lbl, emoji }) => (
            <button
              key={lbl}
              type="button"
              className={`feel-btn ${feel === lbl ? "sel" : ""}`}
              onClick={() => setFeel(lbl)}
              aria-pressed={feel === lbl}
            >
              <span className="feel-emoji" aria-hidden={true}>
                {emoji}
              </span>
              <span className="feel-lbl">{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="complete-actions">
        <button type="button" className="comp-cta" onClick={handleSaveRecord}>
          保存记录 →
        </button>
        <button type="button" className="complete-cta-secondary" onClick={handleBackHome}>
          返回首页
        </button>
      </div>
    </div>
  );
}
