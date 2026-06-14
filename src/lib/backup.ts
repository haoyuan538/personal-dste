import { db } from "../db";
import { DATA_VERSION, type BackupPayload } from "../types";

export async function createBackup(): Promise<BackupPayload> {
  const [weekPlans, tasks, timeEntries, dailyLogs, weeklyReviews] = await Promise.all([
    db.weekPlans.toArray(),
    db.tasks.toArray(),
    db.timeEntries.toArray(),
    db.dailyLogs.toArray(),
    db.weeklyReviews.toArray()
  ]);

  return {
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    data: { weekPlans, tasks, timeEntries, dailyLogs, weeklyReviews }
  };
}

export function validateBackup(value: unknown): value is BackupPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<BackupPayload>;
  if (payload.version !== DATA_VERSION || !payload.data) return false;
  const data = payload.data as BackupPayload["data"];
  return ["weekPlans", "tasks", "timeEntries", "dailyLogs", "weeklyReviews"].every((key) =>
    Array.isArray(data[key as keyof typeof data])
  );
}

export async function restoreBackup(payload: BackupPayload) {
  await db.transaction(
    "rw",
    [db.weekPlans, db.tasks, db.timeEntries, db.activeTimers, db.dailyLogs, db.weeklyReviews],
    async () => {
      await Promise.all([
        db.weekPlans.clear(),
        db.tasks.clear(),
        db.timeEntries.clear(),
        db.activeTimers.clear(),
        db.dailyLogs.clear(),
        db.weeklyReviews.clear()
      ]);
      await db.weekPlans.bulkAdd(payload.data.weekPlans);
      await db.tasks.bulkAdd(payload.data.tasks);
      await db.timeEntries.bulkAdd(payload.data.timeEntries);
      await db.dailyLogs.bulkAdd(payload.data.dailyLogs);
      await db.weeklyReviews.bulkAdd(payload.data.weeklyReviews);
    }
  );
}

export async function clearAllData() {
  await db.transaction(
    "rw",
    [db.weekPlans, db.tasks, db.timeEntries, db.activeTimers, db.dailyLogs, db.weeklyReviews],
    async () => {
      await Promise.all(db.tables.map((table) => table.clear()));
    }
  );
}
