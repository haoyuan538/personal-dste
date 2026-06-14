export const DATA_VERSION = 1;

export type NoteCategory = "plans" | "wins" | "blocks" | "nextSteps" | "unclassified";
export type OrganizedNotes = Record<NoteCategory, string[]>;

export interface WeekPlan {
  id?: number;
  weekStart: string;
  focuses: string[];
  rawNote: string;
  organized: OrganizedNotes;
  updatedAt: string;
}

export type TaskStatus = "open" | "done";

export interface Task {
  id?: number;
  title: string;
  date: string;
  focusIndex: number | null;
  estimateMinutes: number;
  status: TaskStatus;
  completedAt: string | null;
  createdAt: string;
}

export interface TimeEntry {
  id?: number;
  taskId: number;
  startedAt: string;
  endedAt: string;
  seconds: number;
  source: "timer" | "manual";
}

export interface ActiveTimer {
  id: "active";
  taskId: number;
  startedAt: string;
  accumulatedSeconds: number;
  running: boolean;
}

export interface DailyLog {
  id?: number;
  date: string;
  rawNote: string;
  organized: OrganizedNotes;
  updatedAt: string;
}

export interface ReviewAnswers {
  progress: string;
  evidence: string;
  timeReflection: string;
  deviation: string;
  adjustment: string;
}

export interface WeeklySnapshot {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalSeconds: number;
  focusSeconds: number[];
  wins: string[];
}

export interface WeeklyReview {
  id?: number;
  weekStart: string;
  snapshot: WeeklySnapshot;
  answers: ReviewAnswers;
  report: string;
  nextFocuses: string[];
  updatedAt: string;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  data: {
    weekPlans: WeekPlan[];
    tasks: Task[];
    timeEntries: TimeEntry[];
    dailyLogs: DailyLog[];
    weeklyReviews: WeeklyReview[];
  };
}
