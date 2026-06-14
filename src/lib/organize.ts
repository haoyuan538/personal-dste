import type { NoteCategory, OrganizedNotes } from "../types";

const keywordMap: Record<Exclude<NoteCategory, "unclassified">, string[]> = {
  plans: ["计划", "准备", "打算", "想要", "目标", "需要", "要做"],
  wins: ["学到", "收获", "发现", "完成", "做到", "进步", "明白"],
  blocks: ["但是", "困难", "阻碍", "没做", "没有", "拖延", "担心", "卡住", "来不及"],
  nextSteps: ["下一步", "接下来", "明天", "下周", "马上", "先做", "开始"]
};

export const emptyOrganizedNotes = (): OrganizedNotes => ({
  plans: [],
  wins: [],
  blocks: [],
  nextSteps: [],
  unclassified: []
});

export function splitStatements(input: string) {
  const seen = new Set<string>();
  return input
    .split(/[。！？!?；;\n]+/)
    .map((item) => item.trim().replace(/^[，,、\s]+|[，,、\s]+$/g, ""))
    .filter((item) => item.length > 1)
    .filter((item) => {
      const normalized = item.replace(/\s+/g, "");
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
}

export function organizeText(input: string): OrganizedNotes {
  const result = emptyOrganizedNotes();

  splitStatements(input).forEach((statement) => {
    const category = (Object.entries(keywordMap) as [Exclude<NoteCategory, "unclassified">, string[]][])
      .find(([, keywords]) => keywords.some((keyword) => statement.includes(keyword)))?.[0];

    const bucket = category ?? "unclassified";
    if (result[bucket].length < 5) result[bucket].push(statement);
  });

  return result;
}
