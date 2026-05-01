"use client";

import { useState } from "react";
import { saveTrainingRecord } from "@/utils/trainingRecordStorage";

type Props = { onHome: () => void };

export function Complete({ onHome }: Props) {
  const [feel, setFeel] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const feelings = [{ icon: "🔥", lbl: "感觉很棒" }, { icon: "😊", lbl: "还不错" }, { icon: "😮‍💨", lbl: "有点累" }];

  const handleBackHome = () => {
    if (!hasSaved) {
      saveTrainingRecord({
        workoutTitle: "上肢推 · 力量日",
        totalExercises: 9,
        totalSets: 13,
        durationMinutes: 45,
        feeling: feel ?? "未记录",
        notes: "workoutId:upper-push-strength",
      });
      setHasSaved(true);
    }

    onHome();
  };

  return (
    <div className="page complete-screen">
      <div className="sbar" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}><span>9:41</span><span>●●●</span></div>
      <div className="comp-hero"><div className="comp-emoji">🎉</div><div className="comp-title">太棒了！</div><div className="comp-sub">上肢推 · 力量日 已完成</div></div>
      <div className="stat-grid">
        <div className="stat-box"><div className="stat-val">13</div><div className="stat-unit">完成组数</div></div>
        <div className="stat-box"><div className="stat-val">42’</div><div className="stat-unit">训练用时</div></div>
        <div className="stat-box"><div className="stat-val">4</div><div className="stat-unit">动作完成</div></div>
        <div className="stat-box"><div className="stat-val">24h</div><div className="stat-unit">累计时长</div></div>
      </div>
      <div className="feeling-sec"><div className="feel-title">今天训练后的感受？</div><div className="feel-row">{feelings.map((f) => <div key={f.lbl} className={`feel-btn ${feel === f.lbl ? "sel" : ""}`} onClick={() => setFeel(f.lbl)}><div className="feel-icon">{f.icon}</div><div className="feel-lbl">{f.lbl}</div></div>)}</div></div>
      <button className="comp-cta" onClick={handleBackHome}>返回首页</button>
    </div>
  );
}
