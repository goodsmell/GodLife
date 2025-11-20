import TodayDate from "../components/pages/Today/TodayDate";
import QuoteOfTheDay from "../components/pages/Today/QuoteOfTheDay";
import GoalSection from "../components/pages/Today/goals/GoalSection";
import TodoSection from "../components/pages/Today/todo/TodoSection";
import DiarySection from "../components/pages/Today/diary/DiarySection";
import MemoSection from "../components/pages/Today/MemoSection";

import { useTodayGoalLog } from "../hooks/useTodayGoalLog";

export default function Today() {
  const { todos, loading } = useTodayGoalLog();
  const todoScore = (() => {
    if (loading) return 0;

    const total = todos.length;
    if (total === 0) return 0; // 투두 없으면 0으로 반영 (원하면 여기서 null 처리도 가능)

    const done = todos.filter((t) => t.done).length;
    return done / total;
  })();
  return (
    <main className="flex h-full flex-col items-center border bg-slate-100 px-4 py-4">
      {/*  오늘 날짜 + 요일 표시 */}
      <TodayDate />
      {/*  랜덤/고정 명언 */}
      <QuoteOfTheDay
        wakeupDiff={45}
        runningPercent={0.8}
        yesterdayProgress={0.3}
      />
      <section className="mt-4 flex w-full flex-col gap-5">
        <GoalSection todoScore={todoScore} />
        <section className="grid grid-cols-2 gap-3">
          <TodoSection />
          <section className="flex flex-col gap-3">
            <MemoSection />
            <DiarySection />
          </section>
        </section>
      </section>
    </main>
  );
}
