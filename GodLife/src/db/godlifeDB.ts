import Dexie, { type Table } from "dexie";
import type { DayLog, Setting } from "../types/setting";

// DB 클래스 정의
export class GodLifeDB extends Dexie {
  // 테이블 타입 선언
  logs!: Table<DayLog, number>; // number = primary key type
  settings!: Table<Setting, string>; // string = primary key type

  constructor() {
    super("GodLifeDB");

    // 버전 & 스키마 정의
    this.version(1).stores({
      logs: "++id, date", // auto id, date 인덱스
      settings: "id", // id 단일 키 (예: 'global')
    });
  }
}

// 싱글톤 인스턴스
export const db = new GodLifeDB();

export async function resetDB() {
  await db.delete(); // 전체 DB 삭제
  await db.open(); // 다시 초기화해서 오류 방지
}
