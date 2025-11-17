// src/db/godlifeDB.ts
import Dexie from "dexie";
import type { DayLog, Setting } from "../types/setting";

export type GodLifeDB = Dexie & {
  logs: Dexie.Table<DayLog, number>;      // DayLog 기본 키: number(id)
  settings: Dexie.Table<Setting, string>; // Setting 기본 키: string(id)
};

export const db = new Dexie("GodLifeDB") as GodLifeDB;

db.version(1).stores({
  logs: "++id,date", // auto 증가 id, date 인덱스
  settings: "id",    // 'global' 같은 단일 id
});

export async function resetDB() {
  await db.delete(); // 전체 DB 삭제
  await db.open();   // 다시 열어서 재초기화
}
