import { parseTimeToMinutes } from "../../../../utils/timeUtils";

type WakeupCardProps = {
  goalTime: string; // "07:00"
  wakeupTime: string;
  onChangeWakeupTime: (value: string) => void;
};

export default function WakeupCard({
  goalTime,
  wakeupTime,
  onChangeWakeupTime,
}: WakeupCardProps) {
  const goalMinutes = parseTimeToMinutes(goalTime);
  const wakeupMinutes = parseTimeToMinutes(wakeupTime);

  const isAchieved =
    goalMinutes !== null &&
    wakeupMinutes !== null &&
    wakeupMinutes <= goalMinutes;

  const hasInput = !!wakeupTime;

  let statusText = "입력 전";
  if (hasInput) {
    if (isAchieved) {
      statusText = "목표 달성 😁";
    } else {
      statusText = "목표 미달성 😭";
    }
  }

  const statusColorClass = getStatusColorClass(hasInput, isAchieved);

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">기상</h3>
        <span className="text-xs text-gray-500">목표 기상: {goalTime}</span>
      </div>

      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <input
          type="time"
          value={wakeupTime}
          onChange={(e) => onChangeWakeupTime(e.target.value)}
          className="w-32 rounded-lg border border-gray-300 px-2 py-1 text-sm"
        />
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColorClass}`}
        >
          {statusText}
        </span>
      </div>
    </section>
  );
}

function getStatusColorClass(hasInput: boolean, isAchieved: boolean): string {
  if (!hasInput) {
    return "bg-gray-100 text-gray-500";
  }

  if (isAchieved) {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
}
