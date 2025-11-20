type GoalProgressProps = {
    wakeupScore: number;        // 0 또는 1
    runningScore: number;       // 0 ~ 1
    todoScore: number;          // 0 ~ 1
  };
  
  export default function GoalProgress({
    wakeupScore,
    runningScore,
    todoScore,
  }: GoalProgressProps) {
    const clampedWakeup = clamp01(wakeupScore);
    const clampedRunning = clamp01(runningScore);
    const clampedTodo = clamp01(todoScore);
  
    const average =
      (clampedWakeup + clampedRunning + clampedTodo) / 3;
  
    const percent = Math.round(average * 100);
  
    const barWidth = `${percent}%`;
  
    return (
      <section className="w-full rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">
            오늘의 목표 달성률
          </h3>
          <span className="text-sm font-semibold text-indigo-600">
            {percent}%
          </span>
        </div>
  
        <div className="mb-2 h-3 w-full rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-indigo-400 transition-all"
            style={{ width: barWidth }}
          />
        </div>
  
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>기상</span>
          <span>러닝</span>
          <span>투두</span>
        </div>
      </section>
    );
  }
  
  function clamp01(value: number): number {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }
  