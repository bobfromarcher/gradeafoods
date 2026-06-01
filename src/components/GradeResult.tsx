import type { GradeOutcome } from '@/lib/grading'

export function GradeResult({ outcome }: { outcome: GradeOutcome }) {
  const { scorePercent, grade, earnedWeight, applicableWeight, criticalFailures } = outcome

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink/50">Overall Grade</p>
          <p className="text-3xl font-bold text-ink">{grade}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink/50">Score</p>
          <p className="text-2xl font-semibold text-ink">{scorePercent}%</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-ink/60">Earned weight</span>
          <p className="font-medium text-ink">{earnedWeight}</p>
        </div>
        <div>
          <span className="text-ink/60">Applicable weight</span>
          <p className="font-medium text-ink">{applicableWeight}</p>
        </div>
        <div>
          <span className="text-ink/60">Critical failures</span>
          <p className={`font-medium ${criticalFailures > 0 ? 'text-red-600' : 'text-ink'}`}>
            {criticalFailures}
          </p>
        </div>
      </div>
      {criticalFailures > 0 && (
        <p className="mt-3 text-sm text-red-600">
          Grade capped at F due to {criticalFailures} critical failure{criticalFailures > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  )
}
