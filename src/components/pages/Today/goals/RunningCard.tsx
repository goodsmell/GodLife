type RunningCardProps = {
  goalType: "time" | "distance";
  goalValue: number; // 분 or km
  runningValue: number | null; // 분 or km
  onChangeRunningValue: (value: number | null) => void;
  readOnly?: boolean;
};

export default function RunningCard({
  goalType,
  goalValue,
  runningValue,
  onChangeRunningValue,
  readOnly = false,
}: RunningCardProps) {
  const hasInput = runningValue !== null && runningValue !== undefined;
  const isAchieved = hasInput && runningValue! >= goalValue;

  let unitLabel = "km";
  let label = "러닝";
  if (goalType === "time") {
    unitLabel = "분";
    label = "러닝 시간";
  }

  let statusText = "입력 안함";
  if (hasInput) {
    statusText = isAchieved ? "성공 🏃‍♀️" : "조금만 더!";
  }

  const statusColorClass = getStatusColorClass(hasInput, isAchieved);

  function handleChange(value: string) {
    if (!value) {
      onChangeRunningValue(null);
      return;
    }
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) return;
    onChangeRunningValue(num);
  }

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">{label}</h3>
        {!readOnly && (
          <span className="text-xs text-gray-500">
            오늘 목표: {goalValue}
            {unitLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <div className="flex items-center gap-2">
          {!readOnly && (
            <input
              type="number"
              min={0}
              step={goalType === "time" ? 5 : 0.1}
              value={runningValue ?? ""}
              onChange={(e) => handleChange(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm"
            />
          )}
          {readOnly && (
            <span className="text-sm text-gray-600">{runningValue ?? ""}</span>
          )}

          <span className="text-sm text-gray-600">
            {runningValue ? unitLabel : ""}
          </span>
        </div>

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
