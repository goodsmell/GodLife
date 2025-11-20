export type StartOfDay = {
  hour: number; // 0-23
  minute: number; // 0-59
};

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type DayLog = {
  id?: number;
  date: string; // '2025-11-17'
  score: number; // 0~100
  notes?: string;

  wakeupTime?: string;
  runningValue?: number;
  todos?: TodoItem[];
};

export type Setting = {
  id: string; // 'global'
  startOfDay: StartOfDay | null;
  displayName: string | null; // 이름
  runningGoalType: "time" | "distance" | null;
  runningGoalValue: number | null;
};
