import { describe, expect, it } from "vitest";
import {
  buildWeeklyFocusSuggestions,
  getDailySprintActions,
  getSprintMonth
} from "./sprint";

describe("sprint strategy helpers", () => {
  it("matches key months in the sprint roadmap", () => {
    expect(getSprintMonth("2026-07-12").goal).toBe("稳住能力，开始样本盘");
    expect(getSprintMonth("2026-12-01").checks).toContain("单月收入 5000+");
    expect(getSprintMonth("2027-01-15").goal).toBe("服务矩阵上线");
    expect(getSprintMonth("2027-12-31").checks).toContain("单月收入 20000+");
  });

  it("builds default weekly focus suggestions", () => {
    expect(buildWeeklyFocusSuggestions()).toEqual(["紫微成交/案例", "内容获客/AI 视频", "生活状态"]);
  });

  it("creates daily sprint actions by weekday", () => {
    expect(getDailySprintActions("2026-07-13")).toEqual([
      { title: "紫微输入：知识点 + 案例笔记", date: "2026-07-13", focusIndex: 0, estimateMinutes: 60 },
      { title: "紫微输出：看盘/复盘/邀约/内容", date: "2026-07-13", focusIndex: 0, estimateMinutes: 60 },
      { title: "内容获客：紫微内容或 AI 视频推进", date: "2026-07-13", focusIndex: 1, estimateMinutes: 60 }
    ]);
    expect(getDailySprintActions("2026-07-18").map((task) => task.estimateMinutes)).toEqual([180, 90, 90]);
    expect(getDailySprintActions("2026-07-19").map((task) => task.focusIndex)).toEqual([0, 0, 1, 2]);
  });
});
