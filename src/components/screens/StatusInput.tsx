"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleHelp,
  Droplet,
  Dumbbell,
  Footprints,
  Frown,
  Heart,
  Lightbulb,
  Link,
  Smile,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CycleStatus, EnergyLevel } from "@/data/workoutTemplates";
import {
  getLastTargetAreaFromRecords,
  getMatchedWorkoutTemplate,
  type TrainingChoice,
} from "@/lib/workoutMatcher";
import { setCyclePeriod } from "@/utils/cycleRecordStorage";
import { saveCurrentWorkoutSelection } from "@/utils/currentWorkoutSelectionStorage";
import { todayDateKey } from "@/utils/dayKey";
import { getTrainingRecords } from "@/utils/trainingRecordStorage";
import { StatusBar } from "@/components/StatusBar";

type Props = {
  onDone: () => void;
  onSmartDone: () => void;
  onBack?: () => void;
};
type Step = "status" | "training";
type TrainingMode = "smart" | "upper_push" | "upper_pull" | "lower_core" | "full_body";

const periodOptions: { icon: LucideIcon; label: string; value: CycleStatus }[] = [
  { icon: Droplet, label: "经期中", value: "period" },
  { icon: CalendarCheck, label: "不在经期", value: "not_period" },
  { icon: CircleHelp, label: "不确定", value: "uncertain" },
];

const energyOptions: { icon: LucideIcon; label: string; value: EnergyLevel }[] = [
  { icon: Zap, label: "精力充沛", value: "high" },
  { icon: Smile, label: "正常", value: "normal" },
  { icon: Frown, label: "有点累", value: "low" },
];

const trainingOptions = [
  {
    mode: "smart" as const,
    icon: Bot,
    name: "智能推荐",
    desc: "根据经期状态和今日状态自动选择最佳训练",
    badge: "推荐",
  },
  {
    mode: "upper_push" as const,
    icon: Dumbbell,
    name: "上肢推",
    desc: "胸 · 肩 · 三头",
  },
  {
    mode: "upper_pull" as const,
    icon: Link,
    name: "上肢拉",
    desc: "背 · 二头 · 肩后",
  },
  {
    mode: "lower_core" as const,
    icon: Footprints,
    name: "臀腿核心",
    desc: "臀 · 大腿 · 核心",
  },
  {
    mode: "full_body" as const,
    icon: Zap,
    name: "全身燃脂",
    desc: "全身 · 有氧结合",
  },
];

function trainingModeToChoice(mode: TrainingMode): TrainingChoice {
  if (mode === "smart") return "smart";
  if (mode === "lower_core") return "lower_body";
  return mode;
}

function syncTodayCycleRecord(cycleStatus: CycleStatus): void {
  const today = todayDateKey();
  if (cycleStatus === "period") {
    setCyclePeriod(today, true);
    return;
  }
  if (cycleStatus === "not_period") {
    setCyclePeriod(today, false);
  }
}

