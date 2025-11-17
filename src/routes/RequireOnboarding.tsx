import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";

export default function RequireOnboarding() {
  const { loading, hasAllOnboarding } = useOnboardingStatus();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  if (!hasAllOnboarding) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
