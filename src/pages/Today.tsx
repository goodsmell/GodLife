import TodayDate from "../components/pages/Today/TodayDate";

export default function Today() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      {/* <TodayDate /> : 오늘 날짜 + 요일 표시 */}
      <TodayDate />
    </main>
  );
}
