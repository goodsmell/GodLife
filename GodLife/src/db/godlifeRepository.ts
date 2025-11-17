import { db } from "./godlifeDB";
import type { DayLog, Setting, StartOfDay } from "../types/setting";

const GLOBAL_SETTING_ID = "global";

export async function getSetting(): Promise<Setting> {
  const existing = await db.settings.get(GLOBAL_SETTING_ID);
  if (existing) return existing;

  // 없으면 기본값 생성
  const defaultSetting: Setting = {
    id: GLOBAL_SETTING_ID,
    startOfDay: null,
  };
  await db.settings.put(defaultSetting);
  return defaultSetting;
}

export async function updateStartOfDay(startOfDay: StartOfDay) {
  await db.settings.put({
    id: GLOBAL_SETTING_ID,
    startOfDay,
  });
}

export async function getLogByDate(date: string): Promise<DayLog | undefined> {
  return db.logs.where("date").equals(date).first();
}

export async function upsertLog(log: DayLog) {
  const existing = await getLogByDate(log.date);
  if (existing) {
    await db.logs.update(existing.id!, log);
  } else {
    await db.logs.add(log);
  }
}

export async function getAllLogs(): Promise<DayLog[]> {
  return db.logs.orderBy("date").toArray();
}
