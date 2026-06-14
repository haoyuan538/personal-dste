import Dexie, { type EntityTable } from "dexie";
import type {
  ActiveTimer,
  DailyLog,
  Task,
  TimeEntry,
  WeekPlan,
  WeeklyReview
} from "./types";

class DsteDatabase extends Dexie {
  weekPlans!: EntityTable<WeekPlan, "id">;
  tasks!: EntityTable<Task, "id">;
  timeEntries!: EntityTable<TimeEntry, "id">;
  activeTimers!: EntityTable<ActiveTimer, "id">;
  dailyLogs!: EntityTable<DailyLog, "id">;
  weeklyReviews!: EntityTable<WeeklyReview, "id">;

  constructor() {
    super("personal-dste");
    this.version(1).stores({
      weekPlans: "++id, &weekStart",
      tasks: "++id, date, status, focusIndex",
      timeEntries: "++id, taskId, startedAt",
      activeTimers: "&id, taskId",
      dailyLogs: "++id, &date",
      weeklyReviews: "++id, &weekStart"
    });
  }
}

export const db = new DsteDatabase();
