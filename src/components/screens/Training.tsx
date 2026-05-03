"use client";

import { workoutTemplates } from "@/data/workoutTemplates";

type Props = {
  onHome: () => void;
  onPickTemplate: (templateId: string) => void;
  onRecords: () => void;
};

function countExercises(template: (typeof workoutTemplates)[number]): number {
  const p = template.workoutByPhase;
  return p.warmup.length + p.strength.length + p.cardio.length + p.stretch.length;
}

function coverVariant(id: string): "push" | "recover" | "legs" {
  if (id.includes("period")) return "recover";
  if (id.includes("lower") || id.includes("full")) return "legs";
  return "push";
}

export function Training({ onHome, onPickTemplate, onRecords }: Props) {
  return (
    <div className="page training-screen">
      <div className="sbar">
        <span>9:41</span>
      </div>
      <div className="hdr">
        <div>
          <div style={{ fontSize: 13, color: "var(--gray)" }}>训练选择</div>
          <div className="t-title" style={{ fontSize: 26 }}>
            训练模板
          </div>
        </div>
      </div>

      <div className="training-scroll">
        <div className="template-list">
          {workoutTemplates.map((item) => {
            const meta = item.meta;
            const moveCount = countExercises(item);
            const cover = coverVariant(meta.id);
            return (
              <button
                type="button"
                key={meta.id}
                className="template-card"
                onClick={() => onPickTemplate(meta.id)}
              >
                <div className={`template-cover template-cover--${cover}`}>
                  <div className="template-time">{`${meta.estimatedMinutes}’`}</div>
                </div>
                <div className="template-body">
                  <div className="template-head">
                    <div className="template-title">{meta.title}</div>
                    <div className="template-badge">查看并开始</div>
                  </div>
                  <div className="template-meta">
                    {`${meta.estimatedMinutes}分钟 · ${meta.intensity} · ${moveCount}个动作`}
                  </div>
                  <div className="template-tags">
                    <span className="template-tag">{meta.focus}</span>
                    <span className="template-tag">{meta.equipmentSummary}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bnav">
        {[
          { icon: "🏠", lbl: "首页", on: false, click: onHome },
          { icon: "📋", lbl: "训练", on: true },
          { icon: "📊", lbl: "记录", on: false, click: onRecords },
        ].map((n) => (
          <div key={n.lbl} className={`ni ${n.on ? "on" : ""}`} onClick={n.click}>
            <div className="nicon">{n.icon}</div>
            <div className="nlbl">{n.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
