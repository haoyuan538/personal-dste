import { useEffect, useMemo, useState } from "react";
import {
  ArchiveRestore,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  ListTodo,
  Plus,
  Save,
  Settings,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
  Upload,
  WandSparkles
} from "lucide-react";
import { db } from "./db";
import { useAppData } from "./hooks/useAppData";
import { clearAllData, createBackup, restoreBackup, validateBackup } from "./lib/backup";
import { getWeekStart, nextWeekDate, shiftWeek, toDateKey } from "./lib/dates";
import { emptyOrganizedNotes, organizeText } from "./lib/organize";
import { buildWeeklySnapshot, formatDuration, secondsForTask } from "./lib/stats";
import type { OrganizedNotes, ReviewAnswers, Task, TimeEntry, WeekPlan } from "./types";
import { DayStrip } from "./components/DayStrip";
import { OrganizedEditor } from "./components/OrganizedEditor";
import { TaskDialog } from "./components/TaskDialog";
import { TaskItem } from "./components/TaskItem";
import { TimerBar } from "./components/TimerBar";
import { WeekHeader } from "./components/WeekHeader";

type View = "strategy" | "plan" | "tasks" | "review" | "settings";

const emptyAnswers: ReviewAnswers = {
  progress: "",
  evidence: "",
  timeReflection: "",
  deviation: "",
  adjustment: ""
};

const categoryLabels: Record<keyof OrganizedNotes, string> = {
  plans: "计划",
  wins: "收获",
  blocks: "阻碍",
  nextSteps: "下一步",
  unclassified: "待整理"
};

const weeklyExecution = [
  { time: "周一至周五上午", effort: "1h/天", task: "紫微输入：星曜、宫位、流年、大运、案例笔记" },
  { time: "周一至周五下午/晚上", effort: "2h/天", task: "看盘、复盘、邀约、内容、客户沟通" },
  { time: "周六", effort: "6h", task: "集中咨询、案例整理、内容批量制作" },
  { time: "周日", effort: "6h", task: "周复盘、下周任务、AI 视频实验、生活收口" }
];

const dailyMinimums = [
  { module: "紫微输入", action: "1 个知识点 + 1 条案例笔记" },
  { module: "紫微输出", action: "1 次看盘/复盘/邀约/内容输出" },
  { module: "AI 流量", action: "每周 2-3 条 AI 视频实验" },
  { module: "生活状态", action: "护肤 + 10 分钟房间收口" }
];

const roadmap2026 = [
  { month: "2026-07", goal: "稳住能力，开始样本盘", tasks: "每天上午补紫微基础；完成 6-8 个免费/低价样本盘；建立看盘模板；列出 20 个可邀约对象", checks: "1 套看盘提纲；至少 6 个案例记录；发出第一批邀约" },
  { month: "2026-08", goal: "开始收费验证", tasks: "推出 99-199 元体验咨询；每周 2 条紫微内容；每周 2 条 AI 视频；完成熟人付费转化", checks: "3-5 个付费单；副业收入 500-1000；知道客户最常问什么" },
  { month: "2026-09", goal: "固定咨询 SOP", tasks: "固定预约问题、看盘结构、交付总结、复盘表；开始整理客户反馈；内容加入咨询入口", checks: "累计 10 个付费单；副业收入 1000-2000；有标准服务说明" },
  { month: "2026-10", goal: "提价与陌生线索", tasks: "标准咨询提到 199-399；每周 3 条紫微内容；AI 视频保留播放较好的方向", checks: "单月收入 2000-3000；至少 5 个陌生/半熟人咨询线索" },
  { month: "2026-11", goal: "打磨转介绍", tasks: "做 3 个代表案例；邀请老客户反馈和转介绍；测试 399-699 深度咨询", checks: "单月收入 3000-5000；出现复购或转介绍" },
  { month: "2026-12", goal: "年底冲刺复盘", tasks: "集中成交；复盘全年案例、收入、内容、AI 流量；制定 2027 产品价格表", checks: "单月收入 5000+；累计 20+ 付费单；形成 2027 服务矩阵" }
];

