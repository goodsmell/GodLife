type MonthlyHeaderProps = {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthlyHeader({
  monthLabel,
  onPrev,
  onNext,
}: MonthlyHeaderProps) {
  return (
    <section className="flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50"
      >
        ◀
      </button>
      <div className="text-center">
        <p className="text-xs text-gray-400">월간 갓생 분석</p>
        <p className="text-base font-semibold text-gray-800">{monthLabel}</p>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="rounded-full bg-white px-3 py-1 text-sm shadow-sm hover:bg-slate-50"
      >
        ▶
      </button>
    </section>
  );
}
