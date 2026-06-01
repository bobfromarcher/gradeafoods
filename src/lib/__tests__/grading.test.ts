import { describe, it, expect } from "vitest";
import { computeGrade, letterFor, generateReport } from "@/lib/grading";
import type { GradeableResult, ReportableResult } from "@/lib/grading";

describe("letterFor", () => {
  it("returns A for 90+", () => {
    expect(letterFor(90)).toBe("A");
    expect(letterFor(100)).toBe("A");
  });
  it("returns B for 80-89", () => {
    expect(letterFor(80)).toBe("B");
    expect(letterFor(89.9)).toBe("B");
  });
  it("returns C for 70-79", () => {
    expect(letterFor(70)).toBe("C");
    expect(letterFor(79.9)).toBe("C");
  });
  it("returns F below 70", () => {
    expect(letterFor(69.9)).toBe("F");
    expect(letterFor(0)).toBe("F");
  });
});

describe("computeGrade", () => {
  it("all pass yields 100% and A", () => {
    const items: GradeableResult[] = [
      { status: "PASS", weight: 10, critical: false },
      { status: "PASS", weight: 20, critical: false },
    ];
    const outcome = computeGrade(items);
    expect(outcome.scorePercent).toBe(100);
    expect(outcome.grade).toBe("A");
    expect(outcome.earnedWeight).toBe(30);
    expect(outcome.applicableWeight).toBe(30);
    expect(outcome.criticalFailures).toBe(0);
  });

  it("mixed pass/fail without critical yields correct percentage", () => {
    const items: GradeableResult[] = [
      { status: "PASS", weight: 10, critical: false },
      { status: "FAIL", weight: 20, critical: false },
    ];
    const outcome = computeGrade(items);
    expect(outcome.scorePercent).toBe(33.3);
    expect(outcome.grade).toBe("F"); // below 70
    expect(outcome.earnedWeight).toBe(10);
    expect(outcome.applicableWeight).toBe(30);
  });

  it("critical failure forces F regardless of score", () => {
    const items: GradeableResult[] = [
      { status: "PASS", weight: 90, critical: false },
      { status: "FAIL", weight: 10, critical: true },
    ];
    const outcome = computeGrade(items);
    expect(outcome.scorePercent).toBe(90);
    expect(outcome.grade).toBe("F");
    expect(outcome.criticalFailures).toBe(1);
  });

  it("NA items are excluded from denominator", () => {
    const items: GradeableResult[] = [
      { status: "PASS", weight: 10, critical: false },
      { status: "NA", weight: 50, critical: false },
    ];
    const outcome = computeGrade(items);
    expect(outcome.scorePercent).toBe(100);
    expect(outcome.applicableWeight).toBe(10);
    expect(outcome.earnedWeight).toBe(10);
  });

  it("all NA returns NA grade and 0%", () => {
    const items: GradeableResult[] = [
      { status: "NA", weight: 10, critical: false },
    ];
    const outcome = computeGrade(items);
    expect(outcome.scorePercent).toBe(0);
    expect(outcome.grade).toBe("NA");
    expect(outcome.applicableWeight).toBe(0);
  });
});

describe("generateReport", () => {
  it("includes grade, score, and item breakdown", () => {
    const outcome = {
      scorePercent: 75,
      grade: "C" as const,
      earnedWeight: 15,
      applicableWeight: 20,
      criticalFailures: 0,
    };
    const results: ReportableResult[] = [
      { status: "PASS", weight: 10, critical: false, text: "Clean floors" },
      { status: "FAIL", weight: 10, critical: false, text: "Check temp" },
    ];
    const report = generateReport(outcome, results);
    expect(report).toContain("Grade: C");
    expect(report).toContain("Score: 75%");
    expect(report).toContain('"Clean floors"');
    expect(report).toContain("[FAIL]");
  });

  it("marks critical items", () => {
    const outcome = {
      scorePercent: 50,
      grade: "F" as const,
      earnedWeight: 5,
      applicableWeight: 10,
      criticalFailures: 1,
    };
    const results: ReportableResult[] = [
      { status: "FAIL", weight: 10, critical: true, text: "Fire exit" },
    ];
    const report = generateReport(outcome, results);
    expect(report).toContain("CRITICAL");
    expect(report).toContain("Critical Failures: 1");
  });
});
