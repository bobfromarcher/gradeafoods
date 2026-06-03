import type { Grade, ResultStatus } from "@/lib/constants";

export interface GradeableResult {
  status: ResultStatus;
  weight: number;
  critical: boolean;
}

export interface GradeOutcome {
  scorePercent: number;
  grade: Grade;
  earnedWeight: number;
  applicableWeight: number;
  criticalFailures: number;
}

/**
 * Weighted scoring: each applicable (non-N/A) item contributes its weight to the
 * denominator and, when passed, to the numerator. Any failed critical item caps
 * the result at grade F regardless of the numeric score.
 */
export function computeGrade(results: GradeableResult[]): GradeOutcome {
  let earnedWeight = 0;
  let applicableWeight = 0;
  let criticalFailures = 0;

  for (const result of results) {
    if (result.status === "NA") continue;
    applicableWeight += result.weight;
    if (result.status === "PASS") {
      earnedWeight += result.weight;
    } else if (result.critical) {
      criticalFailures += 1;
    }
  }

  if (applicableWeight === 0) {
    return {
      scorePercent: 0,
      grade: "NA",
      earnedWeight,
      applicableWeight,
      criticalFailures,
    };
  }

  const scorePercent = Math.round((earnedWeight / applicableWeight) * 1000) / 10;
  const grade = criticalFailures > 0 ? "F" : letterFor(scorePercent);

  return { scorePercent, grade, earnedWeight, applicableWeight, criticalFailures };
}

export function letterFor(scorePercent: number): Grade {
  if (scorePercent >= 90) return "A";
  if (scorePercent >= 80) return "B";
  if (scorePercent >= 70) return "C";
  return "F";
}
