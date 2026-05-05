"use client";

import { useCallback, useEffect, useState } from "react";
import { Dumbbell, ThumbsUp, Wind } from "lucide-react";
import { saveTrainingRecord } from "@/utils/trainingRecordStorage";
import { clearWorkoutExecSummary, readWorkoutExecSummary } from "@/utils/workoutExecSummaryStorage";

type Props = { onSaved: () => void };

const galleryImages = [
  "/gallery/1.png",
  "/gallery/2.png",
  "/gallery/3.png",
  "/gallery/4.png",
  "/gallery/5.png",
  "/gallery/6.png",
  "/gallery/7.png",
];

export function Complete({ onSaved }: Props) {
  const [feel, setFeel] = useState<string>("很好");
  const [hasSaved, setHasSaved] = useState(false);
  const [randomImage, setRandomImage] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const feelOptions = [
    { lbl: "很好", icon: Dumbbell },
    { lbl: "平稳", icon: ThumbsUp },
    { lbl: "有点累", icon: Wind },
  ] as const;

  useEffect(() => {
    const index = Math.floor(Math.random() * galleryImages.length);
    setRandomImage(galleryImages[index]);
  }, []);

  const persistRecord = useCallback(() => {
    if (hasSaved) return;
    const summary = readWorkoutExecSummary();
    saveTrainingRecord({
      workoutTitle: summary?.workoutTitle ?? "上肢推 · 力量日",
      totalExercises: summary?.totalExercises ?? 9,
      totalSets: summary?.totalSets ?? 13,
      durationMinutes: summary?.durationMinutes ?? 45,
      feeling: feel,
      notes: summary?.templateId ? `templateId:${summary.templateId}` : "workoutId:upper-push-strength",
      templateId: summary?.templateId,
      targetArea: summary?.targetArea,
    });
    clearWorkoutExecSummary();
    setHasSaved(true);
  }, [hasSaved, feel]);

  const handleSaveRecord = () => {
    persistRecord();
    onSaved();
  };

  return (
    <div className="page complete-screen">
      <div className="sbar" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <span>9:41</span>
      </div>

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
        {randomImage && !imageFailed && (
          <img
            className="complete-random-image"
            src={randomImage}
            alt="训练完成展示图"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="complete-visual-placeholder">情绪载体位</span>
      </div>

      <div className="feeling-sec">
        <div className="feel-title">现在感觉怎么样？</div>
        <div className="feel-row">
          {feelOptions.map(({ lbl, icon: Icon }) => (
            <button
              key={lbl}
              type="button"
              className={`feel-btn ${feel === lbl ? "sel" : ""}`}
              onClick={() => setFeel(lbl)}
              aria-pressed={feel === lbl}
            >
              <span className="feel-emoji" aria-hidden={true}>
                <Icon className="w-5 h-5" />
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
      </div>
    </div>
  );
}
