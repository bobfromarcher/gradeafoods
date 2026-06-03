export const FACILITY_TYPES = [
  "RESTAURANT",
  "PROCESSOR",
  "WAREHOUSE",
  "FARM",
  "RETAIL",
] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];

export const FACILITY_TYPE_LABELS: Record<FacilityType, string> = {
  RESTAURANT: "Restaurant / Food Service",
  PROCESSOR: "Food Processor",
  WAREHOUSE: "Storage / Warehouse",
  FARM: "Farm / Producer",
  RETAIL: "Retail / Grocery",
};

export const RESULT_STATUSES = ["PASS", "FAIL", "NA"] as const;
export type ResultStatus = (typeof RESULT_STATUSES)[number];

export const RESULT_STATUS_LABELS: Record<ResultStatus, string> = {
  PASS: "Pass",
  FAIL: "Fail",
  NA: "N/A",
};

export type Grade = "A" | "B" | "C" | "F" | "NA";

export const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  B: "bg-lime-100 text-lime-800 ring-lime-600/20",
  C: "bg-amber-100 text-amber-800 ring-amber-600/20",
  F: "bg-red-100 text-red-800 ring-red-600/20",
  NA: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export const USER_ROLES = ["ADMIN", "INSPECTOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];
