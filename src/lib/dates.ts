import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek
} from "date-fns";
import { zhCN } from "date-fns/locale";

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function getWeekStart(date: Date | string) {
  const value = typeof date === "string" ? parseISO(date) : date;
  return toDateKey(startOfWeek(value, { weekStartsOn: 1 }));
}

export function getWeekDays(weekStart: string) {
  const start = parseISO(weekStart);
  return eachDayOfInterval({
    start,
    end: endOfWeek(start, { weekStartsOn: 1 })
  });
}

export function shiftWeek(weekStart: string, amount: number) {
  return getWeekStart(addWeeks(parseISO(weekStart), amount));
}

export function nextWeekDate(dateKey: string) {
  return toDateKey(addDays(parseISO(dateKey), 7));
}

export function formatWeekRange(weekStart: string) {
  const days = getWeekDays(weekStart);
  return `${format(days[0], "M月d日")} - ${format(days[6], "M月d日")}`;
}

export function formatDayLabel(date: Date) {
  return format(date, "EEE", { locale: zhCN }).replace("周", "");
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}
