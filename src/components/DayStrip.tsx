import { format } from "date-fns";
import { formatDayLabel, getWeekDays, isToday, toDateKey } from "../lib/dates";

interface DayStripProps {
  weekStart: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  counts: Record<string, { done: number; total: number }>;
}

export function DayStrip({ weekStart, selectedDate, onSelect, counts }: DayStripProps) {
  return (
    <div className="day-strip" aria-label="本周日期">
      {getWeekDays(weekStart).map((date) => {
        const key = toDateKey(date);
        const count = counts[key];
        return (
          <button
            key={key}
            className={`day-button ${key === selectedDate ? "selected" : ""} ${isToday(date) ? "today" : ""}`}
            onClick={() => onSelect(key)}
          >
            <span>{formatDayLabel(date)}</span>
            <strong>{format(date, "d")}</strong>
            <small>{count?.total ? `${count.done}/${count.total}` : "·"}</small>
          </button>
        );
      })}
    </div>
  );
}
