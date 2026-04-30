"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrderedExercises, getPhasePlanForExec, type WorkoutExercise } from "@/data/workoutData";

type Props = { onDone: () => void };

export function WorkoutExec({ onDone }: Props) {
  const exercises = getOrderedExercises();
  const phasePlan = getPhasePlanForExec();
  const [exIdx, setExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [restSel, setRestSel] = useState("30s");
  const [restSec, setRestSec] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentExercise: WorkoutExercise = exercises[exIdx];
  const restMap: Record<string, number> = { "30s": 30, "1min": 60, "3min": 180 };

  const finalizeCurrentSet = useCallback(() => {
    setCompletedSets((prev) => (prev.includes(currentSet) ? prev : [...prev, currentSet]));
    if (currentSet < currentExercise.sets - 1) {
      setCurrentSet((prev) => prev + 1);
    }
    setTicking(false);
    setRestSec(0);
  }, [currentSet, currentExercise.sets]);

  function startRest() {
    if (ticking || currentSet >= currentExercise.sets || completedSets.length >= currentExercise.sets) return;
    setRestSec(restMap[restSel]);
    setTicking(true);
  }

  function skipRest() {
    if (!ticking) return;
    finalizeCurrentSet();
  }

  useEffect(() => {
    if (!ticking) return;
    timerRef.current = setTimeout(() => {
      if (restSec <= 1) {
        finalizeCurrentSet();
      } else {
        setRestSec((s) => Math.max(0, s - 1));
      }
    }, 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [ticking, restSec, finalizeCurrentSet]);

  function nextEx() {
    if (completedSets.length < currentExercise.sets) return;
    if (exIdx < exercises.length - 1) {
      setExIdx((i) => i + 1);
      setCurrentSet(0);
      setCompletedSets([]);
      setRestSec(0);
      setTicking(false);
      setEquipmentOpen(false);
    } else {
      onDone();
    }
  }

  const phaseIdx = Math.max(0, phasePlan.findIndex((phase) => phase.exerciseIndexes.includes(exIdx)));
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const getPhaseFill = (index: number) => {
    if (index < phaseIdx) return 100;
    if (index > phaseIdx) return 0;
    const current = phasePlan[index];
    const total = current.exerciseIndexes.length;
    if (total === 0) return 0;
    const localProgress = current.exerciseIndexes.indexOf(exIdx) + 1;
    return Math.round((localProgress / total) * 100);
  };

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="exec-top">
        <div className="sbar" style={{ padding: "0 0 10px" }}><span>9:41</span><span>●●●</span></div>
        <button className="exec-back" type="button" aria-label="返回">←</button>
        <div className="phase-track">
          {phasePlan.map((phase, i) => (
            <div key={phase.label} className={`phase-mini ${i < phaseIdx ? "done" : i === phaseIdx ? "active" : "todo"}`}>
              <span className="phase-mini-lbl">{phase.label}</span>
              <span className="phase-mini-bar">
                <span className="phase-mini-fill" style={{ width: `${getPhaseFill(i)}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="exec-body">
        <div className="exec-main">
          <div className="ex-name">{currentExercise.name}</div>
          <div className="ex-reps">{currentExercise.reps}</div>
          <div className="ex-anim">
            <span className="exercise-placeholder-text">{currentExercise.visualPlaceholder}</span>
          </div>
          <div className="sets-row">
            {Array.from({ length: currentExercise.sets }).map((_, i) => {
              const isDone = completedSets.includes(i);
              const isActive = !isDone && completedSets.length < currentExercise.sets && i === currentSet;
              const baseLabel = `第${["一", "二", "三", "四"][i]}组`;
              return (
                <div key={i} className={`set-btn ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? `✓ ${baseLabel}` : baseLabel}
                </div>
              );
            })}
          </div>
          <div className="exec-rest">
            <div className="rest-top">
              <div className="rest-lbl">组间休息</div>
              <div className="rest-timer">{fmt(restSec)}</div>
              <button className={`rest-go ${ticking ? "skip" : "start"}`} onClick={ticking ? skipRest : startRest} disabled={!ticking && completedSets.length >= currentExercise.sets}>
                {ticking ? "跳过" : "开始"}
              </button>
            </div>
            <div className="rest-opts">
              {["30s", "1min", "3min"].map((o) => (
                <div key={o} className={`rest-opt ${restSel === o ? "sel" : ""}`} onClick={() => !ticking && setRestSel(o)}>
                  {o}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`equip-panel ${equipmentOpen ? "open" : ""}`}>
          <button className="equip-toggle" type="button" onClick={() => setEquipmentOpen((v) => !v)}>
            <span>
              <span className="equip-hint-lbl">器械不会用？查看座椅、握法和重量设置</span>
            </span>
            <span className="equip-hint-arrow">{equipmentOpen ? "▾" : "▸"}</span>
          </button>
          {equipmentOpen && (
            <div className="equip-setup">
              <div className="equip-row"><strong>认机器：</strong>{currentExercise.equipmentGuide.machineIntro}</div>
              <div className="equip-row"><strong>调座椅 / 站位：</strong>{currentExercise.equipmentGuide.seatSetup}</div>
              <div className="equip-row"><strong>姿态：</strong>{currentExercise.equipmentGuide.postureSetup}</div>
              <div className="equip-row"><strong>握法：</strong>{currentExercise.equipmentGuide.gripSetup}</div>
              <div className="equip-row"><strong>重量：</strong>{currentExercise.equipmentGuide.weightTip}</div>
            </div>
          )}
        </div>
        <div className="guide-card">
          <div className="guide-title">动作指引</div>
          <div className="guide-item"><div className="guide-text"><strong>1.</strong> {currentExercise.actionGuide.step1}</div></div>
          <div className="guide-item"><div className="guide-text"><strong>2.</strong> {currentExercise.actionGuide.step2}</div></div>
          <div className="guide-item"><div className="guide-text"><strong>3.</strong> {currentExercise.actionGuide.step3}</div></div>
          <div className="guide-item"><div className="guide-text"><strong>呼吸：</strong>{currentExercise.actionGuide.breathing}</div></div>
          <div className="guide-item"><div className="guide-text"><strong>常见错误：</strong>{currentExercise.commonMistakes}</div></div>
          <div className="guide-item"><div className="guide-text"><strong>平替：</strong>{currentExercise.alternative}</div></div>
        </div>
      </div>
      <div className="nav-btns">
        <div className="nav-prev" style={{ opacity: 0.4, cursor: "default" }}>上一个</div>
        {completedSets.length >= currentExercise.sets && (
          <div className="nav-next" onClick={nextEx}>
            {exIdx < exercises.length - 1 ? "进入下一个动作 →" : "完成训练 🎉"}
          </div>
        )}
      </div>
    </div>
  );
}
