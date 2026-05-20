"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
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

const AI_SEGMENTS: { key: keyof SmartResultCopy; label: string }[] = [
  { key: "reason", label: "我看到了你的状态" },
  { key: "knowledge", label: "所以推荐这套训练" },
  { key: "tip", label: "今天训练时注意" },
];

const SEGMENT_COUNT = AI_SEGMENTS.length;
const PROGRESS_MS = 1500;
const SESSION_FALLBACK_MS = 6000;
const CARD_REVEAL_DELAY_MS = 180;
const TYPING_START_DELAY_MS = 320;
const TARGET_TYPING_MS = 4200;

const PROGRESS_LABELS = [
  "正在分析状态…",
  "匹配训练模板…",
  "生成建议中…",
  "完成 ✓",
] as const;

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
  return [copy.reason, copy.knowledge, copy.tip];
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

  const forceCompleteAll = useCallback(() => {
    if (forcedCompleteRef.current) return;
    forcedCompleteRef.current = true;
    setProgress(100);
    setProgressStep(3);
    setProgressDone(true);
    setCardVisible(true);
    setActiveTextIndex(SEGMENT_COUNT);
    setTypedText("");
    setCtaVisible(true);
  }, []);

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

      if (ratio >= 0.26) setProgressStep(1);
      if (ratio >= 0.55) setProgressStep(2);
      if (ratio >= 0.82) setProgressStep(3);

      if (elapsed >= PROGRESS_MS) {
        window.clearInterval(progressTick);
        setProgress(100);
        setProgressStep(3);
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
    };
  }, [copySessionKey, copy, forceCompleteAll]);

  useEffect(() => {
    if (!progressDone || !cardVisible || !copy) return;
    if (forcedCompleteRef.current) return;
    if (activeTextIndex < 0 || activeTextIndex >= SEGMENT_COUNT) return;

    const fullText = segmentTextsRef.current[activeTextIndex] ?? "";

    if (typedText.length >= fullText.length) {
      if (activeTextIndex + 1 >= SEGMENT_COUNT) {
        setCtaVisible(true);
        setActiveTextIndex(SEGMENT_COUNT);
        setTypedText("");
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
  }, [progressDone, cardVisible, copy, activeTextIndex, typedText]);

  if (!selection || !template || !copy) {
    return null;
  }

  const exerciseCount = countTemplateExercises(template);
  const { meta } = template;
  const segmentTexts = segmentTextsFromCopy(copy);
  const allTypingDone = activeTextIndex >= SEGMENT_COUNT;
  const isTypingPhase = progressDone && !allTypingDone;

  return (
    <div className="page smart-result-screen">
      <div className="smart-result-particles" aria-hidden />
      <StatusBar style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }} />

      <div className="smart-result-hero">
        <button type="button" className="smart-result-back" onClick={onBack} aria-label="返回">
          ←
        </button>
        <div className="smart-result-hero-badge">
          <Sparkles className="w-3.5 h-3.5" aria-hidden />
          智能推荐
        </div>
        <h1 className="smart-result-hero-title">正在为你生成</h1>
        <p className="smart-result-hero-sub">根据今日状态，匹配训练与建议</p>
        <div className="smart-result-tags">
          <span className="smart-result-tag">{cycleChipText(selection.cycleStatus)}</span>
          <span className="smart-result-tag">{energyChipText(selection.energyLevel)}</span>
        </div>
      </div>

      <div className="smart-result-scroll">
        <section
          className={`smart-result-progress-card${progressDone ? " smart-result-progress-card--done" : ""}`}
          aria-live="polite"
        >
          <div className="smart-result-progress-head">
            <span className="smart-result-progress-label">AI 生成中</span>
            <span className="smart-result-progress-pct">{progress}%</span>
          </div>
          <div className="smart-result-progress-track">
            <div
              className="smart-result-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="smart-result-progress-status">{PROGRESS_LABELS[progressStep]}</p>
        </section>

        {cardVisible ? (
          <div className="smart-result-plan-card smart-result-plan-card--in">
            <div className="smart-result-plan-icon" aria-hidden>
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="smart-result-plan-title">{meta.title}</h2>
            <p className="smart-result-plan-meta">
              {meta.estimatedMinutes} 分钟 · {meta.intensity} · {exerciseCount} 个动作
            </p>
            <p className="smart-result-plan-desc">{meta.description}</p>
          </div>
        ) : null}

        {progressDone ? (
          <article className="smart-result-ai-card" aria-busy={isTypingPhase}>
            <h2 className="smart-result-ai-heading">AI 今日建议</h2>
            <div className="smart-result-ai-body">
              {AI_SEGMENTS.map(({ key, label }, index) => {
                if (activeTextIndex < 0) return null;
                if (!allTypingDone && index > activeTextIndex) return null;

                const fullText = segmentTexts[index];
                const isDone = allTypingDone || index < activeTextIndex;
                const isActive = !allTypingDone && index === activeTextIndex;
                const displayText = isDone ? fullText : isActive ? typedText : "";

                return (
                  <section
                    key={key}
                    className={`smart-result-ai-segment${isActive ? " smart-result-ai-segment--typing" : ""}${isDone ? " smart-result-ai-segment--done" : ""}`}
                  >
                    <h3 className="smart-result-ai-segment-label">{label}</h3>
                    <p className="smart-result-ai-segment-text">
                      {displayText}
                      {isActive ? <span className="smart-result-type-cursor" aria-hidden /> : null}
                    </p>
                  </section>
                );
              })}
            </div>
          </article>
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
