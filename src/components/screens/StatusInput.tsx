"use client";

import { useState } from "react";
import type { CycleStatus, EnergyLevel } from "@/data/workoutTemplates";
import {
  getLastTargetAreaFromRecords,
  getMatchedWorkoutTemplate,
  type TrainingChoice,
} from "@/lib/workoutMatcher";
import { saveCurrentWorkoutSelection } from "@/utils/currentWorkoutSelectionStorage";
import { getTrainingRecords } from "@/utils/trainingRecordStorage";

type Props = { onDone: () => void };

function mapPeriodLabelToCycle(label: string): CycleStatus {
  if (label === "经期中") return "period";
  if (label === "不在经期") return "not_period";
  return "uncertain";
}

function mapEnergyLabelToLevel(label: string): EnergyLevel {
  if (label === "精力充沛") return "high";
  if (label === "正常") return "normal";
  return "low";
}

function mapPartIdToTraining(id: string): TrainingChoice {
  switch (id) {
    case "push":
      return "upper_push";
    case "pull":
      return "upper_pull";
    case "legs":
      return "lower_body";
    case "full":
      return "full_body";
    default:
      return "full_body";
  }
}

export function StatusInput({ onDone }: Props) {
  const [period, setPeriod] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [part, setPart] = useState<string | null>(null);
  const [smart, setSmart] = useState(false);

  const periods = ["经期中", "不在经期", "不确定"];
  const energies = [
    { l: "精力充沛", s: "sl" },
    { l: "正常", s: "sb" },
    { l: "有点累", s: "sl" },
  ];
  const parts = [
    { id: "push", icon: "💪", name: "上肢推", desc: "胸 · 肩 · 三头" },
    { id: "pull", icon: "🔗", name: "上肢拉", desc: "背 · 二头 · 肩后" },
    { id: "legs", icon: "🦵", name: "臀腿核心", desc: "臀 · 大腿 · 核心" },
    { id: "full", icon: "⚡", name: "全身燃脂", desc: "全身 · 有氧结合" },
  ];

  const canSubmit = Boolean(period && energy && (smart || part));

  const handleGenerate = () => {
    if (!period || !energy) return;
    if (!smart && !part) return;

    const cycleStatus = mapPeriodLabelToCycle(period);
    const energyLevel = mapEnergyLabelToLevel(energy);
    const selectedTraining: TrainingChoice = smart ? "smart" : mapPartIdToTraining(part!);

    const records = getTrainingRecords();
    const lastTargetArea = getLastTargetAreaFromRecords([...records].reverse());

    const template = getMatchedWorkoutTemplate({
      cycleStatus,
      energyLevel,
      selectedTraining,
      lastTargetArea,
    });

    saveCurrentWorkoutSelection({
      cycleStatus,
      energyLevel,
      selectedTraining,
      matchedTemplateId: template.meta.id,
      matchedTemplateTitle: template.meta.title,
      targetArea: template.meta.targetArea,
      selectedAt: new Date().toISOString(),
    });

    onDone();
  };

  return (
    <div className="page status-screen">
      <div className="sbar">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <div className="status-scroll">
        <div style={{ paddingTop: 24, marginBottom: 28 }}>
          <div className="t-title">
            告诉我你<br />
            今天的状态 ✨
          </div>
          <div className="t-sub">我会为你定制最适合的训练计划</div>
        </div>
        <div className="t-label">经期状态</div>
        <div className="chips">
          {periods.map((o) => (
            <div key={o} className={`chip ${period === o ? "sl" : ""}`} onClick={() => setPeriod(o)}>
              {o}
            </div>
          ))}
        </div>
        <div className="t-label">今日状态</div>
        <div className="chips">
          {energies.map((o) => (
            <div key={o.l} className={`chip ${energy === o.l ? o.s : ""}`} onClick={() => setEnergy(o.l)}>
              {o.l}
            </div>
          ))}
        </div>
        <div className="t-label">训练选择</div>
        <div className="smart-wrap">
          <div className="smart-badge">推荐</div>
          <div
            className={`smart ${smart ? "sel" : ""}`}
            onClick={() => {
              setSmart(!smart);
              setPart(null);
            }}
          >
            <div style={{ fontSize: 24 }}>🤖</div>
            <div>
              <div className="sname">智能推荐</div>
              <div className="ssub">根据你的状态自动选择最佳训练</div>
            </div>
          </div>
        </div>
        <div className="status-divider">
          <span>或者自己选</span>
        </div>
        <div className="pgrid">
          {parts.map((p) => (
            <div
              key={p.id}
              className={`pcard ${part === p.id ? "sel" : ""}`}
              onClick={() => {
                setPart(p.id);
                setSmart(false);
              }}
            >
              <div className="picon">{p.icon}</div>
              <div className="pname">{p.name}</div>
              <div className="pdesc">{p.desc}</div>
            </div>
          ))}
        </div>
        <button
          className="cta"
          type="button"
          disabled={!canSubmit}
          onClick={handleGenerate}
          style={!canSubmit ? { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" } : undefined}
        >
          生成今日训练 →
        </button>
      </div>
    </div>
  );
}
