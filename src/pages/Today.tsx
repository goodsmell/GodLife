import TodayDate from "../components/pages/Today/TodayDate";
import QuoteOfTheDay from "../components/pages/Today/QuoteOfTheDay";

export default function Today() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      {/* 오늘 날짜 + 요일 표시 */}
      <TodayDate />
      {/* 랜덤/고정 명언 */}
      <QuoteOfTheDay
        wakeupDiff={45}
        runningPercent={0.8}
        yesterdayProgress={0.3}
      />
    </main>
  );
}
