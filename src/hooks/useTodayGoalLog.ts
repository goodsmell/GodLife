import { useEffect, useState } from "react";
import type { DayLog, StartOfDay, TodoItem } from "../types/setting";
import { useGodLifeStore } from "./useGodLifeStore"; // 네가 만든 훅 경로에 맞게 수정

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getLogicalToday(startOfDay: StartOfDay | null): string {
  const now = new Date();

  if (!startOfDay) {
    return formatDate(now);
  }

  const sod = new Date(now);
  sod.setHours(startOfDay.hour, startOfDay.minute, 0, 0);

  // 시작 시간 이전이면 전날로 편입
  if (now < sod) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  }

  return formatDate(now);
}

export function useTodayGoalLog() {
  const { state, saveDayLog, getTodayLog } = useGodLifeStore();
  const { setting, loading: globalLoading } = state;

  const [date, setDate] = useState<string | null>(null);
  const [log, setLog] = useState<DayLog | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) setting 로딩이 끝나면, 오늘 날짜 계산
  useEffect(() => {
    if (globalLoading) return;

    const logicalDate = getLogicalToday(setting?.startOfDay ?? null);
    setDate(logicalDate);
  }, [globalLoading, setting?.startOfDay]);

  // 2) 날짜가 정해지면 DayLog 로드 or 생성
  useEffect(() => {
    if (!date) return;

    let cancelled = false;

    async function load() {
      const existing = await getTodayLog(date ?? "");

      if (cancelled) return;

      if (existing) {
        setLog(existing);
      } else {
        const newLog: DayLog = {
          date: date ?? "",
          score: 0,
        };
        await saveDayLog(newLog);
        const saved = await getTodayLog(date ?? "");
        setLog(saved ?? newLog);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [date, getTodayLog, saveDayLog]);

  const updateLog = async (patch: Partial<DayLog>) => {
    if (!log) return;
    const updated: DayLog = { ...log, ...patch };
    await saveDayLog(updated);
    setLog(updated);
  };

  const todos: TodoItem[] = log?.todos ?? [];

  const setTodos = (next: TodoItem[]) => {
    updateLog({ todos: next });
  };

  return {
    loading: loading || globalLoading || !date || !log,
    date: date ?? "",
    log,

    wakeupTime: log?.wakeupTime ?? "",
    setWakeupTime: (time: string) => updateLog({ wakeupTime: time }),

    runningValue: log?.runningValue ?? null,
    setRunningValue: (value: number | null) =>
      updateLog({ runningValue: value ?? undefined }),

    score: log?.score ?? 0,
    setScore: (score: number) => updateLog({ score }),
    todos,
    setTodos,
  };
}
