"use client";

import { useCallback, useEffect, useState } from "react";
import { Dumbbell, ThumbsUp, Wind } from "lucide-react";
import { saveTrainingRecord } from "@/utils/trainingRecordStorage";
import {
  clearWorkoutExecSummary,
  readWorkoutExecSummary,
  type WorkoutExecSummaryV1,
} from "@/utils/workoutExecSummaryStorage";
import { StatusBar } from "@/components/StatusBar";

type Props = { onSaved: () => void; onHome: () => void };

const galleryImages = [
  "/gallery/1.png",
  "/gallery/2.png",
  "/gallery/3.png",
  "/gallery/4.png",
  "/gallery/5.png",
  "/gallery/6.png",
  "/gallery/7.png",
];

export function Complete({ onSaved, onHome }: Props) {
  const [summary, setSummary] = useState<WorkoutExecSummaryV1 | null>(null);
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
    setSummary(readWorkoutExecSummary());
  }, []);

  const persistRecord = useCallback(() => {
    if (hasSaved || !summary) return;

    saveTrainingRecord({
      workoutTitle: summary.workoutTitle,
      totalExercises: summary.totalExercises,
      totalSets: summary.totalSets,
      durationMinutes: summary.durationMinutes,
      completedAt: summary.completedAt,
      feeling: feel,
      notes: `templateId:${summary.templateId}`,
      templateId: summary.templateId,
      targetArea: summary.targetArea,
    });
    clearWorkoutExecSummary();
    setHasSaved(true);
  }, [hasSaved, feel, summary]);

  const handleSaveRecord = () => {
    if (!summary) return;
    persistRecord();
    onSaved();
  };

  return (
    <div className="page complete-screen">
      <StatusBar style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }} />

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

      {summary ? (
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
                disabled={hasSaved}
              >
                <span className="feel-emoji" aria-hidden={true}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="feel-lbl">{lbl}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="complete-actions">
        {summary ? (
          <button
            type="button"
            className="comp-cta"
            onClick={handleSaveRecord}
            disabled={hasSaved}
          >
            {hasSaved ? "已保存" : "保存记录 →"}
          </button>
        ) : (
          <>
            <p style={{ marginBottom: 16, color: "var(--gray)", textAlign: "center", lineHeight: 1.5 }}>
              暂无可保存的训练记录
            </p>
            <button type="button" className="comp-cta" onClick={onHome}>
              返回首页
            </button>
          </>
        )}
      </div>
    </div>
  );
}
