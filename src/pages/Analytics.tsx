import { useMemo, useState } from "react";
import { useGodLifeStore } from "../hooks/useGodLifeStore";
import type { DayLog } from "../types/setting";
import { fromDateKey, formatYearMonthLabel } from "../utils/date";
import { parseTimeToMinutes } from "../utils/timeUtils";

function isLogInMonth(log: DayLog, year: number, monthIndex: number) {
  const date = fromDateKey(log.date);
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function MonthlyStatsPage() {
  const { state } = useGodLifeStore();
  const { logs, loading } = state;

  const today = new Date();

  const [year, setYear] = useState(() => today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(() => today.getMonth()); // 0-based

  const monthLabel = formatYearMonthLabel(year, monthIndex);

  // 🔹 월 변경 버튼
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

  // 🔹 이 달의 로그만 필터링
  const monthLogs = useMemo(
    () => logs.filter((log) => isLogInMonth(log, year, monthIndex)),
    [logs, year, monthIndex],
  );

  const daysInMonth = getDaysInMonth(year, monthIndex);

  // =============================
  // 기상 시간 그래프용 데이터
  // =============================
  const wakeupSeries = useMemo(() => {
    const arr = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      minutes: 0,
      hasData: false,
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

    // 시각(분)을 그래프용 값으로 변환 (더 일찍 일어날수록 바 높게 보이고 싶으면 반대로)
    const transformed = arr.map((d) => {
      if (!d.hasData) return { ...d, value: 0 };
      const latest = 24 * 60; // 1440
      const value = latest - d.minutes; // 일찍 일어날수록 값이 큼
      return { ...d, value };
    });

    const max = transformed.reduce((m, d) => (d.value > m ? d.value : m), 0);

    return { data: transformed, max };
  }, [monthLogs, daysInMonth]);

  // =============================
  // 러닝 그래프용 데이터
  // =============================
  const runningSeries = useMemo(() => {
    // day: 1~daysInMonth 까지 채우기
    const arr = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      value: 0,
    }));

    monthLogs.forEach((log) => {
      if (typeof log.runningValue === "number") {
        const date = fromDateKey(log.date);
        const day = date.getDate();
        const index = day - 1;
        // 같은 날 여러 번 저장되어도 합산
        arr[index].value += log.runningValue;
      }
    });

    const max = arr.reduce((m, d) => (d.value > m ? d.value : m), 0);
    return { data: arr, max };
  }, [monthLogs, daysInMonth]);

  if (loading) {
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

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-6">
      <div className="w-full max-w-md space-y-4">
        {/* 상단: 월 선택 바 */}
        <section className="flex items-center justify-between">
          <button
            type="button"
            onClick={goPrevMonth}
            className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50"
          >
            ◀
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-400">월간 갓생 분석</p>
            <p className="text-base font-semibold text-gray-800">
              {monthLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={goNextMonth}
            className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50"
          >
            ▶
          </button>
        </section>

        {/* 기상 시간 그래프 */}
        <section className="w-full rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            기상 시간 (일별)
          </h3>
          {wakeupSeries.max === 0 ? (
            <p className="text-xs text-gray-400">
              이 달에는 기상 시간이 기록되지 않았어요.
            </p>
          ) : (
            <div className="flex h-32 items-end gap-[2px]">
              {wakeupSeries.data.map((d) => {
                const heightPercent =
                  wakeupSeries.max === 0
                    ? 0
                    : (d.value / wakeupSeries.max) * 100;

                return (
                  <div key={d.day} className="flex-1" aria-label={`${d.day}일`}>
                    <div
                      className="mx-[1px] h-full w-full rounded-t bg-emerald-400"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>일찍</span>
            <span>늦게</span>
          </div>
        </section>

        {/* 러닝 그래프 */}
        <section className="w-full rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            러닝 기록 (일별)
          </h3>
          {runningSeries.max === 0 ? (
            <p className="text-xs text-gray-400">
              이 달에는 러닝 기록이 없어요.
            </p>
          ) : (
            <div className="flex h-32 items-end gap-[2px]">
              {runningSeries.data.map((d) => {
                const heightPercent =
                  runningSeries.max === 0
                    ? 0
                    : (d.value / runningSeries.max) * 100;

                return (
                  <div
                    key={d.day}
                    className="flex-1"
                    aria-label={`${d.day}일: ${d.value}`}
                  >
                    <div
                      className="mx-[1px] h-full w-full rounded-t bg-indigo-400"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>1일</span>
            <span>{daysInMonth}일</span>
          </div>
        </section>
      </div>
    </main>
  );
}
