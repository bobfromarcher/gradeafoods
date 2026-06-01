import { describe, it, expect } from 'vitest'
import { computeGrade, letterFor } from '@/lib/grading'

describe('letterFor', () => {
  it('returns A for >= 90', () => {
    expect(letterFor(90)).toBe('A')
    expect(letterFor(95)).toBe('A')
  })
  it('returns B for >= 80', () => {
    expect(letterFor(80)).toBe('B')
    expect(letterFor(89.9)).toBe('B')
  })
  it('returns C for >= 70', () => {
    expect(letterFor(70)).toBe('C')
    expect(letterFor(79.9)).toBe('C')
  })
  it('returns F for < 70', () => {
    expect(letterFor(69.9)).toBe('F')
    expect(letterFor(0)).toBe('F')
  })
})

describe('computeGrade', () => {
  it('returns NA when no applicable items', () => {
    const outcome = computeGrade([{ status: 'NA', weight: 5, critical: false }])
    expect(outcome.grade).toBe('NA')
    expect(outcome.scorePercent).toBe(0)
  })

  it('computes weighted score correctly', () => {
    const results = [
      { status: 'PASS' as const, weight: 3, critical: false },
      { status: 'FAIL' as const, weight: 2, critical: false },
      { status: 'PASS' as const, weight: 5, critical: false },
    ]
    const outcome = computeGrade(results)
    // earned = 3+5=8, applicable=10, score=80 => B
    expect(outcome.scorePercent).toBe(80)
    expect(outcome.grade).toBe('B')
    expect(outcome.criticalFailures).toBe(0)
  })

  it('caps grade at F when any critical item fails', () => {
    const results = [
      { status: 'PASS' as const, weight: 10, critical: false },
      { status: 'FAIL' as const, weight: 1, critical: true },
    ]
    const outcome = computeGrade(results)
    expect(outcome.criticalFailures).toBe(1)
    expect(outcome.grade).toBe('F')
    // score percent still computed
    expect(outcome.scorePercent).toBe(91) // 10/11 ≈ 90.9 rounded to 91
  })

  it('handles multiple critical failures', () => {
    const results = [
      { status: 'FAIL' as const, weight: 2, critical: true },
      { status: 'FAIL' as const, weight: 3, critical: true },
      { status: 'PASS' as const, weight: 5, critical: false },
    ]
    const outcome = computeGrade(results)
    expect(outcome.criticalFailures).toBe(2)
    expect(outcome.grade).toBe('F')
  })

  it('ignores NA items', () => {
    const results = [
      { status: 'PASS' as const, weight: 4, critical: false },
      { status: 'NA' as const, weight: 10, critical: false },
    ]
    const outcome = computeGrade(results)
    expect(outcome.applicableWeight).toBe(4)
    expect(outcome.earnedWeight).toBe(4)
    expect(outcome.scorePercent).toBe(100)
    expect(outcome.grade).toBe('A')
  })
})
