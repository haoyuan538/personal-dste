import { describe, expect, it } from "vitest";
import { organizeText, splitStatements } from "./organize";

describe("local text organization", () => {
  it("splits Chinese punctuation and removes duplicates", () => {
    expect(splitStatements("我准备运动。今天学到一点！我准备运动。")).toEqual([
      "我准备运动",
      "今天学到一点"
    ]);
  });

  it("classifies statements without inventing content", () => {
    const result = organizeText("我计划明天发消息。但是我担心能力不够。今天学到先行动。下一步先约小A。还有一句普通的话。");
    expect(result.plans).toEqual(["我计划明天发消息"]);
    expect(result.blocks).toEqual(["但是我担心能力不够"]);
    expect(result.wins).toEqual(["今天学到先行动"]);
    expect(result.nextSteps).toEqual(["下一步先约小A"]);
    expect(result.unclassified).toEqual(["还有一句普通的话"]);
  });

  it("keeps at most five bullets per category", () => {
    const result = organizeText(Array.from({ length: 8 }, (_, index) => `计划做第${index}件事`).join("。"));
    expect(result.plans).toHaveLength(5);
  });
});
