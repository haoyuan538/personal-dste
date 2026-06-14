import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import type { Task } from "../types";

interface TaskDialogProps {
  open: boolean;
  date: string;
  focuses: string[];
  task?: Task;
  onClose: () => void;
  onSave: (value: Pick<Task, "title" | "date" | "focusIndex" | "estimateMinutes">) => void;
  onDelete?: () => void;
  onManualTime?: (minutes: number) => void;
}

export function TaskDialog({
  open,
  date,
  focuses,
  task,
  onClose,
  onSave,
  onDelete,
  onManualTime
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [taskDate, setTaskDate] = useState(date);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [estimateMinutes, setEstimateMinutes] = useState(30);
  const [manualMinutes, setManualMinutes] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setTaskDate(task?.date ?? date);
    setFocusIndex(task?.focusIndex ?? null);
    setEstimateMinutes(task?.estimateMinutes ?? 30);
    setManualMinutes(0);
  }, [open, task, date]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="dialog" role="dialog" aria-modal="true" aria-label={task ? "编辑任务" : "新建任务"} onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header">
          <h2>{task ? "编辑任务" : "新建任务"}</h2>
          <button className="icon-button" onClick={onClose} aria-label="关闭" title="关闭">
            <X size={19} />
          </button>
        </header>
        <label className="field">
          <span>任务</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="一个能完成的具体动作" autoFocus />
        </label>
        <div className="field-row">
          <label className="field">
            <span>日期</span>
            <input type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} />
          </label>
          <label className="field">
            <span>预计分钟</span>
            <input type="number" min="5" step="5" value={estimateMinutes} onChange={(event) => setEstimateMinutes(Number(event.target.value))} />
          </label>
        </div>
        <label className="field">
          <span>所属重点</span>
          <select value={focusIndex ?? ""} onChange={(event) => setFocusIndex(event.target.value === "" ? null : Number(event.target.value))}>
            <option value="">不关联重点</option>
            {focuses.map((focus, index) => <option key={`${focus}-${index}`} value={index}>{focus}</option>)}
          </select>
        </label>
        {task && onManualTime ? (
          <div className="manual-time">
            <label className="field">
              <span>补录时间（分钟）</span>
              <input type="number" min="0" step="5" value={manualMinutes} onChange={(event) => setManualMinutes(Number(event.target.value))} />
            </label>
            <button className="secondary-button" disabled={!manualMinutes} onClick={() => onManualTime(manualMinutes)}>添加</button>
          </div>
        ) : null}
        <footer className="dialog-footer">
          {task && onDelete ? (
            <button className="danger-icon" onClick={onDelete} aria-label="删除任务" title="删除任务">
              <Trash2 size={18} />
            </button>
          ) : <span />}
          <button
            className="primary-button"
            disabled={!title.trim()}
            onClick={() => onSave({ title: title.trim(), date: taskDate, focusIndex, estimateMinutes })}
          >
            保存任务
          </button>
        </footer>
      </section>
    </div>
  );
}
