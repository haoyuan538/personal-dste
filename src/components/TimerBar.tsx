import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import type { ActiveTimer, Task } from "../types";

function currentSeconds(timer: ActiveTimer) {
  if (!timer.running) return timer.accumulatedSeconds;
  return timer.accumulatedSeconds + Math.max(0, Math.floor((Date.now() - Date.parse(timer.startedAt)) / 1000));
}

function clock(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
}

interface TimerBarProps {
  timer?: ActiveTimer;
  task?: Task;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TimerBar({ timer, task, onPause, onResume, onStop }: TimerBarProps) {
  const [seconds, setSeconds] = useState(timer ? currentSeconds(timer) : 0);

  useEffect(() => {
    setSeconds(timer ? currentSeconds(timer) : 0);
    if (!timer?.running) return;
    const interval = window.setInterval(() => setSeconds(currentSeconds(timer)), 1000);
    return () => window.clearInterval(interval);
  }, [timer]);

  if (!timer || !task) return null;

  return (
    <aside className="timer-bar">
      <div>
        <span className="eyebrow">{timer.running ? "正在专注" : "计时已暂停"}</span>
        <strong>{task.title}</strong>
      </div>
      <time>{clock(seconds)}</time>
      <div className="timer-actions">
        <button
          className="icon-button inverse"
          onClick={timer.running ? onPause : onResume}
          aria-label={timer.running ? "暂停" : "继续"}
          title={timer.running ? "暂停" : "继续"}
        >
          {timer.running ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button className="icon-button inverse" onClick={onStop} aria-label="结束" title="结束">
          <Square size={17} />
        </button>
      </div>
    </aside>
  );
}
