// src/hooks/useDayLog.ts
import { useEffect, useMemo, useState } from "react";
import type { DayLog, TodoItem, MemoItem } from "../types/setting";
import { getLogByDate, upsertLog } from "../db/godlifeRepository";
import { toDateKey } from "../utils/date";

type Options = {
  readOnly?: boolean;
};

type DayLogState = {
  log: DayLog | null;
  loading: boolean;
};

export function useDayLog(dateKey: string, options: Options = {}) {
  const { readOnly = false } = options;

  const [state, setState] = useState<DayLogState>({
    log: null,
    loading: true,
  });

  // 날짜별 기본 DayLog (모든 필드 기본값 포함)
  const emptyLog: DayLog = useMemo(
    () => ({
      date: dateKey,
      wakeupTime: "",
      runningValue: undefined,
      todos: [],
      diary: "",
      diaryImages: [],
      memos: [],
      score: 0,
    }),
    [dateKey],
  );

  // 해당 날짜 로그 로딩
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const existing = await getLogByDate(dateKey);

        if (cancelled) return;

        setState({
          log: existing ?? emptyLog,
          loading: false,
        });
      } catch (e) {
        console.error("Failed to load day log", e);
        if (!cancelled) {
          setState({
            log: emptyLog,
            loading: false,
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [dateKey, emptyLog]);

  const saveLog = async (partial: Partial<DayLog>) => {
    if (readOnly) return;

    setState((prev) => {
      if (!prev.log) return prev;

      const merged: DayLog = {
        ...prev.log,
        ...partial,
        date: dateKey,
      };

      void upsertLog(merged);

      return { ...prev, log: merged };
    });
  };

  const log = state.log ?? emptyLog;

  // ===== 기상 / 러닝 / 점수 =====
  const wakeupTime = log.wakeupTime ?? "";
  const setWakeupTime = (value: string) => {
    if (readOnly) return;
    saveLog({ wakeupTime: value || "" });
  };

  const runningValue = log.runningValue ?? null;
  const setRunningValue = (value: number | null) => {
    if (readOnly) return;
    saveLog({ runningValue: value ?? undefined });
  };

  const score = log.score ?? 0;
  const setScore = (value: number) => {
    if (readOnly) return;
    saveLog({ score: value });
  };

  // ===== 투두 =====
  const todos: TodoItem[] = log.todos ?? [];
  const setTodos = (next: TodoItem[]) => {
    if (readOnly) return;
    saveLog({ todos: next });
  };

  // ===== 일기 + 사진 =====
  const diary = log.diary ?? "";
  const setDiary = (text: string) => {
    if (readOnly) return;
    saveLog({ diary: text });
  };

  const diaryImages: string[] = log.diaryImages ?? [];
  const addDiaryImage = (dataUrl: string) => {
    if (readOnly) return;
    const next = [...diaryImages, dataUrl].slice(0, 10);
    saveLog({ diaryImages: next });
  };
  const removeDiaryImage = (index: number) => {
    if (readOnly) return;
    const next = diaryImages.filter((_, i) => i !== index);
    saveLog({ diaryImages: next });
  };

  // ===== 메모 =====
  const memos: MemoItem[] = log.memos ?? [];
  const setMemos = (next: MemoItem[]) => {
    if (readOnly) return;
    saveLog({ memos: next });
  };

  const addMemo = () => {
    if (readOnly) return;
    if (memos.length >= 3) return;

    const newMemo: MemoItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: "",
    };

    setMemos([...memos, newMemo]);
  };

  const updateMemo = (id: string, text: string) => {
    if (readOnly) return;
    setMemos(memos.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  const removeMemo = (id: string) => {
    if (readOnly) return;
    setMemos(memos.filter((m) => m.id !== id));
  };

  return {
    loading: state.loading,
    log,

    wakeupTime,
    setWakeupTime,
    runningValue,
    setRunningValue,
    score,
    setScore,

    todos,
    setTodos,

    diary,
    setDiary,
    diaryImages,
    addDiaryImage,
    removeDiaryImage,

    memos,
    addMemo,
    updateMemo,
    removeMemo,
  };
}

// ✅ Today 전용 훅
export function useTodayGoalLog() {
  const todayKey = toDateKey(new Date());
  return useDayLog(todayKey);
}
