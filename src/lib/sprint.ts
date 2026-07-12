import type { Task } from "../types";

export type RoadmapItem = { month: string; goal: string; tasks: string; checks: string };
export type SuggestedTask = Pick<Task, "title" | "date" | "focusIndex" | "estimateMinutes">;

export const weeklyExecution = [
  { time: "周一至周五上午", effort: "1h/天", task: "紫微输入：星曜、宫位、流年、大运、案例笔记" },
  { time: "周一至周五下午/晚上", effort: "2h/天", task: "看盘、复盘、邀约、内容、客户沟通" },
  { time: "周六", effort: "6h", task: "集中咨询、案例整理、内容批量制作" },
  { time: "周日", effort: "6h", task: "周复盘、下周任务、AI 视频实验、生活收口" }
];

export const dailyMinimums = [
  { module: "紫微输入", action: "1 个知识点 + 1 条案例笔记" },
  { module: "紫微输出", action: "1 次看盘/复盘/邀约/内容输出" },
  { module: "AI 流量", action: "每周 2-3 条 AI 视频实验" },
  { module: "生活状态", action: "护肤 + 10 分钟房间收口" }
];

export const roadmap2026: RoadmapItem[] = [
  { month: "2026-07", goal: "稳住能力，开始样本盘", tasks: "每天上午补紫微基础；完成 6-8 个免费/低价样本盘；建立看盘模板；列出 20 个可邀约对象", checks: "1 套看盘提纲；至少 6 个案例记录；发出第一批邀约" },
  { month: "2026-08", goal: "开始收费验证", tasks: "推出 99-199 元体验咨询；每周 2 条紫微内容；每周 2 条 AI 视频；完成熟人付费转化", checks: "3-5 个付费单；副业收入 500-1000；知道客户最常问什么" },
  { month: "2026-09", goal: "固定咨询 SOP", tasks: "固定预约问题、看盘结构、交付总结、复盘表；开始整理客户反馈；内容加入咨询入口", checks: "累计 10 个付费单；副业收入 1000-2000；有标准服务说明" },
  { month: "2026-10", goal: "提价与陌生线索", tasks: "标准咨询提到 199-399；每周 3 条紫微内容；AI 视频保留播放较好的方向", checks: "单月收入 2000-3000；至少 5 个陌生/半熟人咨询线索" },
  { month: "2026-11", goal: "打磨转介绍", tasks: "做 3 个代表案例；邀请老客户反馈和转介绍；测试 399-699 深度咨询", checks: "单月收入 3000-5000；出现复购或转介绍" },
  { month: "2026-12", goal: "年底冲刺复盘", tasks: "集中成交；复盘全年案例、收入、内容、AI 流量；制定 2027 产品价格表", checks: "单月收入 5000+；累计 20+ 付费单；形成 2027 服务矩阵" }
];

export const roadmap2027: RoadmapItem[] = [
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

export const monthlyReviewQuestions = [
  "本月收入是多少？距离目标差多少？",
  "本月付费订单几个？线索从哪里来？",
  "上午输入有没有让看盘更稳？",
  "下午输出是否真的产生了案例、内容、邀约、成交？",
  "AI 视频有没有带来播放、关注、私信或咨询？",
  "是能力不够、获客不够，还是不敢收费？",
  "下个月只保留哪 3 个重点？"
];

export const sprintReviewFields = [
  { key: "income", label: "本周收入", placeholder: "例如：0 元 / 199 元 / 3 单共 897 元" },
  { key: "orders", label: "付费订单", placeholder: "几个付费单？价格分别是多少？" },
  { key: "leads", label: "咨询线索", placeholder: "私信、朋友介绍、内容评论里有多少线索？" },
  { key: "content", label: "内容数量", placeholder: "紫微内容几条？AI 视频几条？哪些有反馈？" },
  { key: "input", label: "输入是否变稳", placeholder: "上午输入解决了哪个看盘不稳的问题？" },
  { key: "output", label: "输出成交证据", placeholder: "看盘、邀约、成交、反馈，哪一项真的发生了？" }
] as const;

const sprintRoadmap = [...roadmap2026, ...roadmap2027];
const fallbackSprintMonth = roadmap2026[0];
const sprintFocusSuggestions = ["紫微成交/案例", "内容获客/AI 视频", "生活状态"];

export function getSprintMonth(dateKey: string): RoadmapItem {
  const monthKey = dateKey.slice(0, 7);
  return sprintRoadmap.find((item) => item.month === monthKey) ?? fallbackSprintMonth;
}

export function buildWeeklyFocusSuggestions() {
  return sprintFocusSuggestions;
}

export function getDailySprintActions(dateKey: string): SuggestedTask[] {
  const weekday = new Date(`${dateKey}T00:00:00`).getDay();
  if (weekday === 0) {
    return [
      { title: "周复盘：收入、订单、线索、时间投入", date: dateKey, focusIndex: 0, estimateMinutes: 90 },
      { title: "制定下周冲刺任务和三重点", date: dateKey, focusIndex: 0, estimateMinutes: 60 },
      { title: "AI 视频实验：选题、脚本、发布", date: dateKey, focusIndex: 1, estimateMinutes: 150 },
      { title: "生活收口：护肤、房间整理、状态校准", date: dateKey, focusIndex: 2, estimateMinutes: 60 }
    ];
  }
  if (weekday === 6) {
    return [
      { title: "集中看盘/咨询交付", date: dateKey, focusIndex: 0, estimateMinutes: 180 },
      { title: "案例整理与高频问题沉淀", date: dateKey, focusIndex: 0, estimateMinutes: 90 },
      { title: "内容批量制作：紫微内容或 AI 视频", date: dateKey, focusIndex: 1, estimateMinutes: 90 }
    ];
  }
  return [
    { title: "紫微输入：知识点 + 案例笔记", date: dateKey, focusIndex: 0, estimateMinutes: 60 },
    { title: "紫微输出：看盘/复盘/邀约/内容", date: dateKey, focusIndex: 0, estimateMinutes: 60 },
    { title: "内容获客：紫微内容或 AI 视频推进", date: dateKey, focusIndex: 1, estimateMinutes: 60 }
  ];
}

export function sprintContextText(monthPlan: RoadmapItem) {
  return `本月冲刺：${monthPlan.month} ${monthPlan.goal}\n关键任务：${monthPlan.tasks}\n验收标准：${monthPlan.checks}\n每日最低动作：${dailyMinimums.map((item) => `${item.module}：${item.action}`).join("；")}`;
}
