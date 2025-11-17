import { useEffect, useState } from "react";
import { useGodLifeStore } from "../hooks/useGodLifeStore";
import { useNavigate } from "react-router-dom";

type GoalType = "time" | "distance";

export default function Setting() {
  const navigate = useNavigate();
  const { state, updateSettings, resetAll } = useGodLifeStore();

  const [displayName, setDisplayName] = useState("");
  const [startTime, setStartTime] = useState("07:00");
  const [goalType, setGoalType] = useState<GoalType>("time");
  const [goalValue, setGoalValue] = useState<number>(30); // 기본 30분 or 5km 정도

  useEffect(() => {
    if (!state.setting) return;

    const s = state.setting;

    if (s.displayName) setDisplayName(s.displayName);

    if (s.startOfDay) {
      const h = String(s.startOfDay.hour).padStart(2, "0");
      const m = String(s.startOfDay.minute).padStart(2, "0");
      setStartTime(`${h}:${m}`);
    }

    if (s.runningGoalType) {
      setGoalType(s.runningGoalType as GoalType);
    }

    if (s.runningGoalValue != null) {
      setGoalValue(s.runningGoalValue);
    }
  }, [state.setting]);

  if (state.loading || !state.setting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  const handleSave = async () => {
    const [hourStr, minuteStr] = startTime.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    await updateSettings({
      displayName: displayName.trim() || null,
      startOfDay: { hour, minute },
      runningGoalType: goalType,
      runningGoalValue: goalValue,
    });

    alert("설정이 저장되었습니다 ✅");
  };

  const handleReset = async () => {
    const ok = confirm("정말 초기화하시겠어요? 모든 데이터가 삭제됩니다.");
    if (!ok) return;

    await resetAll();

    navigate("/", { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-8 bg-slate-50 px-6 py-10">
      <h1 className="text-2xl font-bold">설정</h1>

      {/* 이름 */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">이름</h2>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="통계나 인사말에 사용될 이름을 입력해주세요."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </section>

      {/* 하루 시작 시간 */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">하루 시작 시간</h2>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <p className="text-xs text-slate-500">
          갓생 하루의 목표 기상 시간이에요.
        </p>
      </section>

      {/* 러닝 목표 */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">러닝 목표</h2>

        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setGoalType("time")}
            className={`flex-1 rounded-full border px-3 py-2 ${
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
            className={`flex-1 rounded-full border px-3 py-2 ${
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

        <p className="text-xs text-slate-500">
          오늘 탭에서 러닝 진척도를 표시할 때 기준이 되는 목표입니다.
        </p>
      </section>

      <button
        onClick={handleSave}
        className="mt-auto rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-black/90"
      >
        저장하기
      </button>
      <button onClick={handleReset} className="text-sm text-red-500 underline">
        모든 데이터 초기화
      </button>
    </main>
  );
}
