import {
  formatMinutesToHourText,
  type RunningSeries,
} from "../../../../hooks/useMonthlyStats";

type RunningChartProps = {
  runningSeries: RunningSeries;
  daysInMonth: number;
  runningTargetMinutes: number;
  runningTargetRatio: number;
  onSelect: (day: number, minutes: number) => void;
};

export default function RunningChart({
  runningSeries,
  daysInMonth,
  runningTargetMinutes,
  runningTargetRatio,
  onSelect,
}: RunningChartProps) {
  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-800">
        러닝 기록 (일별)
      </h3>
      {runningSeries.max === 0 ? (
        <p className="text-xs text-gray-400">이 달에는 러닝 기록이 없어요.</p>
      ) : (
        <>
          <div className="relative flex h-32 gap-[2px]">
            {/* 러닝 목표선 */}
            {runningTargetRatio > 0 && (
              <div
                className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-rose-400"
                style={{ bottom: `${runningTargetRatio * 100}%` }}
              >
                <span className="absolute right-0 translate-y-[-50%] rounded-full bg-white/80 px-1 text-[9px] font-medium text-rose-500">
                  목표 {formatMinutesToHourText(runningTargetMinutes)}
                </span>
              </div>
            )}

            {runningSeries.data.map((d) => {
              const heightPercent =
                runningSeries.max === 0
                  ? 0
                  : (d.value / runningSeries.max) * 100;

              const clickable = d.value > 0;

              return (
                <button
                  key={d.day}
                  type="button"
                  className={`flex flex-1 items-end rounded-sm ${
                    clickable ? "cursor-pointer" : "cursor-default opacity-20"
                  }`}
                  aria-label={`${d.day}일: ${d.value}분`}
                  title={
                    clickable
                      ? `${d.day}일: ${formatMinutesToHourText(d.value)}`
                      : `${d.day}일: 기록 없음`
                  }
                  onClick={() => {
                    if (!clickable) return;
                    onSelect(d.day, d.value);
                  }}
                >
                  <div
                    className="mx-[1px] w-full rounded-t bg-indigo-400"
                    style={{ height: `${heightPercent}%` }}
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-gray-500">
            총 러닝 {formatMinutesToHourText(runningSeries.totalMinutes)} ·
            러닝한 날 기준 하루 평균{" "}
            {formatMinutesToHourText(runningSeries.avgMinutes)}
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
