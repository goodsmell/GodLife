interface AskRunningProps {
  onConfirm: (goalType: "time" | "distance", goalValue: number) => void;
  goalType: "time" | "distance";
  setGoalType: (goalType: "time" | "distance") => void;
  goalValue: number;
  setGoalValue: (goalValue: number) => void;
}

export default function AskRunning({
  onConfirm,
  goalType,
  setGoalType,
  goalValue,
  setGoalValue,
}: AskRunningProps) {
  const handleConfirm = () => {
    onConfirm(goalType, goalValue);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-6">
      <h1 className="text-center text-2xl font-bold leading-tight text-slate-600">
        당신의 하루 러닝 목표를 세워보세요.
      </h1>

      <section className="space-y-3">
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setGoalType("time")}
            className={`flex-1 whitespace-nowrap rounded-full border px-3 py-2 ${
              goalType === "time"
                ? "border-black bg-black text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            시간으로
          </button>
          <button
            type="button"
            onClick={() => setGoalType("distance")}
            className={`flex-1 whitespace-nowrap rounded-full border px-3 py-2 ${
              goalType === "distance"
                ? "border-black bg-black text-white"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            거리로
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={goalValue}
            onChange={(e) => setGoalValue(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span className="text-sm text-slate-700">
            {goalType === "time" ? "분" : "km"}
          </span>
        </div>
      </section>

      <button
        onClick={handleConfirm}
        className="rounded-lg bg-gray-300 px-5 text-sm font-medium text-white shadow hover:bg-gray-400"
      >
        저장
      </button>
    </main>
  );
}
