import { Navigate, Outlet } from "react-router-dom";
import { useGodLifeStore } from "../hooks/useGodLifeStore";

export default function ProtectedLanding() {
  const { state } = useGodLifeStore();

  // 아직 로딩 중이면 로딩 화면
  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  // 이미 시작 시간이 설정되어 있으면 /today 로 리다이렉트
  if (state.setting?.startOfDay) {
    return <Navigate to="/today" replace />;
  }

  // 아니면 Landing 페이지를 출력
  return <Outlet />;
}
