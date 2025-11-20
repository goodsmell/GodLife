import {
  formatMinutesToHHMM,
  formatMinutesToHourText,
} from "../../../../hooks/useMonthlyStats";

export type SelectedInfo =
  | {
      type: "wakeup";
      day: number;
      minutes: number;
    }
  | {
      type: "running";
      day: number;
      minutes: number;
    };

type DayDetailModalProps = {
  monthLabel: string;
  selectedInfo: SelectedInfo | null;
  onClose: () => void;
};

export default function DayDetailModal({
  monthLabel,
  selectedInfo,
  onClose,
}: DayDetailModalProps) {
  if (!selectedInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-64 rounded-2xl bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-gray-400">
          {monthLabel} {selectedInfo.day}일
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-800">
          {selectedInfo.type === "wakeup" ? "기상 시간" : "러닝 기록"}
        </p>
        <p className="mt-2 text-lg font-bold text-indigo-600">
          {selectedInfo.type === "wakeup"
            ? formatMinutesToHHMM(selectedInfo.minutes)
            : formatMinutesToHourText(selectedInfo.minutes)}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-slate-100 py-1.5 text-xs font-medium text-gray-700 hover:bg-slate-200"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
