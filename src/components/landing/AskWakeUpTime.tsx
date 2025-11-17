interface AskWakeUpTimeProps {
  onConfirm: (time: string) => void;
  time: string;
  setTime: (time: string) => void;
}

export default function AskWakeUpTime({
  onConfirm,
  time,
  setTime,
}: AskWakeUpTimeProps) {
  const handleConfirm = () => {
    onConfirm(time);
  };

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
          onClick={handleConfirm}
          className="rounded-lg bg-gray-300 px-5 text-sm font-medium text-white shadow hover:bg-gray-400"
        >
          저장
        </button>
      </div>
    </main>
  );
}
