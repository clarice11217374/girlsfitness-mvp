"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { getWorkoutTemplateById, type WorkoutTemplate } from "@/data/workoutTemplates";
import { buildSmartResultCopy, type SmartResultCopy } from "@/lib/smartResultCopy";
import { getLastTargetAreaFromRecords } from "@/lib/workoutMatcher";
import {
  loadCurrentWorkoutSelection,
  type CurrentWorkoutSelectionV1,
} from "@/utils/currentWorkoutSelectionStorage";
import { getTrainingRecords } from "@/utils/trainingRecordStorage";
import { StatusBar } from "@/components/StatusBar";

type Props = {
  onStartToday: () => void;
  onBack: () => void;
};

const AI_SEGMENTS: { key: keyof SmartResultCopy; label: string; icon: string }[] = [
  { key: "reason", label: "我看到了你的状态", icon: "👁️" },
  { key: "knowledge", label: "为你推荐这套训练", icon: "💡" },
  { key: "tip", label: "今天训练时注意", icon: "⚡" },
  { key: "fact", label: "一个小知识", icon: "✨" },
];

const SEGMENT_COUNT = AI_SEGMENTS.length;
const PROGRESS_MS = 1500;
const SESSION_FALLBACK_MS = 6000;
const CARD_REVEAL_DELAY_MS = 180;
const TYPING_START_DELAY_MS = 320;
const TARGET_TYPING_MS = 4200;
const CTA_REVEAL_DELAY_MS = 400;

const PROGRESS_LABELS = ["匹配训练模板…", "生成建议中…", "完成 ✓"] as const;

function progressStatusLabel(progressDone: boolean, progressStep: number): string {
  if (progressDone) return PROGRESS_LABELS[2];
  return PROGRESS_LABELS[Math.min(progressStep, 1)];
}

function countTemplateExercises(t: WorkoutTemplate): number {
  const { warmup, strength, cardio, stretch } = t.workoutByPhase;
  return warmup.length + strength.length + cardio.length + stretch.length;
}

function cycleChipText(cycleStatus: string): string {
  const map: Record<string, string> = {
    period: "经期中",
    not_period: "不在经期",
    uncertain: "不确定",
  };
  return map[cycleStatus] ?? "状态已记录";
}

function energyChipText(energyLevel: string): string {
  const map: Record<string, string> = {
    high: "精力充沛",
    normal: "状态平稳",
    low: "有点累",
  };
  return map[energyLevel] ?? "精力已记录";
}

function buildCopySessionKey(selection: CurrentWorkoutSelectionV1 | null): string | null {
  if (!selection?.matchedTemplateId) return null;
  return [
    selection.matchedTemplateId,
    selection.cycleStatus,
    selection.energyLevel,
    selection.selectedAt,
  ].join("|");
}

function segmentTextsFromCopy(copy: SmartResultCopy): string[] {
  return [copy.reason, copy.knowledge, copy.tip, copy.fact];
}

