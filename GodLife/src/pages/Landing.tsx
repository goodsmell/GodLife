import { useNavigate } from "react-router-dom";
export default function Landing() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <h1 className="mb-4 text-2xl font-semibold">
        당신이 하루를 시작하는 시간은 몇 시 인가요?
      </h1>
      <button
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        onClick={() => navigate("/home")}
      >
        나중에 설정할게요
      </button>
    </main>
  );
}
