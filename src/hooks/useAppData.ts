import { useCallback, useEffect, useState } from "react";
import { db } from "../db";
import { getWeekDays, toDateKey } from "../lib/dates";
import type {
  ActiveTimer,
  DailyLog,
  Task,
  TimeEntry,
  WeekPlan,
  WeeklyReview
} from "../types";

export function useAppData(weekStart: string) {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const dayKeys = getWeekDays(weekStart).map(toDateKey);
    const [plan, allTasks, logs, allReviews, timer] = await Promise.all([
      db.weekPlans.where("weekStart").equals(weekStart).first(),
      db.tasks.where("date").anyOf(dayKeys).toArray(),
      db.dailyLogs.where("date").anyOf(dayKeys).toArray(),
      db.weeklyReviews.orderBy("weekStart").reverse().toArray(),
      db.activeTimers.get("active")
    ]);
    const taskIds = allTasks.flatMap((task) => (task.id ? [task.id] : []));
    const entries = taskIds.length
      ? await db.timeEntries.where("taskId").anyOf(taskIds).toArray()
      : [];

    setWeekPlan(plan);
    setTasks(allTasks.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    setTimeEntries(entries);
    setDailyLogs(logs);
    setReviews(allReviews);
    setActiveTimer(timer);
    setLoading(false);
  }, [weekStart]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    weekPlan,
    tasks,
    timeEntries,
    dailyLogs,
    reviews,
    activeTimer,
    loading,
    refresh
  };
}
