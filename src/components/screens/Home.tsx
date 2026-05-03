"use client";

import { useEffect, useState } from "react";
import { workoutByPhase, workoutTemplateMeta } from "@/data/workoutData";
import {
  getWorkoutTemplateById,
  type CycleStatus,
  type EnergyLevel,
  type WorkoutTemplate,
} from "@/data/workoutTemplates";
import {
  loadCurrentWorkoutSelection,
  type CurrentWorkoutSelectionV1,
} from "@/utils/currentWorkoutSelectionStorage";
import { getTrainingRecords } from "@/utils/trainingRecordStorage";

type Props = {
  onStart: () => void;
  onTraining: () => void;
  onRecords: () => void;
  onReSelect: () => void;
};

const CHALLENGE_GOAL_HOURS = 100;

/** 四舍五入到 1 位小数；去掉末尾 `.0`（如 5.0 → 5；0.0 → 0；0.8 保留） */
function formatHoursValue(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return rounded.toFixed(1).replace(/\.0$/, "");
}

function countTemplateExercises(t: WorkoutTemplate): number {
  const { warmup, strength, cardio, stretch } = t.workoutByPhase;
  return warmup.length + strength.length + cardio.length + stretch.length;
}

function selectionStatusLine(sel: CurrentWorkoutSelectionV1): string {
  const cycleLabel: Record<CycleStatus, string> = {
    period: "经期中",
    not_period: "不在经期",
    uncertain: "不确定",
  };
  const energyLabel: Record<EnergyLevel, string> = {
    low: "有点累",
    normal: "精力不错",
    high: "精力充沛",
  };
  return `${cycleLabel[sel.cycleStatus]} · ${energyLabel[sel.energyLevel]}`;
}

export function Home({ onStart, onTraining, onRecords, onReSelect }: Props) {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [selection, setSelection] = useState<CurrentWorkoutSelectionV1 | null>(null);

  useEffect(() => {
    const records = getTrainingRecords();
    const sum = records.reduce((acc, r) => {
      const m = r.durationMinutes;
      return acc + (typeof m === "number" && Number.isFinite(m) ? m : 0);
    }, 0);
    setTotalMinutes(sum);
    setSelection(loadCurrentWorkoutSelection());
  }, []);

  const days = [
    { n: "一", d: 21 },
    { n: "二", d: 22 },
    { n: "三", d: 23, dot: true },
    { n: "四", d: 24, today: true },
    { n: "五", d: 25 },
    { n: "六", d: 26, dot: true },
    { n: "日", d: 27 },
  ];

  const totalHours = totalMinutes / 60;
  const hasProgress = totalMinutes > 0;
  const remainingHours = Math.max(0, CHALLENGE_GOAL_HOURS - totalHours);
  const barPct = Math.min(100, (totalHours / CHALLENGE_GOAL_HOURS) * 100);

  const staticExerciseCount =
    workoutByPhase.warmup.length +
    workoutByPhase.strength.length +
    workoutByPhase.cardio.length +
    workoutByPhase.stretch.length;

  const activeTemplate = selection ? getWorkoutTemplateById(selection.matchedTemplateId) : null;
  const planTitle = selection && activeTemplate ? activeTemplate.meta.title : workoutTemplateMeta.title;
  const planMinutes =
    selection && activeTemplate ? activeTemplate.meta.estimatedMinutes : workoutTemplateMeta.estimatedMinutes;
  const planIntensity =
    selection && activeTemplate ? activeTemplate.meta.intensity : workoutTemplateMeta.intensity;
  const planExerciseCount =
    selection && activeTemplate ? countTemplateExercises(activeTemplate) : staticExerciseCount;
  const planBadge =
    selection?.selectedTraining === "smart" ? "✨ 智能匹配 · 今日推荐" : "⚡ 今日计划";

  return (
    <div className="page home-screen">
      <div className="sbar">
        <span>9:41</span>
      </div>
      <div className="hdr">
        <div>
          <div style={{ fontSize: 13, color: "var(--gray)" }}>欢迎回来 👋</div>
          <div className="t-title" style={{ fontSize: 26 }}>
            今日训练
          </div>
        </div>
        <div className="av">🌸</div>
      </div>
      {selection && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 28px 12px",
            fontSize: 13,
            color: "var(--gray)",
          }}
        >
          <span style={{ lineHeight: 1.45 }}>{selectionStatusLine(selection)}</span>
          <button
            type="button"
            onClick={onReSelect}
            style={{
              flexShrink: 0,
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            重新选择
          </button>
        </div>
      )}
      <div className="sec-row">
        <div className="t-sec">本周计划</div>
        <div className="see-all">查看全部</div>
      </div>
      <div className="wstrip">
        {days.map((d) => (
          <div className="dcell" key={d.d}>
            <div className="dname">{d.n}</div>
            <div className={`dnum ${d.today ? "today" : ""}`}>{d.d}</div>
            {d.dot && <div className="ddot" />}
          </div>
        ))}
      </div>
      <div className="wcard">
        <div className="wtag">{selection ? planBadge : "⚡ 今日计划"}</div>
        <div className="wname">{planTitle}</div>
        <div className="wmeta">{`${planMinutes}分钟 · ${planIntensity} · ${planExerciseCount}个动作`}</div>
        <button className="wbtn" onClick={onStart}>
          开始训练
        </button>
        <div className="wbig">{`${planMinutes}’`}</div>
      </div>
      <div className="mcard">
        <div className="mtop">
          <div className="mlbl">🏆 百小时挑战</div>
          <div className="mval">
            {hasProgress
              ? `${formatHoursValue(totalHours)}h / ${CHALLENGE_GOAL_HOURS}h`
              : `0h / ${CHALLENGE_GOAL_HOURS}h`}
          </div>
        </div>
        <div className="ptrack">
          <div className="pfill" style={{ width: `${barPct}%` }} />
        </div>
        <div className="msub">
          {hasProgress
            ? `再坚持 ${formatHoursValue(remainingHours)} 小时，解锁成就徽章 🏅`
            : "完成第一次训练，开始累计你的百小时挑战"}
        </div>
      </div>
      <div className="bnav">
        {[
          { icon: "🏠", lbl: "首页", on: true },
          { icon: "📋", lbl: "训练", click: onTraining },
          { icon: "📊", lbl: "记录", click: onRecords },
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
