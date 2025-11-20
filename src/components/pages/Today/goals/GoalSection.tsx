import { useEffect, useMemo } from "react";
import { useGodLifeStore } from "../../../../hooks/useGodLifeStore";
import { useTodayGoalLog } from "../../../../hooks/useTodayGoalLog";
import WakeupCard from "./WakeupCard";
import RunningCard from "./RunningCard";
import GoalProgress from "./GoalProgress";
import { parseTimeToMinutes } from "../../../../utils/timeUtils";

type GoalSectionProps = {
  todoScore?: number; 
};

function formatTimeFromStartOfDay(
  startOfDay: { hour: number; minute: number } | null,
  fallback: string,
) {
  if (!startOfDay) return fallback;
  const h = String(startOfDay.hour).padStart(2, "0");
  const m = String(startOfDay.minute).padStart(2, "0");
  return `${h}:${m}`;
}

export default function GoalSection({ todoScore = 0 }: GoalSectionProps) {
  const { state } = useGodLifeStore();
  const { setting, loading: globalLoading } = state;

  const {
    loading: todayLoading,
    wakeupTime,
    setWakeupTime,
    runningValue,
    setRunningValue,
    score,
    setScore,
  } = useTodayGoalLog();

  const isLoading = globalLoading || todayLoading;

  const wakeupGoalTime = formatTimeFromStartOfDay(
    setting?.startOfDay ?? null,
    "07:00",
  );

  const runningGoalType = setting?.runningGoalType ?? "distance";
  const runningGoalValue = setting?.runningGoalValue ?? 3;

  const wakeupScore = useMemo(() => {
    if (isLoading) return 0;

    const goalMinutes = parseTimeToMinutes(wakeupGoalTime);
    const actualMinutes = parseTimeToMinutes(wakeupTime);

    if (goalMinutes === null || actualMinutes === null) return 0;

    return actualMinutes <= goalMinutes ? 1 : 0;
  }, [isLoading, wakeupGoalTime, wakeupTime]);

  const runningScore = useMemo(() => {
    if (isLoading) return 0;

    if (!runningValue || !runningGoalValue || runningGoalValue <= 0) return 0;

    const rate = runningValue / runningGoalValue;
    if (rate < 0) return 0;
    if (rate > 1) return 1;
    return rate;
  }, [isLoading, runningValue, runningGoalValue]);

  const totalPercent = useMemo(() => {
    if (isLoading) return 0;

    const clampedTodo = todoScore < 0 ? 0 : todoScore > 1 ? 1 : todoScore;

    const avg = (wakeupScore + runningScore + clampedTodo) / 3;
    return Math.round(avg * 100);
  }, [isLoading, wakeupScore, runningScore, todoScore]);

  useEffect(() => {
    if (isLoading) return;

    if (score !== totalPercent) {
      setScore(totalPercent);
    }
  }, [isLoading, score, totalPercent, setScore]);

  if (isLoading) {
    return (
      <section className="w-full space-y-3">
        <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
      </section>
    );
  }

  return (
    <section className="w-full space-y-3">
      <WakeupCard
        goalTime={wakeupGoalTime}
        wakeupTime={wakeupTime}
        onChangeWakeupTime={setWakeupTime}
      />

      <RunningCard
        goalType={runningGoalType}
        goalValue={runningGoalValue}
        runningValue={runningValue}
        onChangeRunningValue={setRunningValue}
      />

      <GoalProgress
        wakeupScore={wakeupScore}
        runningScore={runningScore}
        todoScore={todoScore}
      />
    </section>
  );
}

