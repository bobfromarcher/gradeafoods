import { GRADE_COLORS, type Grade } from "@/lib/constants";

const SIZES = {
  sm: "h-6 min-w-6 px-1.5 text-xs",
  md: "h-8 min-w-8 px-2 text-sm",
  lg: "h-12 min-w-12 px-3 text-xl",
} as const;

export function GradeBadge({
  grade,
  size = "md",
}: {
  grade: string;
  size?: keyof typeof SIZES;
}) {
  const g = (["A", "B", "C", "F"].includes(grade) ? grade : "NA") as Grade;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-bold ring-1 ring-inset ${GRADE_COLORS[g]} ${SIZES[size]}`}
    >
      {g === "NA" ? "—" : g}
    </span>
  );
}
