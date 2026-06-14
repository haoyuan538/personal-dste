import { describe, expect, it } from "vitest";
import { validateBackup } from "./backup";

describe("backup validation", () => {
  it("accepts the current data version", () => {
    expect(validateBackup({
      version: 1,
      exportedAt: "2026-06-14T00:00:00Z",
      data: {
        weekPlans: [],
        tasks: [],
        timeEntries: [],
        dailyLogs: [],
        weeklyReviews: []
      }
    })).toBe(true);
  });

  it("rejects incompatible or incomplete backups", () => {
    expect(validateBackup({ version: 2, data: {} })).toBe(false);
    expect(validateBackup({ version: 1, data: { tasks: [] } })).toBe(false);
  });
});
