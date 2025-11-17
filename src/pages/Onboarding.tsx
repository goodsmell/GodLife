import { useNavigate } from "react-router-dom";
import { useGodLifeStore } from "../hooks/useGodLifeStore";
import { useEffect, useState } from "react";
import AskWakeUpTime from "../components/landing/AskWakeUpTime";
import AskRunning from "../components/landing/AskRunning";
import AskName from "../components/landing/AskName";

export default function Onboarding() {
  const navigate = useNavigate();
  const { state, setStartOfDay, updateSettings } = useGodLifeStore();

  const initialHour = state.setting?.startOfDay?.hour ?? 7;
  const initialMinute = state.setting?.startOfDay?.minute ?? 0;
  const initialGoalType = state.setting?.runningGoalType ?? "time";
  const initialGoalValue = state.setting?.runningGoalValue ?? 0;

  const [step, setStep] = useState<"name" | "wakeUpTime" | "runningGoal">(
    "name",
  );
  const [time, setTime] = useState(
    `${String(initialHour).padStart(2, "0")}:${String(initialMinute).padStart(2, "0")}`,
  );
  const [goalType, setGoalType] = useState<"time" | "distance">(
    initialGoalType,
  );
  const [goalValue, setGoalValue] = useState(initialGoalValue);

  useEffect(() => {
    if (!state.setting) return;

    const s = state.setting;

    if (s.startOfDay) {
      const h = String(s.startOfDay.hour).padStart(2, "0");
      const m = String(s.startOfDay.minute).padStart(2, "0");
      setTime(`${h}:${m}`);
    }

    if (s.runningGoalType) {
      setGoalType(s.runningGoalType as "time" | "distance");
    }

    if (s.runningGoalValue != null) {
      setGoalValue(s.runningGoalValue);
    }
  }, [state.setting]);

  const handleSaveName = async (name: string) => {
    await updateSettings({ displayName: name });
    setStep("wakeUpTime");
  };
  const handleSaveWakeUpTime = async () => {
    const [h, m] = time.split(":").map(Number);
    await setStartOfDay({ hour: h, minute: m });
    setStep("runningGoal");
  };
  const handleSaveRunningGoal = async () => {
    await updateSettings({
      runningGoalType: goalType,
      runningGoalValue: goalValue,
    });
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
      {step === "name" && <AskName onConfirm={handleSaveName} />}
      {step === "wakeUpTime" && (
        <AskWakeUpTime
          onConfirm={handleSaveWakeUpTime}
          time={time}
          setTime={setTime}
        />
      )}
      {step === "runningGoal" && (
        <AskRunning
          onConfirm={handleSaveRunningGoal}
          goalType={goalType}
          setGoalType={setGoalType}
          goalValue={goalValue}
          setGoalValue={setGoalValue}
        />
      )}
    </main>
  );
}