const roadmap2027 = [
  { month: "2027-01", goal: "服务矩阵上线", tasks: "明确三类产品：文字简析、标准咨询、深度咨询；统一价格和交付", checks: "单月收入 5000+；客户知道怎么买" },
  { month: "2027-02", goal: "内容获客稳定", tasks: "固定一个主平台；紫微内容每周 3 条；AI 视频每周 2-3 条", checks: "每月 10+ 咨询线索" },
  { month: "2027-03", goal: "高价服务测试", tasks: "标准咨询稳定 399-699；深度咨询测试 999+", checks: "单月收入 8000+；至少 1 单高价" },
  { month: "2027-04", goal: "案例库成型", tasks: "整理职业、感情、流年、性格四类案例；内容围绕案例输出", checks: "30 个可复用案例；转化率提升" },
  { month: "2027-05", goal: "AI 提效内容", tasks: "用 AI 做选题、脚本、标题、视频生成；保留能带线索的内容形式", checks: "每周稳定发布 5 条内容" },
  { month: "2027-06", goal: "半年复盘与加速", tasks: "复盘成交来源；砍掉无效 AI 视频方向；提高咨询价格或套餐", checks: "单月收入 10000+" },
  { month: "2027-07", goal: "陌生客户主导", tasks: "从熟人市场转向陌生客户；内容入口、私信话术、咨询表单固定", checks: "陌生客户占比超过 50%" },
  { month: "2027-08", goal: "长期服务测试", tasks: "推出年度流年/职业规划、季度陪伴或复盘服务", checks: "至少 2 个长期服务客户" },
  { month: "2027-09", goal: "个人方法论成型", tasks: "紫微 + MBTI + 易经 + AI 整合成解释框架，只保留案例验证过的部分", checks: "能清楚讲出你的差异化" },
  { month: "2027-10", goal: "月入 15000 冲刺", tasks: "提高高价服务比例；减少低价消耗型订单；集中做转介绍", checks: "单月收入 15000+" },
  { month: "2027-11", goal: "月入 20000 测试", tasks: "组合咨询、年度服务、复购转介绍；内容强转化", checks: "单月冲击 20000" },
  { month: "2027-12", goal: "第二年总复盘", tasks: "复盘收入、客户、内容、AI、时间投入、生活状态；判断 2028 是否主业降权", checks: "单月收入 20000+ 或找到明确差距" }
];

const monthlyReviewQuestions = [
  "本月收入是多少？距离目标差多少？",
  "本月付费订单几个？线索从哪里来？",
  "上午输入有没有让看盘更稳？",
  "下午输出是否真的产生了案例、内容、邀约、成交？",
  "AI 视频有没有带来播放、关注、私信或咨询？",
  "是能力不够、获客不够，还是不敢收费？",
  "下个月只保留哪 3 个重点？"
];

