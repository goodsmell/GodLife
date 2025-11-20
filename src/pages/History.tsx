import { useState } from "react";
import { formatDateLabel, toDateKey, fromDateKey } from "../utils/date";
import DateCalendar from "../components/common/DateCalendar";

import GoalSection from "../components/pages/Today/goals/GoalSection";
import TodoSection from "../components/pages/Today/todo/TodoSection";
import DiarySection from "../components/pages/Today/diary/DiarySection";
import MemoSection from "../components/pages/Today/MemoSection";

export default function History() {
  const [currentDateKey, setCurrentDateKey] = useState(() =>
    toDateKey(new Date()),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goPrevDay = () => {
    const d = fromDateKey(currentDateKey);
    d.setDate(d.getDate() - 1);
    setCurrentDateKey(toDateKey(d));
  };

  const goNextDay = () => {
    const todayKey = toDateKey(new Date());
    if (currentDateKey >= todayKey) return;
    const d = fromDateKey(currentDateKey);
    d.setDate(d.getDate() + 1);
    setCurrentDateKey(toDateKey(d));
  };

  const isToday = currentDateKey === toDateKey(new Date());

  const handleSelectDate = (key: string) => {
    setCurrentDateKey(key);
    setIsCalendarOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4 py-6">
      <div className="w-full space-y-4">
        {/* 날짜 이동 바 */}
        <section className="relative flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrevDay}
            className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="flex flex-col items-center"
          >
            <p className="text-xl font-semibold text-gray-800">
              {formatDateLabel(currentDateKey)}
            </p>
          </button>
          <button
            type="button"
            onClick={goNextDay}
            disabled={isToday}
            className={`rounded-full px-3 py-1 text-sm shadow-sm ${
              isToday
                ? "cursor-not-allowed bg-slate-200 text-gray-400"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            ▶
          </button>

          {isCalendarOpen && (
            <div className="absolute left-1/2 top-12 z-20 w-[280px] -translate-x-1/2">
              <DateCalendar
                selectedDateKey={currentDateKey}
                onSelect={handleSelectDate}
              />
            </div>
          )}
        </section>

        <section className="mt-2 flex w-full flex-col gap-5">
          <GoalSection dateKey={currentDateKey} readOnly todoScore={0} />
          <section className="grid grid-cols-2 gap-3">
            <TodoSection dateKey={currentDateKey} readOnly />
            <section className="flex flex-col gap-3">
              <MemoSection dateKey={currentDateKey} readOnly />
              <DiarySection dateKey={currentDateKey} readOnly />
            </section>
          </section>
        </section>
      </div>
    </main>
  );
}
