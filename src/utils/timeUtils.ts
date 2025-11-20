export function parseTimeToMinutes(time: string): number | null {
  if (!time) return null;
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return hour * 60 + minute;
}
