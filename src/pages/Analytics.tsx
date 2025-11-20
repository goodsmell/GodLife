import { useState } from "react";
import { useMonthlyStats } from "../hooks/useMonthlyStats";
import MonthlyHeader from "../components/pages/Today/analytics/MonthlyHeader";
import WakeupChart from "../components/pages/Today/analytics/WakeupChart";
import RunningChart from "../components/pages/Today/analytics/RunningChart";
import SummaryCards from "../components/pages/Today/analytics/SummaryCards";
import DayDetailModal, {
  type SelectedInfo,
} from "../components/pages/Today/analytics/DayDetailModal";

function LoadingSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-md space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-slate-200" />
      </div>
    </main>
  );
}

export default function Analytics() {
  const {
    loading,
    monthLabel,
    daysInMonth,
    wakeupSeries,
    runningSeries,
    diaryStats,
    todoStats,
    wakeupTargetMinutes,
    runningTargetMinutes,
    wakeupTargetRatio,
    runningTargetRatio,
    goPrevMonth,
    goNextMonth,
  } = useMonthlyStats();

  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>(null);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-slate-100 px-4 py-6">
      <div className="w-full space-y-4">
        <MonthlyHeader
          monthLabel={monthLabel}
          onPrev={goPrevMonth}
          onNext={goNextMonth}
        />

        <WakeupChart
          wakeupSeries={wakeupSeries}
          daysInMonth={daysInMonth}
          wakeupTargetMinutes={wakeupTargetMinutes}
          wakeupTargetRatio={wakeupTargetRatio}
          onSelect={(day, minutes) =>
            setSelectedInfo({ type: "wakeup", day, minutes })
          }
        />

        <RunningChart
          runningSeries={runningSeries}
          daysInMonth={daysInMonth}
          runningTargetMinutes={runningTargetMinutes}
          runningTargetRatio={runningTargetRatio}
          onSelect={(day, minutes) =>
            setSelectedInfo({ type: "running", day, minutes })
          }
        />

        <SummaryCards diaryStats={diaryStats} todoStats={todoStats} />
      </div>

      <DayDetailModal
        monthLabel={monthLabel}
        selectedInfo={selectedInfo}
        onClose={() => setSelectedInfo(null)}
      />
    </main>
  );
}
