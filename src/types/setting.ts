export type StartOfDay = {
  hour: number; // 0-23
  minute: number; // 0-59
};

export type DayLog = {
  id?: number; // auto-increment
  date: string; // '2025-11-17'
  score: number; // 0~100
  notes?: string;
  wakeupTime?: string; // 07:30
  runningValue?: number; // runningGoalType에 따라: 시간(분) 또는 거리(km)
};

export type Setting = {
  id: string; // 'global'
  startOfDay: StartOfDay | null;
  displayName: string | null; // 이름
  runningGoalType: "time" | "distance" | null;
  runningGoalValue: number | null;
};
