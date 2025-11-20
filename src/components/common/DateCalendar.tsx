import { useMemo, useState } from "react";
import { fromDateKey, toDateKey } from "../../utils/date";

type DateCalendarProps = {
  selectedDateKey: string;
  onSelect: (dateKey: string) => void;
};

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DateCalendar({
  selectedDateKey,
  onSelect,
}: DateCalendarProps) {
  const selectedDate = fromDateKey(selectedDateKey);
  const [month, setMonth] = useState(() => {
    return new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
  });

  const todayKey = toDateKey(new Date());

  const { year, monthIndex, weeks } = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();

    const firstDayOfMonth = new Date(y, m, 1);
    const lastDayOfMonth = new Date(y, m + 1, 0);

    const start = new Date(firstDayOfMonth);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(lastDayOfMonth);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const days: Date[] = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const resultWeeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      resultWeeks.push(days.slice(i, i + 7));
    }

    return {
      year: y,
      monthIndex: m,
      weeks: resultWeeks,
    };
  }, [month]);

  const handlePrevMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDay = (date: Date) => {
    const key = toDateKey(date);
    const today = new Date();

    if (date > today) return; // 오늘 이후 날짜 선택 막기
    onSelect(key);
  };

  const monthLabel = `${year}년 ${monthIndex + 1}월`;

  return (
    <div className="rounded-xl bg-white p-3 shadow-lg">
      {/* 상단 월 네비게이션 */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="rounded-full px-2 py-1 text-xs text-gray-600 hover:bg-slate-100"
        >
          ◀
        </button>
        <p className="text-sm font-semibold text-gray-800">{monthLabel}</p>
        <button
          type="button"
          onClick={handleNextMonth}
          className="rounded-full px-2 py-1 text-xs text-gray-600 hover:bg-slate-100"
        >
          ▶
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-1 grid grid-cols-7 text-center text-[11px] text-gray-500">
        {WEEK_LABELS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weeks.map((week, wi) =>
          week.map((date, di) => {
            const key = toDateKey(date);
            const isToday = key === todayKey;
            const isSelected = key === selectedDateKey;
            const isCurrentMonth = date.getMonth() === monthIndex;

            const baseClasses =
              "flex h-7 items-center justify-center rounded-full cursor-pointer";
            const textMuted = isCurrentMonth ? "text-gray-800" : "text-gray-300";

            let bgClass = "";
            let textClass = textMuted;

            if (isSelected) {
              bgClass = "bg-indigo-500";
              textClass = "text-white";
            } else if (isToday) {
              bgClass = "bg-indigo-100";
              textClass = "text-indigo-700";
            }

            const isFuture =
              date >
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
              );

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                onClick={() => handleSelectDay(date)}
                disabled={isFuture}
                className={`${baseClasses} ${bgClass} ${
                  isFuture ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                <span className={textClass}>{date.getDate()}</span>
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
