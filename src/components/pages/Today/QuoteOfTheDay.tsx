import { useMemo } from "react";

const QUOTE_CATEGORIES = {
  motivation: [
    "천천히 가도 돼. 멈지만 않으면 돼.",
    "습관이 쌓이면 그것이 바로 실력이다.",
    "어제보다 1%만 나아져도 충분하다.",
  ],
  discipline: [
    "작은 실천이 결국 큰 차이를 만든다.",
    "꾸준함은 재능을 이긴다.",
    "오늘의 선택이 내일의 나를 만든다.",
  ],
  recovery: [
    "쉬는 것도 성장의 일부다.",
    "괜찮아, 다시 시작하면 돼.",
    "오늘 넘어졌다고 내일까지 넘어지는 건 아니야.",
  ],
};

function getStableIndex(key: string, length: number) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
  }
  return hash % length;
}

function pickCategory({
  wakeupDiff,
  runningPercent,
  yesterdayProgress,
}: {
  wakeupDiff: number;
  runningPercent: number;
  yesterdayProgress: number;
}) {
  if (yesterdayProgress < 0.4) return "recovery";
  if (wakeupDiff > 30) return "discipline";
  if (runningPercent >= 1) return "motivation";
  return "motivation";
}

export default function QuoteOfTheDay({
  wakeupDiff = 0,
  runningPercent = 0,
  yesterdayProgress = 1,
}: {
  wakeupDiff?: number;
  runningPercent?: number;
  yesterdayProgress?: number;
}) {
  const category = useMemo(
    () => pickCategory({ wakeupDiff, runningPercent, yesterdayProgress }),
    [wakeupDiff, runningPercent, yesterdayProgress],
  );

  const today = new Date().toDateString();
  const quoteList = QUOTE_CATEGORIES[category];
  const index = getStableIndex(today + category, quoteList.length);

  const quote = quoteList[index];

  return (
    <section className="w-full text-center">
      <h3 className="text-base font-thin leading-relaxed text-gray-500">
        “{quote}”
      </h3>
    </section>
  );
}
