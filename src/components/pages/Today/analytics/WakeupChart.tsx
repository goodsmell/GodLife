import {
    formatMinutesToHHMM,
    type WakeupSeries,
  } from "../../../../hooks/useMonthlyStats";
  
  type WakeupChartProps = {
    wakeupSeries: WakeupSeries;
    daysInMonth: number;
    wakeupTargetMinutes: number;
    wakeupTargetRatio: number;
    onSelect: (day: number, minutes: number) => void;
  };
  
  export default function WakeupChart({
    wakeupSeries,
    daysInMonth,
    wakeupTargetMinutes,
    wakeupTargetRatio,
    onSelect,
  }: WakeupChartProps) {
    return (
      <section className="w-full rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">
          기상 시간 (일별)
        </h3>
        {!wakeupSeries.hasAnyData ? (
          <p className="text-xs text-gray-400">
            이 달에는 기상 시간이 기록되지 않았어요.
          </p>
        ) : (
          <>
            <div className="relative flex h-32 gap-[2px]">
              {/* 목표선 */}
              {wakeupTargetRatio > 0 && (
                <div
                  className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-rose-400"
                  style={{ bottom: `${wakeupTargetRatio * 100}%` }}
                >
                  <span className="absolute right-0 translate-y-[-50%] rounded-full bg-white/80 px-1 text-[9px] font-medium text-rose-500">
                    목표 {formatMinutesToHHMM(wakeupTargetMinutes)}
                  </span>
                </div>
              )}
  
              {wakeupSeries.data.map((d) => {
                const heightPercent =
                  wakeupSeries.max === 0
                    ? 0
                    : (d.value / wakeupSeries.max) * 100;
  
                const clickable = d.hasData;
  
                return (
                  <button
                    key={d.day}
                    type="button"
                    className={`relative flex-1 ${
                      clickable ? "cursor-pointer" : "cursor-default opacity-20"
                    }`}
                    aria-label={`${d.day}일 ${
                      d.hasData ? formatMinutesToHHMM(d.minutes) : "기록 없음"
                    }`}
                    title={
                      d.hasData
                        ? `${d.day}일: ${formatMinutesToHHMM(d.minutes)}`
                        : `${d.day}일: 기록 없음`
                    }
                    onClick={() => {
                      if (!clickable) return;
                      onSelect(d.day, d.minutes);
                    }}
                  >
                    {clickable && (
                      <div
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                        style={{ bottom: `${heightPercent}%` }}
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
  
            <p className="mt-2 text-[11px] text-gray-500">
              평균 {formatMinutesToHHMM(wakeupSeries.avgMinutes)} · 가장 일찍{" "}
              {formatMinutesToHHMM(wakeupSeries.earliestMinutes)} · 가장 늦게{" "}
              {formatMinutesToHHMM(wakeupSeries.latestMinutes)}
            </p>
          </>
        )}
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          <span>1일</span>
          <span>{daysInMonth}일</span>
        </div>
      </section>
    );
  }
  