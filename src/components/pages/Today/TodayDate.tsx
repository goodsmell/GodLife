export default function TodayDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdayNames[now.getDay()];

  return (
    <section className="w-full text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        {year}년 {month}월 {date}일 {weekday}요일
      </h2>
    </section>
  );
}