export function StatusInput({ onDone, onSmartDone, onBack }: Props) {
  const [step, setStep] = useState<Step>("status");
  const [periodStatus, setPeriodStatus] = useState<CycleStatus | null>(null);
  const [energyStatus, setEnergyStatus] = useState<EnergyLevel | null>(null);
  const [selectedTrainingMode, setSelectedTrainingMode] = useState<TrainingMode | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canContinue = Boolean(periodStatus && energyStatus);
  const canSubmit = Boolean(selectedTrainingMode);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const handleNext = () => {
    if (!canContinue) return;
    setStep("training");
  };

  const handleGenerate = () => {
    if (!periodStatus || !energyStatus || !selectedTrainingMode) return;

    const selectedTraining = trainingModeToChoice(selectedTrainingMode);
    const records = getTrainingRecords();
    const lastTargetArea = getLastTargetAreaFromRecords([...records].reverse());

    const template = getMatchedWorkoutTemplate({
      cycleStatus: periodStatus,
      energyLevel: energyStatus,
      selectedTraining,
      lastTargetArea,
    });

    saveCurrentWorkoutSelection({
      cycleStatus: periodStatus,
      energyLevel: energyStatus,
      selectedTraining,
      matchedTemplateId: template.meta.id,
      matchedTemplateTitle: template.meta.title,
      targetArea: template.meta.targetArea,
      selectedAt: new Date().toISOString(),
    });

    syncTodayCycleRecord(periodStatus);

    if (selectedTrainingMode === "smart") {
      onSmartDone();
    } else {
      onDone();
    }
  };

  return (
    <div className={`page status-screen status-screen--${step}`}>
      <StatusBar />

      <div className="status-scroll" ref={scrollRef}>
        {step === "status" ? (
          <>
            <div className={`status-hero ${onBack ? "status-hero-with-back" : ""}`}>
              {onBack ? (
                <button className="status-back-btn" type="button" onClick={onBack}>
                  ← 返回
                </button>
              ) : null}
              <div className="status-step-pill">1 / 2</div>
              <div className="t-title status-title">
                告诉我你今天的状态
                <Sparkles className="status-title-sparkle" aria-hidden />
              </div>
              <div className="t-sub status-sub">我会为你定制最适合的训练计划</div>
            </div>

            <section className="status-choice-card" aria-labelledby="period-status-title">
              <div className="status-choice-heading">
                <span className="status-choice-heading-icon" aria-hidden>
                  <CalendarDays />
                </span>
                <span id="period-status-title">经期状态</span>
              </div>
              <div className="status-option-grid">
                {periodOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = periodStatus === option.value;
                  return (
                    <button
                      key={option.value}
                      className={`status-option ${selected ? "is-selected" : ""}`}
                      type="button"
                      onClick={() => setPeriodStatus(option.value)}
                    >
                      {selected ? (
                        <span className="status-option-check" aria-hidden>
                          <Check />
                        </span>
                      ) : null}
                      <Icon className="status-option-icon" aria-hidden />
                      <span className="status-option-label">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="status-choice-card" aria-labelledby="energy-status-title">
              <div className="status-choice-heading">
                <span className="status-choice-heading-icon" aria-hidden>
                  <Heart />
                </span>
                <span id="energy-status-title">今日状态</span>
              </div>
              <div className="status-option-grid">
                {energyOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = energyStatus === option.value;
                  return (
                    <button
                      key={option.value}
                      className={`status-option ${selected ? "is-selected" : ""}`}
                      type="button"
                      onClick={() => setEnergyStatus(option.value)}
                    >
                      {selected ? (
                        <span className="status-option-check" aria-hidden>
                          <Check />
                        </span>
                      ) : null}
                      <Icon className="status-option-icon" aria-hidden />
                      <span className="status-option-label">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="status-note">
              <span className="status-note-icon" aria-hidden>
                <Lightbulb />
              </span>
              <span>状态只用于调整今日训练强度，不会影响长期计划，放心告诉我吧。</span>
            </div>
          </>
        ) : (
          <>
            <div className="status-hero status-hero-with-back">
              <button className="status-back-btn" type="button" onClick={() => setStep("status")}>
                ← 返回
              </button>
              <div className="status-step-pill">2 / 2</div>
              <div className="t-title status-title">
                选择今天的训练
                <Sparkles className="status-title-sparkle" aria-hidden />
              </div>
              <div className="t-sub status-sub">你可以让系统推荐，也可以自己选择</div>
            </div>

            <div className="training-mode-grid">
              {trainingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.mode}
                    className={`training-mode-card ${selectedTrainingMode === option.mode ? "sel" : ""}`}
                    type="button"
                    onClick={() => setSelectedTrainingMode(option.mode)}
                  >
                    {option.badge ? <span className="training-mode-badge">{option.badge}</span> : null}
                    <span className="training-mode-icon" aria-hidden>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="training-mode-copy">
                      <span className="training-mode-name">{option.name}</span>
                      <span className="training-mode-desc">{option.desc}</span>
                    </span>
                    <span className="training-mode-radio" aria-hidden>
                      {selectedTrainingMode === option.mode ? <Check /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="training-change-note">你可以随时更换训练方式</div>
          </>
        )}
      </div>

      {step === "status" ? (
        <button
          className="cta"
          type="button"
          disabled={!canContinue}
          onClick={handleNext}
          style={!canContinue ? { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" } : undefined}
        >
          下一步 →
        </button>
      ) : (
        <button
          className="cta"
          type="button"
          disabled={!canSubmit}
          onClick={handleGenerate}
          style={!canSubmit ? { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" } : undefined}
        >
          生成今日训练 →
        </button>
      )}
    </div>
  );
}
