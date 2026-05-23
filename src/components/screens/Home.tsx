"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Home as HomeIcon, ClipboardList, BarChart3, Flower2, Hand, Medal, Sparkles, Trophy, Zap } from "lucide-react";
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
import { DayDetailSheet } from "@/components/DayDetailSheet";
import { dayMarkerState } from "@/utils/calendarDayMarkers";
import {
  CYCLE_RECORDS_UPDATED_EVENT,
  getPeriodDateKeys,
} from "@/utils/cycleRecordStorage";
import { toDateKey } from "@/utils/dayKey";
import { getTrainingRecords } from "@/utils/trainingRecordStorage";
import { StatusBar } from "@/components/StatusBar";

type Props = {
  onStart: () => void;
  onTraining: () => void;
  onRecords: () => void;
  onReSelect: () => void;
};

const CHALLENGE_GOAL_HOURS = 100;
const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"] as const;

type WeekDayCell = {
  label: string;
  day: number;
  dateKey: string;
  isToday: boolean;
};

function getWeekDays(anchor = new Date()): WeekDayCell[] {
  const today = new Date(anchor);
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return WEEK_LABELS.map((label, index) => {
    const cell = new Date(monday);
    cell.setDate(monday.getDate() + index);
    const dateKey = toDateKey(cell);
    return {
      label,
      day: cell.getDate(),
      dateKey,
      isToday: dateKey === toDateKey(today),
    };
  });
}

/** 四舍五入到 1 位小数；去掉末尾 `.0`（如 5.0 → 5；0.0 → 0；0.8 保留） */
function formatHoursValue(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  return rounded.toFixed(1).replace(/\.0$/, "");
}

function countTemplateExercises(t: WorkoutTemplate): number {
  const { warmup, strength, cardio, stretch } = t.workoutByPhase;
  return warmup.length + strength.length + cardio.length + stretch.length;
}

function cycleChipText(status: CycleStatus): string {
  const map: Record<CycleStatus, string> = {
    not_period: "不在经期",
    period: "经期中",
    uncertain: "不确定",
  };
  return map[status];
}

function energyChipText(level: EnergyLevel): string {
  const map: Record<EnergyLevel, string> = {
    high: "精力不错",
    normal: "状态一般",
    low: "有点累",
  };
  return map[level];
}

const statusBarShellStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  background: "#ffffff",
  border: "1px solid rgba(228, 224, 238, 0.86)",
  borderRadius: 16,
  padding: "7px 12px",
  boxShadow: "0 2px 12px rgba(74, 63, 92, 0.07)",
};

/** 与本周计划 `.dnum.today`（var(--lime)）同一绿色体系，低饱和、偏柔和 */
const chipDotStyle: CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "var(--plum)",
  flexShrink: 0,
};

const chipBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "3px 9px",
  borderRadius: 999,
  background: "var(--blush)",
  border: "1px solid #e8d0dc",
  color: "var(--plum)",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.25,
};

