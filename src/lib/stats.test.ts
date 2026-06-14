import { describe, expect, it } from "vitest";
import { buildWeeklySnapshot, formatDuration, secondsForTask } from "./stats";
import type { Task, TimeEntry, WeekPlan } from "../types";

const tasks: Task[] = [
  { id: 1, title: "写报告", date: "2026-06-08", focusIndex: 0, estimateMinutes: 30, status: "done", completedAt: "2026-06-08T10:00:00Z", createdAt: "2026-06-08T09:00:00Z" },
  { id: 2, title: "运动", date: "2026-06-09", focusIndex: 1, estimateMinutes: 20, status: "open", completedAt: null, createdAt: "2026-06-09T09:00:00Z" }
];

const entries: TimeEntry[] = [
  { id: 1, taskId: 1, startedAt: "2026-06-08T09:00:00Z", endedAt: "2026-06-08T09:30:00Z", seconds: 1800, source: "timer" },
  { id: 2, taskId: 1, startedAt: "2026-06-08T10:00:00Z", endedAt: "2026-06-08T10:10:00Z", seconds: 600, source: "manual" },
  { id: 3, taskId: 2, startedAt: "2026-06-09T09:00:00Z", endedAt: "2026-06-09T09:20:00Z", seconds: 1200, source: "timer" }
];

const plan: WeekPlan = {
  id: 1,
  weekStart: "2026-06-08",
  focuses: ["副业验证", "健康"],
  rawNote: "",
  organized: { plans: [], wins: [], blocks: [], nextSteps: [], unclassified: [] },
  updatedAt: "2026-06-08T00:00:00Z"
};

describe("weekly statistics", () => {
  it("sums timer and manual entries for the same task", () => {
    expect(secondsForTask(1, entries)).toBe(2400);
  });

  it("builds completion and focus statistics", () => {
    expect(buildWeeklySnapshot(tasks, entries, plan, ["完成第一次发布"])).toEqual({
      totalTasks: 2,
      completedTasks: 1,
      completionRate: 50,
      totalSeconds: 3600,
      focusSeconds: [2400, 1200],
      wins: ["完成第一次发布"]
    });
  });

  it("formats durations for display", () => {
    expect(formatDuration(3600)).toBe("1小时");
    expect(formatDuration(3900)).toBe("1小时5分钟");
  });
});
