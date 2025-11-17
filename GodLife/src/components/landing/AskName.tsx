import { useState } from "react";

interface AskNameProps {
  onConfirm: (name: string) => void;
}

export default function AskName({ onConfirm }: AskNameProps) {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    onConfirm(name);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-6">
      <h1 className="text-center text-2xl font-bold leading-tight text-slate-600">
        당신의 이름은 무엇인가요?
      </h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-40 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg shadow-sm focus:border-black focus:ring-1 focus:ring-black"
      />
      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="rounded-lg bg-gray-300 px-5 text-sm font-medium text-white shadow hover:bg-gray-400"
        >
          확인
        </button>
      </div>
    </main>
  );
}
