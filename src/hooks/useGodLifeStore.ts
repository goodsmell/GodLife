import { useEffect, useState } from "react";
import type { DayLog, Setting, StartOfDay } from "../types/setting";
import {
  getAllLogs,
  getLogByDate,
  getSetting,
  updateSetting,
  upsertLog,
} from "../db/godlifeRepository";
import { resetDB } from "../db/godlifeDB";

type GodLifeState = {
  setting: Setting | null;
  logs: DayLog[];
  loading: boolean;
};

export function useGodLifeStore() {
  const [state, setState] = useState<GodLifeState>({
    setting: null,
    logs: [],
    loading: true,
  });

  // 초기 로딩
  useEffect(() => {
    async function load() {
      const [setting, logs] = await Promise.all([getSetting(), getAllLogs()]);
      setState({ setting, logs, loading: false });
    }
    load();
  }, []);

  const setStartOfDay = async (startOfDay: StartOfDay) => {
    await updateSetting({ startOfDay });
    setState((prev) =>
      prev.setting
        ? { ...prev, setting: { ...prev.setting, startOfDay } }
        : prev,
    );
  };
  const updateSettings = async (partial: Partial<Omit<Setting, "id">>) => {
    await updateSetting(partial);
    setState((prev) =>
      prev.setting
        ? { ...prev, setting: { ...prev.setting, ...partial } }
        : prev,
    );
  };

  const saveDayLog = async (log: DayLog) => {
    await upsertLog(log);
    const logs = await getAllLogs();
    setState((prev) => ({ ...prev, logs }));
  };

  const getTodayLog = async (date: string) => {
    return getLogByDate(date);
  };

  const resetAll = async () => {
    await resetDB();

    setState({
      setting: null,
      logs: [],
      loading: false,
    });
  };

  return {
    state,
    setStartOfDay,
    updateSettings,
    saveDayLog,
    getTodayLog,
    resetAll,
  };
}
