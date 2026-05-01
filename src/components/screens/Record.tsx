"use client";

import { useEffect, useState } from "react";
import { getTrainingRecords, type TrainingRecord } from "@/utils/trainingRecordStorage";

type Props = { onHome: () => void };

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function Record({ onHome }: Props) {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    setRecords(getTrainingRecords());
  }, []);

  return (
    <div className="page record-screen">
      <div className="sbar">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <div className="hdr">
        <div>
          <div style={{ fontSize: 13, color: "var(--gray)" }}>历史</div>
          <div className="t-title" style={{ fontSize: 26 }}>
            训练记录
          </div>
        </div>
      </div>
      <div className="record-list-wrap">
        {records.length === 0 ? (
          <p className="record-empty">暂无记录，完成一次训练后会出现在这里。</p>
        ) : (
          <ul className="record-list">
            {records.map((r) => (
              <li key={r.id} className="record-row">
                <div className="record-row-title">{r.workoutTitle}</div>
                <div className="record-row-meta">
                  {r.durationMinutes} 分钟 · {r.totalSets} 组
                  {r.feeling ? ` · ${r.feeling}` : ""}
                </div>
                <div className="record-row-when">{formatWhen(r.completedAt)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="record-actions">
        <button type="button" className="comp-cta" onClick={onHome}>
          返回首页
        </button>
      </div>
    </div>
  );
}
