"use client";

import { useEffect, useMemo, useState } from "react";
import { getTrainingRecords, type TrainingRecord } from "@/utils/trainingRecordStorage";

type Props = { onHome: () => void; onTraining: () => void };

const CHALLENGE_GOAL_HOURS = 100;
type RecordView = TrainingRecord & { date?: string; workoutName?: string };

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatHoursValue(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return rounded.toFixed(1).replace(/\.0$/, "");
}

function localDayParts(iso: string): { y: number; m: number; d: number } | null {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
}

function getRecordDate(record: RecordView): string {
  return typeof record.date === "string" && record.date ? record.date : record.completedAt;
}

function getWorkoutName(record: RecordView): string {
  return typeof record.workoutName === "string" && record.workoutName.trim() ? record.workoutName : record.workoutTitle;
}

function formatRecordTime(raw: string): string {
  const t = new Date(raw);
  if (Number.isNaN(t.getTime())) return "时间未知";
  return `${t.getMonth() + 1}月${t.getDate()}日 ${pad2(t.getHours())}:${pad2(t.getMinutes())}`;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** 从今天或昨天起向前数连续有训练的天数（今天未练则从昨天开始） */
function computeStreak(records: RecordView[]): number {
  const dayKeys = new Set<string>();
  for (const r of records) {
    const p = localDayParts(getRecordDate(r));
    if (!p) continue;
    dayKeys.add(`${p.y}-${pad2(p.m)}-${pad2(p.d)}`);
  }
  const anchor = new Date();
  anchor.setHours(0, 0, 0, 0);
  if (!dayKeys.has(dayKey(anchor))) anchor.setDate(anchor.getDate() - 1);
  let streak = 0;
  const cur = new Date(anchor);
  for (let i = 0; i < 400; i++) {
    if (dayKeys.has(dayKey(cur))) {
      streak += 1;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  return streak;
}

function feelingEmoji(feeling?: string): string {
  if (feeling === "很好") return "💪";
  if (feeling === "平稳") return "👌";
  if (feeling === "有点累") return "😮‍💨";
  return "💪";
}

const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"] as const;

function buildCalendarCells(year: number, month: number): ({ day: number } | { pad: true })[] {
  const first = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const mondayFirst = (first.getDay() + 6) % 7;
  const cells: ({ day: number } | { pad: true })[] = [];
  for (let i = 0; i < mondayFirst; i++) cells.push({ pad: true });
  for (let d = 1; d <= lastDate; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ pad: true });
  return cells;
}

export function Record({ onHome, onTraining }: Props) {
  const [records, setRecords] = useState<RecordView[]>([]);
  const [showAllRecent, setShowAllRecent] = useState(false);

  useEffect(() => {
    setRecords(getTrainingRecords());
  }, []);

  const now = useMemo(() => new Date(), []);
  const viewYear = now.getFullYear();
  const viewMonth = now.getMonth() + 1;

  const derived = useMemo(() => {
    const sorted = [...records].sort((a, b) => new Date(getRecordDate(b)).getTime() - new Date(getRecordDate(a)).getTime());
    const totalMinutes = sorted.reduce((acc, r) => {
      const m = r.durationMinutes;
      return acc + (typeof m === "number" && Number.isFinite(m) ? m : 0);
    }, 0);
    const totalHours = totalMinutes / 60;
    const remainingHours = Math.max(0, CHALLENGE_GOAL_HOURS - totalHours);
    const barPct = Math.min(100, (totalHours / CHALLENGE_GOAL_HOURS) * 100);

    // 本月次数按记录条数计算：同一天多次训练会累计多次
    const monthCount = records.filter((r) => {
      const p = localDayParts(getRecordDate(r));
      return p && p.y === viewYear && p.m === viewMonth;
    }).length;

    const trainedDays = new Set<number>();
    for (const r of sorted) {
      const p = localDayParts(getRecordDate(r));
      if (p && p.y === viewYear && p.m === viewMonth) trainedDays.add(p.d);
    }

    // 最近一次：按 date(无则 completedAt) 新到旧排序后的第一条
    const latest = sorted[0];
    const lastLabel =
      latest && typeof latest.durationMinutes === "number" && Number.isFinite(latest.durationMinutes)
        ? `${latest.durationMinutes}′`
        : "--";

    const streak = computeStreak(sorted);

    return {
      sorted,
      totalHours,
      hasProgress: totalMinutes > 0,
      remainingHours,
      barPct,
      monthCount,
      trainedDays,
      lastLabel,
      streak,
    };
  }, [records, viewYear, viewMonth]);

  const calendarCells = useMemo(() => buildCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const isToday = (day: number) =>
    now.getFullYear() === viewYear && now.getMonth() + 1 === viewMonth && now.getDate() === day;

  const recent30Days = useMemo(() => {
    const cutoff = new Date(now);
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - 30);
    return derived.sorted.filter((r) => new Date(getRecordDate(r)).getTime() >= cutoff.getTime());
  }, [derived.sorted, now]);

  const canExpandRecent = recent30Days.length > 5;
  const visibleRecent = showAllRecent ? recent30Days : derived.sorted.slice(0, 5);

  const toggleRecentList = () => {
    if (!canExpandRecent) return;
    setShowAllRecent((prev) => !prev);
  };

  return (
    <div className="page record-screen">
      <div className="sbar">
        <span>9:41</span>
      </div>

      <div className="record-scroll">
        <div className="record-inner">
          <header className="record-hero">
            <p className="record-kicker">我的成长</p>
            <h1 className="record-page-title">训练记录</h1>
          </header>

          <div className="record-stat-row">
            <div className="record-stat-card">
              <div className="record-stat-val">{derived.monthCount}</div>
              <div className="record-stat-lbl">本月次数</div>
            </div>
            <div className="record-stat-card">
              <div className="record-stat-val">{derived.lastLabel}</div>
              <div className="record-stat-lbl">最近一次</div>
            </div>
            <div className="record-stat-card">
              <div className="record-stat-val record-stat-val--fire">
                {derived.streak}
                <span className="record-stat-fire" aria-hidden>
                  🔥
                </span>
              </div>
              <div className="record-stat-lbl">连续天数</div>
            </div>
          </div>

          <div className="mcard record-challenge">
            <div className="mtop">
              <div className="mlbl">🏆 百小时挑战</div>
              <div className="mval">
                {derived.hasProgress ? `${formatHoursValue(derived.totalHours)} / ${CHALLENGE_GOAL_HOURS}h` : `0 / ${CHALLENGE_GOAL_HOURS}h`}
              </div>
            </div>
            <div className="ptrack">
              <div className="pfill" style={{ width: `${derived.barPct}%` }} />
            </div>
            <div className="msub">
              {derived.hasProgress
                ? `再坚持 ${formatHoursValue(derived.remainingHours)} 小时解锁成就徽章`
                : "完成第一次训练，开始累计你的百小时挑战"}
            </div>
          </div>

          <div className="record-glass-card record-cal-card">
            <div className="record-cal-title">
              {viewMonth}月 打卡
            </div>
            <div className="record-cal-week">
              {WEEK_LABELS.map((w) => (
                <div key={w} className="record-cal-wd">
                  {w}
                </div>
              ))}
            </div>
            <div className="record-cal-grid">
              {calendarCells.map((cell, idx) => {
                if ("pad" in cell) {
                  return <div key={`p-${idx}`} className="record-cal-cell record-cal-cell--pad" aria-hidden />;
                }
                const { day } = cell;
                const trained = derived.trainedDays.has(day);
                const today = isToday(day);
                return (
                  <div
                    key={day}
                    className={`record-cal-cell${trained ? " record-cal-cell--done" : ""}${today ? " record-cal-cell--today" : ""}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <section className="record-recent">
            <div className="record-recent-head">
              <h2 className="record-recent-title">最近训练</h2>
              <button type="button" className="record-recent-all" onClick={toggleRecentList}>
                {showAllRecent ? "收起" : "全部"}
              </button>
            </div>
            {visibleRecent.length === 0 ? (
              <p className="record-recent-empty">还没有训练记录</p>
            ) : (
              <ul className="record-recent-list">
                {visibleRecent.map((r) => (
                  <li key={r.id} className="record-item">
                    <div className="record-item-icon" aria-hidden>
                      {feelingEmoji(r.feeling)}
                    </div>
                    <div className="record-item-body">
                      <div className="record-item-name">{getWorkoutName(r)}</div>
                      <div className="record-item-meta">
                        {r.durationMinutes}分钟 · {r.totalSets}组{r.feeling ? ` · ${r.feeling}` : ""}
                      </div>
                      <div className="record-item-time">{formatRecordTime(getRecordDate(r))}</div>
                    </div>
                    <div className="record-item-dur">{r.durationMinutes}′</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <div className="bnav">
        {[
          { icon: "🏠", lbl: "首页", click: onHome },
          { icon: "📋", lbl: "训练", click: onTraining },
          { icon: "📊", lbl: "记录", on: true },
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
