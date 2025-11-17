import { Navigate, Outlet } from "react-router-dom";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";

export default function ProtectedLanding() {
  const { loading, hasAllOnboarding } = useOnboardingStatus();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  if (hasAllOnboarding) {
    return <Navigate to="/today" replace />;
  }

  return <Outlet />;
}
