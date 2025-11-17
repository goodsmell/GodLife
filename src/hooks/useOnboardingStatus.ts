// src/hooks/useOnboardingStatus.ts
import { useGodLifeStore } from "./useGodLifeStore";

export function useOnboardingStatus() {
  const { state } = useGodLifeStore();

  const loading = state.loading;
  const setting = state.setting;

  const hasStartOfDay = !!setting?.startOfDay;
  const hasName =
    !!setting?.displayName && setting.displayName.trim().length > 0;
  const hasRunningGoalType = !!setting?.runningGoalType;
  const hasRunningGoalValue =
    setting?.runningGoalValue != null && setting.runningGoalValue > 0;

  const hasAllOnboarding =
    hasStartOfDay && hasName && hasRunningGoalType && hasRunningGoalValue;

  return {
    loading,
    hasAllOnboarding,
    setting,
    hasStartOfDay,
    hasName,
    hasRunningGoalType,
    hasRunningGoalValue,
  };
}