export function SmartResult({ onStartToday, onBack }: Props) {
  const [selection] = useState(() => loadCurrentWorkoutSelection());
  const copySessionKey = buildCopySessionKey(selection);

  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [progressDone, setProgressDone] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [activeTextIndex, setActiveTextIndex] = useState(-1);
  const [typedText, setTypedText] = useState("");
  const [ctaVisible, setCtaVisible] = useState(false);

  const forcedCompleteRef = useRef(false);
  const charDelayRef = useRef(24);
  const segmentTextsRef = useRef<string[]>([]);
  const ctaRevealTimerRef = useRef<number | null>(null);

  const template = useMemo(() => {
    if (!selection?.matchedTemplateId) return null;
    try {
      return getWorkoutTemplateById(selection.matchedTemplateId);
    } catch {
      return null;
    }
  }, [selection?.matchedTemplateId]);

  const copy = useMemo(() => {
    if (!selection || !template || !copySessionKey) return null;
    const records = getTrainingRecords();
    const lastTargetArea = getLastTargetAreaFromRecords([...records].reverse());
    return buildSmartResultCopy({
      cycleStatus: selection.cycleStatus,
      energyLevel: selection.energyLevel,
      matchedTemplateId: selection.matchedTemplateId,
      lastTargetArea,
    });
  }, [copySessionKey, selection, template]);

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const scheduleCtaReveal = useCallback(() => {
    if (ctaRevealTimerRef.current !== null) {
      window.clearTimeout(ctaRevealTimerRef.current);
    }
    ctaRevealTimerRef.current = window.setTimeout(() => {
      ctaRevealTimerRef.current = null;
      setCtaVisible(true);
    }, CTA_REVEAL_DELAY_MS);
  }, []);

  const forceCompleteAll = useCallback(() => {
    if (forcedCompleteRef.current) return;
    forcedCompleteRef.current = true;
    setProgress(100);
    setProgressStep(2);
    setProgressDone(true);
    setCardVisible(true);
    setActiveTextIndex(SEGMENT_COUNT);
    setTypedText("");
    scheduleCtaReveal();
  }, [scheduleCtaReveal]);

  useEffect(() => {
    if (!selection?.matchedTemplateId || !template) {
      onBackRef.current();
    }
  }, [selection?.matchedTemplateId, template]);

  useEffect(() => {
    if (!copySessionKey || !copy) return;

    forcedCompleteRef.current = false;
    segmentTextsRef.current = segmentTextsFromCopy(copy);

    const totalChars = segmentTextsRef.current.join("").length;
    charDelayRef.current = Math.max(16, Math.min(32, Math.round(TARGET_TYPING_MS / Math.max(totalChars, 1))));

    setProgress(0);
    setProgressStep(0);
    setProgressDone(false);
    setCardVisible(false);
    setActiveTextIndex(-1);
    setTypedText("");
    setCtaVisible(false);
    if (ctaRevealTimerRef.current !== null) {
      window.clearTimeout(ctaRevealTimerRef.current);
      ctaRevealTimerRef.current = null;
    }

    let cancelled = false;
    const timers: number[] = [];
    const run = (fn: () => void) => {
      if (!cancelled && !forcedCompleteRef.current) fn();
    };

    const startedAt = Date.now();
    const progressTick = window.setInterval(() => {
      if (cancelled || forcedCompleteRef.current) return;
      const elapsed = Date.now() - startedAt;
      const ratio = Math.min(1, elapsed / PROGRESS_MS);
      const nextProgress = Math.round(ratio * 100);
      setProgress(nextProgress);

      if (ratio >= 0.5) setProgressStep(1);
      else setProgressStep(0);

      if (elapsed >= PROGRESS_MS) {
        window.clearInterval(progressTick);
        setProgress(100);
        setProgressStep(2);
        setProgressDone(true);
      }
    }, 40);

    timers.push(
      window.setTimeout(() => run(() => setCardVisible(true)), PROGRESS_MS + CARD_REVEAL_DELAY_MS),
    );
    timers.push(
      window.setTimeout(
        () => run(() => setActiveTextIndex(0)),
        PROGRESS_MS + CARD_REVEAL_DELAY_MS + TYPING_START_DELAY_MS,
      ),
    );
    timers.push(window.setTimeout(() => run(forceCompleteAll), SESSION_FALLBACK_MS));

    return () => {
      cancelled = true;
      window.clearInterval(progressTick);
      timers.forEach((id) => window.clearTimeout(id));
      if (ctaRevealTimerRef.current !== null) {
        window.clearTimeout(ctaRevealTimerRef.current);
        ctaRevealTimerRef.current = null;
      }
    };
  }, [copySessionKey, copy, forceCompleteAll]);

  useEffect(() => {
    if (!progressDone || !cardVisible || !copy) return;
    if (forcedCompleteRef.current) return;
    if (activeTextIndex < 0 || activeTextIndex >= SEGMENT_COUNT) return;

    const fullText = segmentTextsRef.current[activeTextIndex] ?? "";

    if (typedText.length >= fullText.length) {
      if (activeTextIndex + 1 >= SEGMENT_COUNT) {
        setActiveTextIndex(SEGMENT_COUNT);
        setTypedText("");
        scheduleCtaReveal();
      } else {
        setActiveTextIndex(activeTextIndex + 1);
        setTypedText("");
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setTypedText(fullText.slice(0, typedText.length + 1));
    }, charDelayRef.current);

    return () => window.clearTimeout(timer);
  }, [progressDone, cardVisible, copy, activeTextIndex, typedText, scheduleCtaReveal]);

  if (!selection || !template || !copy) {
    return null;
  }

  const exerciseCount = countTemplateExercises(template);
  const { meta } = template;
  const segmentTexts = segmentTextsFromCopy(copy);
  const allTypingDone = activeTextIndex >= SEGMENT_COUNT;
  const isTypingPhase = progressDone && !allTypingDone;

  return (
    <div
      className={`page smart-result-screen${ctaVisible ? " smart-result-screen--cta-visible" : ""}`}
    >
      <div className="smart-result-particles" aria-hidden />
      <StatusBar
        className="smart-result-sbar"
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      />

      <div className="smart-result-scroll">
        <section className="smart-result-hero">
          <div className="smart-result-hero-backdrop" aria-hidden />
          <header className="smart-result-topbar">
            <button type="button" className="smart-result-back" onClick={onBack} aria-label="返回">
              ←
            </button>
          </header>
          <div className="smart-result-hero-inner">
          <h1 className="smart-result-hero-title">
            {progressDone ? "今天的训练方案" : "正在为你生成"}
          </h1>
          {progressDone ? (
            <p className="smart-result-hero-sub">根据你的状态，我帮你安排好了</p>
          ) : null}
          <div className="smart-result-tags">
            <span className="smart-result-tag">{cycleChipText(selection.cycleStatus)}</span>
            <span className="smart-result-tag">{energyChipText(selection.energyLevel)}</span>
          </div>

          <div
            className={`smart-result-progress${progressDone ? " smart-result-progress--done" : ""}`}
            aria-live="polite"
          >
            <div className="smart-result-progress-head">
              <span className="smart-result-progress-status">
                {progressStatusLabel(progressDone, progressStep)}
              </span>
              <span className="smart-result-progress-pct">{progress}%</span>
            </div>
            <div className="smart-result-progress-track">
              <div
                className="smart-result-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          </div>
        </section>

        {cardVisible ? (
          <div className="smart-result-plan-card smart-result-plan-card--in">
            <div className="smart-result-plan-icon" aria-hidden>
              <Bot className="w-5 h-5" />
            </div>
            <div className="smart-result-plan-body">
              <p className="smart-result-plan-kicker">AI 推荐训练</p>
              <h2 className="smart-result-plan-title">{meta.title}</h2>
              <p className="smart-result-plan-meta">
                {meta.estimatedMinutes} 分钟 · {meta.intensity} · {exerciseCount} 个动作
              </p>
            </div>
          </div>
        ) : null}

        {progressDone ? (
          <div className="smart-result-insights" aria-busy={isTypingPhase}>
            {AI_SEGMENTS.map(({ key, label, icon }, index) => {
              if (activeTextIndex < 0) return null;
              if (!allTypingDone && index > activeTextIndex) return null;

              const fullText = segmentTexts[index];
              const isDone = allTypingDone || index < activeTextIndex;
              const isActive = !allTypingDone && index === activeTextIndex;
              const displayText = isDone ? fullText : isActive ? typedText : "";

              return (
                <section
                  key={key}
                  className={`smart-result-insight-block${isActive ? " smart-result-insight-block--typing" : ""}${isDone ? " smart-result-insight-block--done" : ""}`}
                >
                  <div className="smart-result-insight-head">
                    <span className="smart-result-insight-icon" aria-hidden>
                      {icon}
                    </span>
                    <h3 className="smart-result-insight-title">{label}</h3>
                  </div>
                  <div className="smart-result-insight-card">
                    <p className="smart-result-insight-text">
                      {displayText}
                      {isActive ? <span className="smart-result-type-cursor" aria-hidden /> : null}
                    </p>
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}
      </div>

      {ctaVisible ? (
        <div className="smart-result-cta-wrap smart-result-cta-wrap--in">
          <button type="button" className="smart-result-cta" onClick={onStartToday}>
            开始今天的训练 →
          </button>
        </div>
      ) : null}
    </div>
  );
}
