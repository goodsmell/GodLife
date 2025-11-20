import { useMemo, useState } from "react";
import { useGodLifeStore } from "./useGodLifeStore";
import type { DayLog, TodoItem } from "../types/setting";
import { fromDateKey, formatYearMonthLabel } from "../utils/date";
import { parseTimeToMinutes } from "../utils/timeUtils";

// =============== 공통 유틸 ===============
export function formatMinutesToHHMM(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatMinutesToHourText(minutes: number) {
  if (minutes === 0) return "0분";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

function isLogInMonth(log: DayLog, year: number, monthIndex: number) {
  const date = fromDateKey(log.date);
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// =============== 타입들 ===============
export type WakeupPoint = {
  day: number;
  minutes: number;
  hasData: boolean;
  value: number;
};

export type WakeupSeries = {
  data: WakeupPoint[];
  max: number;
  hasAnyData: boolean;
  avgMinutes: number;
  earliestMinutes: number;
  latestMinutes: number;
};

export type RunningPoint = {
  day: number;
  value: number;
};

export type RunningSeries = {
  data: RunningPoint[];
  max: number;
  totalMinutes: number;
  avgMinutes: number;
};

export type DiaryStats = {
  daysWithDiary: number;
  totalDays: number;
  percent: number;
};

export type TodoStats = {
  total: number;
  done: number;
  undone: number;
  donePercent: number;
};

// =============== 메인 훅 ===============
export function useMonthlyStats() {
  const { state } = useGodLifeStore();
  const { logs, loading } = state;

  const today = new Date();
  const [year, setYear] = useState(() => today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(() => today.getMonth()); // 0-based

  const monthLabel = formatYearMonthLabel(year, monthIndex);

  // 목표 설정 값
  const wakeupTargetStr = state.setting?.startOfDay?.hour ?? 7; // 시 단위
  const runningTargetMinutesRaw = state.setting?.runningGoalValue ?? 30; // 분 단위라고 가정

  const WAKEUP_TARGET_MINUTES =
    parseTimeToMinutes(`${wakeupTargetStr}:00`) ?? wakeupTargetStr * 60;
  const RUNNING_TARGET_MINUTES = runningTargetMinutesRaw;

  // 월 이동
  const goPrevMonth = () => {
    const d = new Date(year, monthIndex - 1, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  };

  const goNextMonth = () => {
    const now = new Date();
    const current = new Date(year, monthIndex, 1);

    // 현재 월보다 이후로는 못 가게 막기
    if (
      current.getFullYear() > now.getFullYear() ||
      (current.getFullYear() === now.getFullYear() &&
        current.getMonth() >= now.getMonth())
    ) {
      return;
    }

    const d = new Date(year, monthIndex + 1, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  };

  // 이 달 로그 필터링
  const monthLogs = useMemo(
    () => logs.filter((log) => isLogInMonth(log, year, monthIndex)),
    [logs, year, monthIndex],
  );

  const daysInMonth = getDaysInMonth(year, monthIndex);

  // ===== 기상 시간 시리즈 =====
  const wakeupSeries: WakeupSeries = useMemo(() => {
    const latest = 24 * 60; // 1440분 = 24시간
    const arr: WakeupPoint[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      minutes: 0,
      hasData: false,
      value: 0,
    }));

    monthLogs.forEach((log) => {
      if (!log.wakeupTime) return;
      const minutes = parseTimeToMinutes(log.wakeupTime);
      if (minutes === null) return;

      const date = fromDateKey(log.date);
      const day = date.getDate();
      const index = day - 1;

      arr[index].minutes = minutes;
      arr[index].hasData = true;
    });

    let hasAnyData = false;
    let sumMinutes = 0;
    let countDays = 0;
    let earliest = Infinity;
    let latestTime = 0;

    const transformed = arr.map((d) => {
      if (!d.hasData) {
        return { ...d, value: 0 };
      }

      hasAnyData = true;
      sumMinutes += d.minutes;
      countDays += 1;

      if (d.minutes < earliest) earliest = d.minutes;
      if (d.minutes > latestTime) latestTime = d.minutes;

      // 0시 = 0, 12시 = 720, 24시 = 1440 (그대로 사용)
      const value = d.minutes;
      return { ...d, value };
    });

    const max = hasAnyData ? latest : 0;
    const avgMinutes = countDays > 0 ? Math.round(sumMinutes / countDays) : 0;

    return {
      data: transformed,
      max,
      hasAnyData,
      avgMinutes,
      earliestMinutes: earliest === Infinity ? 0 : earliest,
      latestMinutes: latestTime,
    };
  }, [monthLogs, daysInMonth]);

  // ===== 러닝 시리즈 =====
  const runningSeries: RunningSeries = useMemo(() => {
    const arr: RunningPoint[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      value: 0,
    }));

    monthLogs.forEach((log) => {
      if (typeof log.runningValue === "number") {
        const date = fromDateKey(log.date);
        const day = date.getDate();
        const index = day - 1;
        arr[index].value += log.runningValue;
      }
    });

    let total = 0;
    let dayCountWithRun = 0;

    const max = arr.reduce((m, d) => {
      if (d.value > 0) {
        total += d.value;
        dayCountWithRun += 1;
      }
      return d.value > m ? d.value : m;
    }, 0);

    const avg = dayCountWithRun > 0 ? Math.round(total / dayCountWithRun) : 0;

    return {
      data: arr,
      max,
      totalMinutes: total,
      avgMinutes: avg,
    };
  }, [monthLogs, daysInMonth]);

  // ===== 일기 통계 =====
  const diaryStats: DiaryStats = useMemo(() => {
    const daysWithDiary = monthLogs.filter(
      (log) => !!log.diary && log.diary.trim().length > 0,
    ).length;

    const totalDays = daysInMonth;
    const percent =
      totalDays === 0 ? 0 : Math.round((daysWithDiary / totalDays) * 100);

    return { daysWithDiary, totalDays, percent };
  }, [monthLogs, daysInMonth]);

  // ===== 투두 통계 =====
  const todoStats: TodoStats = useMemo(() => {
    let total = 0;
    let done = 0;

    monthLogs.forEach((log) => {
      (log.todos ?? []).forEach((t: TodoItem) => {
        total += 1;
        if (t.done) done += 1;
      });
    });

    const undone = total - done;
    const donePercent = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, undone, donePercent };
  }, [monthLogs]);

  // ===== 목표선 비율 =====
  const wakeupTargetRatio =
    wakeupSeries.max > 0
      ? Math.min(WAKEUP_TARGET_MINUTES / wakeupSeries.max, 1)
      : 0;

  const runningTargetRatio =
    runningSeries.max > 0
      ? Math.min(RUNNING_TARGET_MINUTES / runningSeries.max, 1)
      : 0;

  return {
    loading,
    monthLabel,
    daysInMonth,
    wakeupSeries,
    runningSeries,
    diaryStats,
    todoStats,
    wakeupTargetMinutes: WAKEUP_TARGET_MINUTES,
    runningTargetMinutes: RUNNING_TARGET_MINUTES,
    wakeupTargetRatio,
    runningTargetRatio,
    goPrevMonth,
    goNextMonth,
  };
}