export function Home({ onStart, onTraining, onRecords, onReSelect }: Props) {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [selection, setSelection] = useState<CurrentWorkoutSelectionV1 | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [cycleRevision, setCycleRevision] = useState(0);

  useEffect(() => {
    const records = getTrainingRecords();
    const sum = records.reduce((acc, r) => {
      const m = r.durationMinutes;
      return acc + (typeof m === "number" && Number.isFinite(m) ? m : 0);
    }, 0);
    setTotalMinutes(sum);
    setSelection(loadCurrentWorkoutSelection());
  }, []);

  const weekDays = useMemo(() => getWeekDays(), []);

  const trainingDateKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const r of getTrainingRecords()) {
      const t = new Date(r.completedAt);
      if (!Number.isNaN(t.getTime())) keys.add(toDateKey(t));
    }
    return keys;
  }, [totalMinutes]);

  const periodDateKeys = useMemo(() => getPeriodDateKeys(), [cycleRevision]);

  useEffect(() => {
    const onCycleRecordsUpdated = () => setCycleRevision((n) => n + 1);
    window.addEventListener(CYCLE_RECORDS_UPDATED_EVENT, onCycleRecordsUpdated);
    return () => window.removeEventListener(CYCLE_RECORDS_UPDATED_EVENT, onCycleRecordsUpdated);
  }, []);

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
  const planBadge = selection?.selectedTraining === "smart" ? "智能匹配 · 今日推荐" : "今日计划";
  const PlanBadgeIcon = selection?.selectedTraining === "smart" ? Sparkles : Zap;

  return (
    <div className="page home-screen">
      <StatusBar />
      <div className="hdr">
        <div>
          <div className="home-greeting">
            欢迎回来
            <span className="inline-icon-badge" aria-hidden>
              <Hand className="w-3.5 h-3.5" />
            </span>
          </div>
          <div
            className="t-title"
            style={{ fontSize: 26, ...(selection ? { marginBottom: 14 } : {}) }}
          >
            今日训练
          </div>
        </div>
        <div className="av">
          <Flower2 className="w-5 h-5" />
        </div>
      </div>
      {selection && (
        <div style={{ padding: "0 28px 8px" }}>
          <div style={statusBarShellStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: 6,
                flex: 1,
                minWidth: 0,
              }}
            >
              <span style={chipBaseStyle}>
                <span style={chipDotStyle} aria-hidden />
                {cycleChipText(selection.cycleStatus)}
              </span>
              <span style={chipBaseStyle}>
                <span style={chipDotStyle} aria-hidden />
                {energyChipText(selection.energyLevel)}
              </span>
            </div>
            <button
              type="button"
              onClick={onReSelect}
              style={{
                flexShrink: 0,
                border: "none",
                background: "transparent",
                color: "var(--gray)",
                borderRadius: 10,
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              更新今日状态
            </button>
          </div>
        </div>
      )}
      <div
        className="wcard"
        style={{
          paddingTop: 26,
          paddingBottom: 28,
          minHeight: 248,
        }}
      >
        <div className="wtag">
          <PlanBadgeIcon className="w-3.5 h-3.5" />
          {selection ? planBadge : "今日计划"}
        </div>
        <div className="wname">{planTitle}</div>
        <div className="wmeta">{`${planMinutes}分钟 · ${planIntensity} · ${planExerciseCount}个动作`}</div>
        <button className="wbtn" onClick={onStart}>
          开始训练
        </button>
        <div className="wbig">{`${planMinutes}’`}</div>
      </div>
      <div className="sec-row">
        <div className="t-sec">本周进度</div>
        <button type="button" className="see-all" onClick={onRecords}>
          查看全部
        </button>
      </div>
      <div className="wstrip">
        {weekDays.map((d) => {
          const markers = dayMarkerState(
            d.dateKey,
            trainingDateKeys.has(d.dateKey),
            periodDateKeys.has(d.dateKey),
          );
          const dnumClass = [
            "dnum",
            d.isToday ? "today" : "",
            markers.trainedOnCircle ? "dnum--trained" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              type="button"
              key={d.dateKey}
              className="dcell"
              onClick={() => {
                setSelectedDateKey(d.dateKey);
                setSheetOpen(true);
              }}
            >
              <div className="dname">{d.label}</div>
              <div className={dnumClass}>{d.day}</div>
              {markers.showPeriodDot || markers.showTrainingDot ? (
                <div className="dcell-dots">
                  {markers.showTrainingDot ? <div className="ddot" aria-hidden /> : null}
                  {markers.showPeriodDot ? (
                    <div className="ddot ddot--cycle" aria-hidden />
                  ) : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mcard">
        <div className="mtop">
          <div className="mlbl icon-label">
            <Trophy className="w-4 h-4" />
            百小时挑战
          </div>
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
            ? (
                <>
                  再坚持 {formatHoursValue(remainingHours)} 小时，解锁成就徽章
                  <Medal className="inline-lucide-icon" aria-hidden />
                </>
              )
            : "完成第一次训练，开始累计你的百小时挑战"}
        </div>
      </div>
      <DayDetailSheet
        open={sheetOpen}
        dateKey={selectedDateKey}
        onClose={() => setSheetOpen(false)}
        onCycleUpdated={() => setCycleRevision((n) => n + 1)}
      />

      <div className="bnav">
        {[
          { icon: HomeIcon, lbl: "首页", on: true },
          { icon: ClipboardList, lbl: "训练", click: onTraining },
          { icon: BarChart3, lbl: "记录", click: onRecords },
        ].map((n) => (
          <div key={n.lbl} className={`ni ${n.on ? "on" : ""}`} onClick={n.click}>
            <div className="nicon">
              {(() => {
                const Icon = n.icon;
                return <Icon className="w-5 h-5" />;
              })()}
            </div>
            <div className="nlbl">{n.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
