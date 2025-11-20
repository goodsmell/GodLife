import { useEffect, useState } from "react";
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

  // 해당 날짜 로그 로딩
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true }));
      const existing = await getLogByDate(dateKey);
      if (!cancelled) {
        setState({
          log: existing ?? { date: dateKey, score: 0 },
          loading: false,
        });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  const saveLog = async (partial: Partial<DayLog>) => {
    if (readOnly) return;

    setState((prev) => {
      if (!prev.log) return prev;
      const merged: DayLog = { ...prev.log, ...partial, date: dateKey };
      // optimistic update
      void upsertLog(merged);
      return { ...prev, log: merged };
    });
  };

  const log = state.log;

  // ===== 기상 / 러닝 / 점수 =====
  const wakeupTime = log?.wakeupTime ?? "";
  const setWakeupTime = (value: string) => {
    if (readOnly) return;
    saveLog({ wakeupTime: value || undefined });
  };

  const runningValue = log?.runningValue ?? null;
  const setRunningValue = (value: number | null) => {
    if (readOnly) return;
    saveLog({ runningValue: value ?? undefined });
  };

  const score = log?.score ?? 0;
  const setScore = (value: number) => {
    if (readOnly) return;
    saveLog({ score: value });
  };

  // ===== 투두 =====
  const todos: TodoItem[] = log?.todos ?? [];
  const setTodos = (next: TodoItem[]) => {
    if (readOnly) return;
    saveLog({ todos: next });
  };

  // ===== 일기 + 사진 =====
  const diary = log?.diary ?? "";
  const setDiary = (text: string) => {
    if (readOnly) return;
    saveLog({ diary: text.trim() || undefined });
  };

  const diaryImages: string[] = log?.diaryImages ?? [];
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
  const memos: MemoItem[] = log?.memos ?? [];
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

// ✅ 기존 Today 훅을 여기 위에 얇게 감싸도 됨
export function useTodayGoalLog() {
  const todayKey = toDateKey(new Date());
  return useDayLog(todayKey);
}