function App() {
  const [view, setView] = useState<View>("plan");
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const [toast, setToast] = useState("");
  const data = useAppData(weekStart);

  const focuses = data.weekPlan?.focuses ?? [];
  const dayCounts = useMemo(() => {
    return data.tasks.reduce<Record<string, { done: number; total: number }>>((result, task) => {
      result[task.date] ??= { done: 0, total: 0 };
      result[task.date].total += 1;
      if (task.status === "done") result[task.date].done += 1;
      return result;
    }, {});
  }, [data.tasks]);
  const selectedTasks = data.tasks.filter((task) => task.date === selectedDate);
  const activeTask = data.tasks.find((task) => task.id === data.activeTimer?.taskId);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const changeWeek = (amount: number) => {
    const next = shiftWeek(weekStart, amount);
    setWeekStart(next);
    setSelectedDate(next);
  };

  const saveWeekPlan = async (updates: Partial<WeekPlan>) => {
    const next: WeekPlan = {
      weekStart,
      focuses,
      rawNote: "",
      organized: emptyOrganizedNotes(),
      updatedAt: new Date().toISOString(),
      ...data.weekPlan,
      ...updates
    };
    await db.weekPlans.put(next);
    await data.refresh();
  };

  const saveTask = async (value: Pick<Task, "title" | "date" | "focusIndex" | "estimateMinutes">) => {
    if (editingTask?.id) {
      await db.tasks.update(editingTask.id, value);
    } else {
      await db.tasks.add({
        ...value,
        status: "open",
        completedAt: null,
        createdAt: new Date().toISOString()
      });
    }
    setTaskDialogOpen(false);
    setEditingTask(undefined);
    await data.refresh();
    notify(editingTask ? "任务已更新" : "任务已加入今天");
  };

  const deleteTask = async () => {
    if (!editingTask?.id) return;
    if (data.activeTimer?.taskId === editingTask.id) {
      await db.activeTimers.delete("active");
    }
    await db.transaction("rw", [db.tasks, db.timeEntries], async () => {
      await db.tasks.delete(editingTask.id!);
      await db.timeEntries.where("taskId").equals(editingTask.id!).delete();
    });
    setTaskDialogOpen(false);
    setEditingTask(undefined);
    await data.refresh();
    notify("任务已删除");
  };

  const toggleTask = async (task: Task) => {
    if (!task.id) return;
    const done = task.status !== "done";
    await db.tasks.update(task.id, {
      status: done ? "done" : "open",
      completedAt: done ? new Date().toISOString() : null
    });
    await data.refresh();
  };

  const startTimer = async (task: Task) => {
    if (!task.id) return;
    if (data.activeTimer && data.activeTimer.taskId !== task.id) {
      notify("请先结束当前计时");
      return;
    }
    await db.activeTimers.put({
      id: "active",
      taskId: task.id,
      startedAt: new Date().toISOString(),
      accumulatedSeconds: data.activeTimer?.accumulatedSeconds ?? 0,
      running: true
    });
    await data.refresh();
  };

  const pauseTimer = async () => {
    const timer = data.activeTimer;
    if (!timer?.running) return;
    const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(timer.startedAt)) / 1000));
    await db.activeTimers.put({
      ...timer,
      accumulatedSeconds: timer.accumulatedSeconds + elapsed,
      running: false
    });
    await data.refresh();
  };

  const resumeTimer = async () => {
    const timer = data.activeTimer;
    if (!timer || timer.running) return;
    await db.activeTimers.put({
      ...timer,
      startedAt: new Date().toISOString(),
      running: true
    });
    await data.refresh();
  };

  const stopTimer = async () => {
    const timer = data.activeTimer;
    if (!timer) return;
    const elapsed = timer.running
      ? Math.max(0, Math.floor((Date.now() - Date.parse(timer.startedAt)) / 1000))
      : 0;
    const seconds = timer.accumulatedSeconds + elapsed;
    if (seconds > 0) {
      await db.timeEntries.add({
        taskId: timer.taskId,
        startedAt: timer.startedAt,
        endedAt: new Date().toISOString(),
        seconds,
        source: "timer"
      });
    }
    await db.activeTimers.delete("active");
    await data.refresh();
    notify(`已记录 ${formatDuration(seconds)}`);
  };

  const addManualTime = async (minutes: number) => {
    if (!editingTask?.id || minutes <= 0) return;
    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - minutes * 60_000);
    await db.timeEntries.add({
      taskId: editingTask.id,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      seconds: minutes * 60,
      source: "manual"
    });
    await data.refresh();
    notify(`补录了 ${minutes} 分钟`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><span /></div>
        <div>
          <h1>生长周记</h1>
          <p>把想法变成行动证据</p>
        </div>
      </header>

      <main>
        <WeekHeader
          weekStart={weekStart}
          onPrevious={() => changeWeek(-1)}
          onNext={() => changeWeek(1)}
          onToday={() => {
            const today = new Date();
            setWeekStart(getWeekStart(today));
            setSelectedDate(toDateKey(today));
          }}
        />
        {view !== "settings" && view !== "strategy" ? (
          <DayStrip weekStart={weekStart} selectedDate={selectedDate} onSelect={setSelectedDate} counts={dayCounts} />
        ) : null}

        {data.loading ? <div className="loading">正在读取本机记录…</div> : null}
        {!data.loading && view === "strategy" ? <StrategyView /> : null}

        {!data.loading && view === "plan" ? (
          <PlanView
            weekPlan={data.weekPlan}
            selectedDate={selectedDate}
            dailyLog={data.dailyLogs.find((log) => log.date === selectedDate)}
            tasks={selectedTasks}
            entries={data.timeEntries}
            onSaveWeek={saveWeekPlan}
            onRefresh={data.refresh}
            notify={notify}
            onNewTask={() => {
              setEditingTask(undefined);
              setTaskDialogOpen(true);
            }}
          />
        ) : null}

        {!data.loading && view === "tasks" ? (
          <TasksView
            tasks={selectedTasks}
            focuses={focuses}
            entries={data.timeEntries}
            activeTaskId={data.activeTimer?.taskId}
            onNew={() => {
              setEditingTask(undefined);
              setTaskDialogOpen(true);
            }}
            onToggle={toggleTask}
            onStart={startTimer}
            onEdit={(task) => {
              setEditingTask(task);
              setTaskDialogOpen(true);
            }}
          />
        ) : null}

        {!data.loading && view === "review" ? (
          <ReviewView
            weekStart={weekStart}
            plan={data.weekPlan}
            tasks={data.tasks}
            entries={data.timeEntries}
            wins={data.dailyLogs.flatMap((log) => log.organized.wins)}
            savedReview={data.reviews.find((review) => review.weekStart === weekStart)}
            history={data.reviews}
            onSaved={async () => {
              await data.refresh();
              notify("周复盘已保存");
            }}
            onRollover={async (mode) => {
              const openTasks = data.tasks.filter((task) => task.status === "open" && task.id);
              if (mode === "keep") notify("未完成任务保留在本周");
              if (mode === "move") {
                await Promise.all(openTasks.map((task) => db.tasks.update(task.id!, { date: nextWeekDate(task.date) })));
                notify(`${openTasks.length} 个任务已移到下周`);
              }
              if (mode === "delete") {
                if (!window.confirm(`确定删除本周 ${openTasks.length} 个未完成任务吗？`)) return;
                await db.transaction("rw", [db.tasks, db.timeEntries], async () => {
                  const ids = openTasks.map((task) => task.id!);
                  await db.tasks.bulkDelete(ids);
                  await db.timeEntries.where("taskId").anyOf(ids).delete();
                });
                notify("未完成任务已删除");
              }
              await data.refresh();
            }}
          />
        ) : null}

        {!data.loading && view === "settings" ? (
          <SettingsView notify={notify} onChanged={data.refresh} />
        ) : null}
      </main>

      <TimerBar
        timer={data.activeTimer}
        task={activeTask}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onStop={stopTimer}
      />

      <nav className="bottom-nav" aria-label="主要功能">
        <NavButton active={view === "strategy"} label="冲刺" icon={<Target size={21} />} onClick={() => setView("strategy")} />
        <NavButton active={view === "plan"} label="计划" icon={<CalendarDays size={21} />} onClick={() => setView("plan")} />
        <NavButton active={view === "tasks"} label="执行" icon={<CheckCircle2 size={21} />} onClick={() => setView("tasks")} />
        <NavButton active={view === "review"} label="复盘" icon={<BarChart3 size={21} />} onClick={() => setView("review")} />
        <NavButton active={view === "settings"} label="设置" icon={<Settings size={21} />} onClick={() => setView("settings")} />
      </nav>

      <TaskDialog
        open={taskDialogOpen}
        date={selectedDate}
        focuses={focuses}
        task={editingTask}
        onClose={() => {
          setTaskDialogOpen(false);
          setEditingTask(undefined);
        }}
        onSave={saveTask}
        onDelete={editingTask ? deleteTask : undefined}
        onManualTime={editingTask ? addManualTime : undefined}
      />
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StrategyView() {
  return (
    <div className="content-stack strategy-page">
      <section className="strategy-hero">
        <span className="eyebrow">2026 下半年 + 2027</span>
        <h2>紫微副业冲刺计划</h2>
        <p>主线是紫微斗数付费咨询，AI 只做内容流量和效率工具。第一阶段年底冲单月 5000+，第二阶段 2027 年底冲单月 20000+。</p>
        <div className="strategy-metrics">
          <div><span>每周投入</span><strong>27h</strong></div>
          <div><span>2026-12</span><strong>5000+</strong></div>
          <div><span>2027-12</span><strong>20000+</strong></div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">每周节奏</span><h2>输入和输出分开</h2></div>
          <Target size={22} />
        </div>
        <div className="strategy-table compact-table">
          {weeklyExecution.map((item) => (
            <div className="strategy-row" key={item.time}>
              <strong>{item.time}</strong>
              <span>{item.effort}</span>
              <p>{item.task}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">最低动作</span><h2>每天至少留下证据</h2></div>
        </div>
        <div className="minimum-grid">
          {dailyMinimums.map((item) => (
            <div key={item.module}>
              <span>{item.module}</span>
              <strong>{item.action}</strong>
            </div>
          ))}
        </div>
      </section>

      <RoadmapSection title="2026 下半年月度表" eyebrow="第一冲刺" items={roadmap2026} />
      <RoadmapSection title="2027 月度表" eyebrow="第二冲刺" items={roadmap2027} />

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">关键指标</span><h2>年底看结果，不看自我感动</h2></div>
        </div>
        <div className="target-grid">
          <div><span>单月副业收入</span><strong>2026: 5000+ / 2027: 20000+</strong></div>
          <div><span>累计付费订单</span><strong>2026: 20+ / 2027: 100+</strong></div>
          <div><span>代表案例</span><strong>2026: 10 个 / 2027: 50 个</strong></div>
          <div><span>内容发布</span><strong>2026: 每周 3-5 条 / 2027: 每周 5 条</strong></div>
        </div>
      </section>

      <section className="section-block review-prompts">
        <div className="section-heading">
          <div><span className="eyebrow">月底复盘</span><h2>必须回答的 7 个问题</h2></div>
        </div>
        <ol>
          {monthlyReviewQuestions.map((question) => <li key={question}>{question}</li>)}
        </ol>
      </section>
    </div>
  );
}

function RoadmapSection({ title, eyebrow, items }: { title: string; eyebrow: string; items: typeof roadmap2026 }) {
  return (
    <section className="section-block roadmap-section">
      <div className="section-heading">
        <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      </div>
      <div className="roadmap-list">
        {items.map((item) => (
          <article className="roadmap-card" key={item.month}>
            <div className="roadmap-card-head">
              <span>{item.month}</span>
              <strong>{item.goal}</strong>
            </div>
            <dl>
              <dt>关键任务</dt>
              <dd>{item.tasks}</dd>
              <dt>验收标准</dt>
              <dd>{item.checks}</dd>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

interface PlanViewProps {
  weekPlan?: WeekPlan;
  selectedDate: string;
  dailyLog?: { id?: number; date: string; rawNote: string; organized: OrganizedNotes; updatedAt: string };
  tasks: Task[];
  entries: TimeEntry[];
  onSaveWeek: (updates: Partial<WeekPlan>) => Promise<void>;
  onRefresh: () => Promise<void>;
  notify: (message: string) => void;
  onNewTask: () => void;
}

function PlanView({ weekPlan, selectedDate, dailyLog, tasks, entries, onSaveWeek, onRefresh, notify, onNewTask }: PlanViewProps) {
  const [focuses, setFocuses] = useState(weekPlan?.focuses ?? []);
  const [rawNote, setRawNote] = useState(dailyLog?.rawNote ?? "");
  const [organized, setOrganized] = useState(dailyLog?.organized ?? emptyOrganizedNotes());

  useEffect(() => {
    setFocuses(weekPlan?.focuses ?? []);
  }, [weekPlan?.updatedAt, weekPlan?.weekStart]);

  useEffect(() => {
    setRawNote(dailyLog?.rawNote ?? "");
    setOrganized(dailyLog?.organized ?? emptyOrganizedNotes());
  }, [dailyLog?.updatedAt, selectedDate]);

  const updateFocus = (index: number, value: string) => {
    const next = [...focuses];
    next[index] = value;
    setFocuses(next);
  };

  const saveLog = async () => {
    await db.dailyLogs.put({
      ...dailyLog,
      date: selectedDate,
      rawNote,
      organized,
      updatedAt: new Date().toISOString()
    });
    await onRefresh();
    notify("今天的记录已保存");
  };

  const copyForAi = async () => {
    const taskLines = tasks.map((task) => {
      const seconds = task.id
        ? entries.filter((entry) => entry.taskId === task.id).reduce((sum, entry) => sum + entry.seconds, 0)
        : 0;
      return `- ${task.status === "done" ? "[已完成]" : "[未完成]"} ${task.title}（实际 ${formatDuration(seconds)}）`;
    }).join("\n") || "- 暂无任务";
    const summary = (Object.keys(organized) as (keyof OrganizedNotes)[])
      .map((key) => `${categoryLabels[key]}：\n${organized[key].map((item) => `- ${item}`).join("\n") || "- 暂无"}`)
      .join("\n\n");
    const prompt = `你是我的个人 DSTE 教练。请把以下口语记录整理成简洁、可执行的中文要点。保留事实，不臆测；指出明显矛盾，并给出一周内能发生的下一步。输出：判断、计划、收获、阻碍、下一步。\n\n本周重点：${focuses.filter(Boolean).join("；") || "未设置"}\n\n今天任务：\n${taskLines}\n\n原始记录：\n${rawNote}\n\n本地初步整理：\n${summary}`;
    await navigator.clipboard.writeText(prompt);
    notify("已复制，可粘贴给 ChatGPT");
  };

  return (
    <div className="content-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">本周战略</span>
            <h2>最多三个重点</h2>
          </div>
          <button className="text-button" onClick={() => onSaveWeek({ focuses: focuses.map((item) => item.trim()).filter(Boolean).slice(0, 3) })}>
            <Save size={16} /> 保存
          </button>
        </div>
        <div className="focus-list">
          {[0, 1, 2].map((index) => (
            <label key={index}>
              <span>{index + 1}</span>
              <input
                value={focuses[index] ?? ""}
                onChange={(event) => updateFocus(index, event.target.value)}
                placeholder={index === 0 ? "这周最值得推进的事" : "另一个重要方向"}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="section-block note-capture">
        <div className="section-heading">
          <div>
            <span className="eyebrow">今日记录</span>
            <h2>先说出来，再整理</h2>
          </div>
          <span className="privacy-label">只存本机</span>
        </div>
        <textarea
          className="voice-textarea"
          value={rawNote}
          onChange={(event) => setRawNote(event.target.value)}
          placeholder="点开 iPhone 键盘的麦克风，说说今天想做什么、遇到什么、学到什么……"
        />
        <div className="action-row">
          <button className="primary-button" disabled={!rawNote.trim()} onClick={() => setOrganized(organizeText(rawNote))}>
            <Sparkles size={17} /> 本地整理
          </button>
          <button className="secondary-button" disabled={!rawNote.trim()} onClick={copyForAi}>
            <Clipboard size={17} /> 复制给 AI
          </button>
        </div>
        <OrganizedEditor value={organized} onChange={setOrganized} />
        <button className="wide-save" onClick={saveLog}><Save size={17} /> 保存今天</button>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">今日执行</span>
            <h2>{tasks.length ? `${tasks.filter((task) => task.status === "done").length}/${tasks.length} 已完成` : "还没有任务"}</h2>
          </div>
          <button className="icon-button accent" onClick={onNewTask} aria-label="新建任务" title="新建任务"><Plus size={19} /></button>
        </div>
        {tasks.slice(0, 3).map((task) => (
          <div className="compact-task" key={task.id}>
            <span className={task.status === "done" ? "complete-dot done" : "complete-dot"} />
            <strong>{task.title}</strong>
            <small>{formatDuration(task.id ? entries.filter((entry) => entry.taskId === task.id).reduce((sum, entry) => sum + entry.seconds, 0) : 0)}</small>
          </div>
        ))}
      </section>
    </div>
  );
}

interface TasksViewProps {
  tasks: Task[];
  focuses: string[];
  entries: TimeEntry[];
  activeTaskId?: number;
  onNew: () => void;
  onToggle: (task: Task) => void;
  onStart: (task: Task) => void;
  onEdit: (task: Task) => void;
}

function TasksView({ tasks, focuses, entries, activeTaskId, onNew, onToggle, onStart, onEdit }: TasksViewProps) {
  const totalSeconds = entries.reduce((sum, entry) => sum + entry.seconds, 0);
  return (
    <div className="content-stack">
      <section className="metrics-band">
        <div><span>完成</span><strong>{tasks.filter((task) => task.status === "done").length}/{tasks.length}</strong></div>
        <div><span>投入</span><strong>{formatDuration(totalSeconds)}</strong></div>
        <div><span>待办</span><strong>{tasks.filter((task) => task.status === "open").length}</strong></div>
      </section>
      <section className="section-block task-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">执行清单</span>
            <h2>今天真正要完成什么</h2>
          </div>
          <button className="primary-button compact" onClick={onNew}><Plus size={17} /> 新任务</button>
        </div>
        <div className="task-list">
          {tasks.length ? tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              actualSeconds={task.id ? secondsForTask(task.id, entries) : 0}
              focusLabel={task.focusIndex === null ? undefined : focuses[task.focusIndex]}
              timerTaskId={activeTaskId}
              onToggle={() => onToggle(task)}
              onStart={() => onStart(task)}
              onEdit={() => onEdit(task)}
            />
          )) : (
            <div className="empty-state">
              <ListTodo size={30} />
              <strong>把一个想法变成具体任务</strong>
              <p>任务越小，越容易得到真实的行动证据。</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ReviewViewProps {
  weekStart: string;
  plan?: WeekPlan;
  tasks: Task[];
  entries: TimeEntry[];
  wins: string[];
  savedReview?: { id?: number; weekStart: string; snapshot: ReturnType<typeof buildWeeklySnapshot>; answers: ReviewAnswers; report: string; nextFocuses: string[]; updatedAt: string };
  history: { weekStart: string; snapshot: ReturnType<typeof buildWeeklySnapshot> }[];
  onSaved: () => Promise<void>;
  onRollover: (mode: "keep" | "move" | "delete") => Promise<void>;
}

function ReviewView({ weekStart, plan, tasks, entries, wins, savedReview, history, onSaved, onRollover }: ReviewViewProps) {
  const snapshot = buildWeeklySnapshot(tasks, entries, plan, wins);
  const [answers, setAnswers] = useState(savedReview?.answers ?? emptyAnswers);
  const [report, setReport] = useState(savedReview?.report ?? "");
  const [nextFocuses, setNextFocuses] = useState(savedReview?.nextFocuses ?? []);

  const reviewKey = savedReview?.updatedAt ?? weekStart;
  useEffect(() => {
    setAnswers(savedReview?.answers ?? emptyAnswers);
    setReport(savedReview?.report ?? "");
    setNextFocuses(savedReview?.nextFocuses ?? []);
  }, [reviewKey]);

  const generateReport = () => {
    setReport(
      `本周共安排 ${snapshot.totalTasks} 项任务，完成 ${snapshot.completedTasks} 项，完成率 ${snapshot.completionRate}%。实际投入 ${formatDuration(snapshot.totalSeconds)}。\n\n` +
      `目标进展：${answers.progress || "待补充"}\n完成证据：${answers.evidence || "待补充"}\n时间判断：${answers.timeReflection || "待补充"}\n偏差原因：${answers.deviation || "待补充"}\n下周调整：${answers.adjustment || "待补充"}`
    );
  };

  const save = async () => {
    await db.weeklyReviews.put({
      ...savedReview,
      weekStart,
      snapshot,
      answers,
      report,
      nextFocuses: nextFocuses.map((item) => item.trim()).filter(Boolean).slice(0, 3),
      updatedAt: new Date().toISOString()
    });
    await onSaved();
  };

  const questionFields: { key: keyof ReviewAnswers; label: string; placeholder: string }[] = [
    { key: "progress", label: "目标进展", placeholder: "三个重点分别推进到了哪里？" },
    { key: "evidence", label: "完成证据", placeholder: "有哪些看得见的结果，而不只是感觉？" },
    { key: "timeReflection", label: "时间投入", placeholder: "时间花在哪里？和重点一致吗？" },
    { key: "deviation", label: "偏差原因", placeholder: "能力、系统、动机还是环境出了问题？" },
    { key: "adjustment", label: "下周调整", placeholder: "停止什么、继续什么、开始什么？" }
  ];

  return (
    <div className="content-stack">
      <section className="metrics-band review-metrics">
        <div><span>完成率</span><strong>{snapshot.completionRate}%</strong></div>
        <div><span>完成任务</span><strong>{snapshot.completedTasks}</strong></div>
        <div><span>总投入</span><strong>{formatDuration(snapshot.totalSeconds)}</strong></div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">DSTE 复盘</span><h2>从结果校准下一周</h2></div>
          <TimerReset size={22} />
        </div>
        <div className="review-questions">
          {questionFields.map(({ key, label, placeholder }) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <textarea rows={3} value={answers[key]} placeholder={placeholder} onChange={(event) => setAnswers({ ...answers, [key]: event.target.value })} />
            </label>
          ))}
        </div>
        <button className="secondary-button" onClick={generateReport}><FileText size={17} /> 生成周报草稿</button>
        <label className="field report-field">
          <span>可编辑周报</span>
          <textarea rows={8} value={report} onChange={(event) => setReport(event.target.value)} placeholder="完成上面的追问后生成周报" />
        </label>
        <div className="next-focuses">
          <span>下周最多三个重点</span>
          {[0, 1, 2].map((index) => (
            <input key={index} value={nextFocuses[index] ?? ""} placeholder={`重点 ${index + 1}`} onChange={(event) => {
              const next = [...nextFocuses];
              next[index] = event.target.value;
              setNextFocuses(next);
            }} />
          ))}
        </div>
        <button className="wide-save" onClick={save}><Save size={17} /> 保存复盘</button>
      </section>

      {tasks.some((task) => task.status === "open") ? (
        <section className="section-block rollover-block">
          <div className="section-heading">
            <div><span className="eyebrow">周末收口</span><h2>{tasks.filter((task) => task.status === "open").length} 个任务还未完成</h2></div>
            <WandSparkles size={21} />
          </div>
          <p>系统不会偷偷把任务滚到下周。保留现状，或明确做一次选择。</p>
          <div className="rollover-actions">
            <button className="secondary-button" onClick={() => onRollover("keep")}>留在本周</button>
            <button className="primary-button" onClick={() => onRollover("move")}>移到下周</button>
            <button className="delete-button" onClick={() => onRollover("delete")}>删除</button>
          </div>
        </section>
      ) : null}

      {history.length ? (
        <section className="section-block history">
          <div className="section-heading"><div><span className="eyebrow">历史</span><h2>过去的行动证据</h2></div><ArchiveRestore size={21} /></div>
          {history.slice(0, 8).map((item) => (
            <div className="history-row" key={item.weekStart}>
              <span>{item.weekStart}</span>
              <strong>{item.snapshot.completionRate}%</strong>
              <small>{formatDuration(item.snapshot.totalSeconds)}</small>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function SettingsView({ notify, onChanged }: { notify: (message: string) => void; onChanged: () => Promise<void> }) {
  const exportData = async () => {
    const payload = await createBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `生长周记备份-${toDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify("备份文件已导出");
  };

  const importData = async (file: File) => {
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!validateBackup(value)) {
        notify("备份格式或版本不兼容");
        return;
      }
      await restoreBackup(value);
      await onChanged();
      notify("数据已完整恢复");
    } catch {
      notify("无法读取这个备份文件");
    }
  };

  const clear = async () => {
    if (!window.confirm("确定清除这台设备上的全部记录吗？请先导出备份。")) return;
    await clearAllData();
    await onChanged();
    notify("本机数据已清除");
  };

  return (
    <div className="content-stack settings-page">
      <section className="settings-intro">
        <div className="settings-symbol"><Settings size={30} /></div>
        <h2>数据属于你</h2>
        <p>所有成长记录只保存在当前浏览器。定期导出备份，换手机或清理 Safari 数据前尤其重要。</p>
      </section>
      <section className="section-block settings-list">
        <button onClick={exportData}><Download size={20} /><span><strong>导出备份</strong><small>下载包含全部记录的 JSON 文件</small></span></button>
        <label className="settings-upload"><Upload size={20} /><span><strong>恢复备份</strong><small>校验成功后替换当前数据</small></span><input type="file" accept="application/json" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void importData(file);
          event.target.value = "";
        }} /></label>
        <button className="danger-row" onClick={clear}><Trash2 size={20} /><span><strong>清除全部数据</strong><small>此操作无法撤销</small></span></button>
      </section>
      <section className="section-block about-block">
        <span className="eyebrow">使用方式</span>
        <h2>安装到 iPhone</h2>
        <ol>
          <li>用 Safari 打开网站。</li>
          <li>点“分享”，选择“添加到主屏幕”。</li>
          <li>以后从桌面图标打开，可离线使用。</li>
        </ol>
        <div className="privacy-note"><ArchiveRestore size={18} /><span>应用不会自动上传记录，也不会读取录音。语音输入来自 iPhone 键盘听写。</span></div>
      </section>
    </div>
  );
}

export default App;
