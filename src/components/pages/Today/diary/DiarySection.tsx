import { type ChangeEvent } from "react";
import { useTodayGoalLog } from "../../../../hooks/useTodayGoalLog";
import { useDayLog } from "../../../../hooks/useDayLog";

type DiarySectionProps = {
  dateKey?: string; // 없으면 오늘 모드
  readOnly?: boolean; // true이면 기록 보기 모드
};

export default function DiarySection({
  dateKey,
  readOnly = false,
}: DiarySectionProps) {
  const store = dateKey ? useDayLog(dateKey, { readOnly }) : useTodayGoalLog();

  const {
    loading,
    diary,
    setDiary,
    diaryImages,
    addDiaryImage,
    removeDiaryImage,
  } = store;

  if (loading) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return; // 읽기 전용이면 막기

    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          addDiaryImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  return (
    <section className="w-full rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-gray-800">
        오늘의 일기
      </h3>

      {readOnly && !diary && (
        <h4 className="text-xs text-gray-400">일기를 작성하지 않았어요!</h4>
      )}

      {!readOnly && (
        <textarea
          value={diary}
          onChange={(e) => !readOnly && setDiary(e.target.value)}
          readOnly={readOnly}
          placeholder="오늘 있었던 일을 자유롭게 적어보세요."
          className="mb-3 h-32 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed"
        />
      )}
      {readOnly && diary && (
        <div className="mb-3 w-full resize-none rounded-sm border border-gray-300 px-3 py-2 text-sm leading-relaxed">
          <p className="text-xs text-gray-400">{diary}</p>
        </div>
      )}

      {/* 사진 업로드 */}
      {!readOnly && (
        <div className="mb-3">
          <label className="cursor-pointer rounded-lg border border-indigo-300 px-2 py-1 text-xs font-medium text-indigo-600">
            + 사진 추가 (최대 10장)
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}

      {/* 사진 미리보기 */}
      {diaryImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {diaryImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt="diary"
                className="aspect-square w-full rounded-lg object-cover"
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeDiaryImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1 py-0.5 text-[10px] text-white"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {diaryImages.length === 0 && !readOnly && (
        <p className="text-xs text-gray-400">
          오늘을 기록하고 싶은 사진을 올려보세요.
        </p>
      )}
    </section>
  );
}
