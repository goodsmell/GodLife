import { useTodayGoalLog } from "../../../hooks/useTodayGoalLog";
import { useDayLog } from "../../../hooks/useDayLog";

type MemoSectionProps = {
  dateKey?: string;
  readOnly?: boolean;
};

export default function MemoSection({
  dateKey,
  readOnly = false,
}: MemoSectionProps) {
  const store = dateKey ? useDayLog(dateKey, { readOnly }) : useTodayGoalLog();

  const { loading, memos, addMemo, updateMemo, removeMemo } = store;

  if (loading) return null;

  const reachedLimit = memos.length >= 3;

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">메모</h3>
        {!readOnly && (
          <button
            type="button"
            onClick={addMemo}
            disabled={reachedLimit}
            className={`rounded-lg px-2 py-1 text-xs font-medium ${
              reachedLimit
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-amber-300 text-amber-900 hover:bg-amber-400"
            }`}
          >
            + 메모 추가
          </button>
        )}
      </div>

      {memos.length === 0 &&
        (!readOnly ? (
          <p className="text-xs text-gray-400">
            간단한 메모를 포스트잇처럼 남겨보세요. (최대 3개)
          </p>
        ) : (
          <p className="text-xs text-gray-400">등록된 메모가 없어요.</p>
        ))}

      <div className="mt-2 grid grid-cols-3 gap-2">
        {memos.map((memo, index) => (
          <div
            key={memo.id}
            className={`relative flex h-24 flex-col rounded-lg bg-amber-100 p-2 text-xs shadow ${index === 0 ? "-rotate-1" : ""} ${index === 1 ? "rotate-1" : ""} ${index === 2 ? "-rotate-2" : ""} `}
          >
            <textarea
              value={memo.text}
              onChange={(e) => !readOnly && updateMemo(memo.id, e.target.value)}
              readOnly={readOnly}
              placeholder="메모..."
              className="h-full w-full resize-none bg-transparent text-[11px] leading-snug text-gray-800 outline-none"
            />
            {!readOnly && (
              <button
                type="button"
                onClick={() => removeMemo(memo.id)}
                className="absolute right-1 top-1 rounded-full bg-black/40 px-1 text-[10px] text-white"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && reachedLimit && (
        <p className="mt-2 text-[10px] text-gray-400">
          메모는 최대 3개까지만 추가할 수 있어요.
        </p>
      )}
    </section>
  );
}
