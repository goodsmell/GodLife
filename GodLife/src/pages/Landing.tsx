import { useNavigate } from "react-router-dom";
import { useGodLifeStore } from "../hooks/useGodLifeStore";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { state, setStartOfDay } = useGodLifeStore();

  const initialHour = state.setting?.startOfDay?.hour ?? 7;
  const initialMinute = state.setting?.startOfDay?.minute ?? 0;

  const [time, setTime] = useState(
    `${String(initialHour).padStart(2, "0")}:${String(initialMinute).padStart(2, "0")}`,
  );

  const handleSave = async () => {
    const [h, m] = time.split(":").map(Number);
    await setStartOfDay({ hour: h, minute: m });
    navigate("/today");
  };

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-6">
      <h1 className="text-center text-2xl font-bold leading-tight text-slate-600">
        당신의 하루는 <br /> 몇 시에 시작되나요?
      </h1>

      <div className="flex gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-40 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg shadow-sm focus:border-black focus:ring-1 focus:ring-black"
        />

        <button
          onClick={handleSave}
          className="rounded-lg bg-gray-300 px-5 text-sm font-medium text-white shadow hover:bg-gray-400"
        >
          저장
        </button>
      </div>
    </main>
  );
}
