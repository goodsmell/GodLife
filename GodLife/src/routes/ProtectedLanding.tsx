import { Navigate, Outlet } from "react-router-dom";
import { useGodLifeStore } from "../hooks/useGodLifeStore";

export default function ProtectedLanding() {
  const { state } = useGodLifeStore();

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  const setting = state.setting;

  const hasStartOfDay = !!setting?.startOfDay;
  const hasName =
    !!setting?.displayName && setting.displayName.trim().length > 0;
  const hasRunningGoalType = !!setting?.runningGoalType;
  const hasRunningGoalValue =
    setting?.runningGoalValue != null && setting.runningGoalValue > 0;

  const hasAllOnboarding =
    hasStartOfDay && hasName && hasRunningGoalType && hasRunningGoalValue;

  if (hasAllOnboarding) {
    return <Navigate to="/today" replace />;
  }

  return <Outlet />;
}
