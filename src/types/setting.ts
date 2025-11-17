export type StartOfDay = {
  hour: number; // 0-23
  minute: number; // 0-59
};

export type DayLog = {
  id?: number; // auto-increment
  date: string; // '2025-11-17'
  score: number; // 0~100 or 0~10
  notes?: string;
};

export type Setting = {
  id: string; // 'global'
  startOfDay: StartOfDay | null;
  displayName: string | null; // 이름
  runningGoalType: "time" | "distance" | null;
  runningGoalValue: number | null;
};
