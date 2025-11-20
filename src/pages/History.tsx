import { useEffect, useState } from "react";
import type { DayLog, TodoItem, MemoItem } from "../types/setting";
import { getLogByDate } from "../db/godlifeRepository";
import { formatDateLabel, toDateKey, fromDateKey } from "../utils/date";
import DateCalendar from "../components/common/DateCalendar";

export default function History() {
  const [currentDateKey, setCurrentDateKey] = useState(() => {
    return toDateKey(new Date());
  });

  const [log, setLog] = useState<DayLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 현재 날짜 로그 로딩
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const existing = await getLogByDate(currentDateKey);
      if (!cancelled) {
        setLog(existing ?? null);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [currentDateKey]);

  const goPrevDay = () => {
    const d = fromDateKey(currentDateKey);
    d.setDate(d.getDate() - 1);
    setCurrentDateKey(toDateKey(d));
  };

  const goNextDay = () => {
    const todayKey = toDateKey(new Date());
    if (currentDateKey >= todayKey) return; // 오늘 이후로는 못 가게
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
      <div className="w-full max-w-md space-y-4">
        {/* 날짜 이동 바 */}
        <section className="flex items-center justify-between">
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
            <p className="text-base font-semibold text-gray-800">
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
            <div className="absolute left-1/2 top-20 z-20 mt-2 w-[280px] -translate-x-1/2">
              <DateCalendar
                selectedDateKey={currentDateKey}
                onSelect={handleSelectDate}
              />
            </div>
          )}
        </section>

        {loading ? (
          <div className="space-y-3">
            <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        ) : !log ? (
          <section className="w-full rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">이 날의 기록이 아직 없어요.</p>
          </section>
        ) : (
          <>
            {/* 목표 달성 카드 (Today와 비슷하게 보여주기) */}
            <section className="w-full rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-gray-800">
                이 날의 목표 달성률
              </h3>
              <div className="mb-2 h-3 w-full rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-indigo-400"
                  style={{ width: `${log.score ?? 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                달성률{" "}
                <span className="font-semibold text-indigo-600">
                  {log.score ?? 0}%
                </span>
              </p>
            </section>

            {/* 기상/러닝 */}
            <section className="w-full space-y-3 rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-1 text-base font-semibold text-gray-800">
                기상 & 러닝
              </h3>
              <div className="text-sm text-gray-700">
                <p className="flex justify-between">
                  <span className="text-gray-500">기상 시간</span>
                  <span className="font-medium">
                    {log.wakeupTime ?? "기록 없음"}
                  </span>
                </p>
                <p className="mt-1 flex justify-between">
                  <span className="text-gray-500">러닝</span>
                  <span className="font-medium">
                    {typeof log.runningValue === "number"
                      ? `${log.runningValue}`
                      : "기록 없음"}
                  </span>
                </p>
              </div>
            </section>

            {/* 투두 */}
            <section className="w-full rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-gray-800">
                투두 리스트
              </h3>
              {!log.todos || log.todos.length === 0 ? (
                <p className="text-sm text-gray-400">등록된 투두가 없어요.</p>
              ) : (
                <ul className="space-y-1">
                  {log.todos.map((todo: TodoItem) => (
                    <li
                      key={todo.id}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={todo.done}
                        readOnly
                        className="h-4 w-4 accent-indigo-500"
                      />
                      <span
                        className={
                          todo.done
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }
                      >
                        {todo.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 메모 (포스트잇 느낌) */}
            <section className="w-full rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-gray-800">
                메모
              </h3>
              {!log.memos || log.memos.length === 0 ? (
                <p className="text-xs text-gray-400">
                  이 날에는 메모가 없어요.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {log.memos.map((memo: MemoItem, index: number) => (
                    <div
                      key={memo.id}
                      className={`flex h-24 flex-col rounded-lg bg-amber-100 p-2 text-xs shadow ${index === 0 ? "-rotate-1" : ""} ${index === 1 ? "rotate-1" : ""} ${index === 2 ? "-rotate-2" : ""} `}
                    >
                      <p className="whitespace-pre-wrap text-[11px] leading-snug text-gray-800">
                        {memo.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 일기 + 사진 */}
            <section className="w-full rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-gray-800">
                일기
              </h3>
              <div className="mb-3">
                {log.diary ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                    {log.diary}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    이 날에는 일기가 작성되지 않았어요.
                  </p>
                )}
              </div>

              {log.diaryImages && log.diaryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {log.diaryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`diary-${index}`}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
