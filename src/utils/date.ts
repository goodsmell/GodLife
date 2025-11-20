const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // 2025-11-20
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateLabel(key: string): string {
  const date = fromDateKey(key);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAY[date.getDay()];
  return `${y}년 ${m}월 ${d}일 ${w}요일`;
}

export function formatYearMonthLabel(year: number, monthIndex: number): string {
    return `${year}년 ${monthIndex + 1}월`;
  }
