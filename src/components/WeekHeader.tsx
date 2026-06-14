import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange } from "../lib/dates";

interface WeekHeaderProps {
  weekStart: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekHeader({ weekStart, onPrevious, onNext, onToday }: WeekHeaderProps) {
  return (
    <div className="week-header">
      <button className="icon-button" onClick={onPrevious} aria-label="上一周" title="上一周">
        <ChevronLeft size={20} />
      </button>
      <button className="week-title" onClick={onToday}>
        <strong>{formatWeekRange(weekStart)}</strong>
        <span>回到本周</span>
      </button>
      <button className="icon-button" onClick={onNext} aria-label="下一周" title="下一周">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
