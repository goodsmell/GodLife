import type { DiaryStats, TodoStats } from "../../../../hooks/useMonthlyStats";

type SummaryCardsProps = {
  diaryStats: DiaryStats;
  todoStats: TodoStats;
};

export default function SummaryCards({
  diaryStats,
  todoStats,
}: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      {/* 일기 */}
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-700">일기 작성</p>
        <p className="mt-1 text-lg font-bold text-indigo-600">
          {diaryStats.daysWithDiary}일
        </p>
        <p className="text-[11px] text-gray-500">
          {diaryStats.totalDays}일 중 {diaryStats.percent}% 작성
        </p>
      </div>

      {/* 투두 */}
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-700">할 일 완료</p>
        <p className="mt-1 text-lg font-bold text-emerald-600">
          {todoStats.done}개
        </p>
        <p className="text-[11px] text-gray-500">
          전체 {todoStats.total}개 중 {todoStats.donePercent}% 완료
        </p>
        {todoStats.total > 0 && (
          <p className="mt-1 text-[11px] text-gray-400">
            미완료 {todoStats.undone}개
          </p>
        )}
      </div>
    </section>
  );
}
