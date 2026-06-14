import { Check, Clock3, MoreHorizontal, Play, RotateCcw } from "lucide-react";
import { formatDuration } from "../lib/stats";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  actualSeconds: number;
  focusLabel?: string;
  timerTaskId?: number;
  onToggle: () => void;
  onStart: () => void;
  onEdit: () => void;
}

export function TaskItem({
  task,
  actualSeconds,
  focusLabel,
  timerTaskId,
  onToggle,
  onStart,
  onEdit
}: TaskItemProps) {
  const isDone = task.status === "done";
  return (
    <article className={`task-item ${isDone ? "done" : ""}`}>
      <button
        className="task-check"
        onClick={onToggle}
        aria-label={isDone ? "恢复未完成" : "标记完成"}
        title={isDone ? "恢复未完成" : "标记完成"}
      >
        {isDone ? <Check size={17} /> : null}
      </button>
      <div className="task-copy">
        <strong>{task.title}</strong>
        <div className="task-meta">
          {focusLabel ? <span>{focusLabel}</span> : null}
          <span><Clock3 size={13} /> 预计 {task.estimateMinutes} 分钟</span>
          <span>实际 {formatDuration(actualSeconds)}</span>
        </div>
      </div>
      {!isDone && timerTaskId !== task.id ? (
        <button className="icon-button accent" onClick={onStart} aria-label="开始计时" title="开始计时">
          <Play size={17} />
        </button>
      ) : null}
      <button className="icon-button subtle" onClick={onEdit} aria-label="编辑任务" title="编辑任务">
        {isDone ? <RotateCcw size={16} /> : <MoreHorizontal size={18} />}
      </button>
    </article>
  );
}
