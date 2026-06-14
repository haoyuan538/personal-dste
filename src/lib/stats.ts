import type { Task, TimeEntry, WeekPlan, WeeklySnapshot } from "../types";

export function secondsForTask(taskId: number, entries: TimeEntry[]) {
  return entries
    .filter((entry) => entry.taskId === taskId)
    .reduce((sum, entry) => sum + entry.seconds, 0);
}

export function buildWeeklySnapshot(
  tasks: Task[],
  entries: TimeEntry[],
  plan: WeekPlan | undefined,
  wins: string[]
): WeeklySnapshot {
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const focusSeconds = (plan?.focuses ?? []).map((_, index) =>
    tasks
      .filter((task) => task.focusIndex === index && task.id)
      .reduce((sum, task) => sum + secondsForTask(task.id!, entries), 0)
  );
  const totalSeconds = entries.reduce((sum, entry) => sum + entry.seconds, 0);

  return {
    totalTasks: tasks.length,
    completedTasks,
    completionRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
    totalSeconds,
    focusSeconds,
    wins
  };
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}分钟`;
  return minutes ? `${hours}小时${minutes}分钟` : `${hours}小时`;
}
