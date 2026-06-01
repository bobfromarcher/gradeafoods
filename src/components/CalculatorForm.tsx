'use client'

import { useState } from 'react'
import { computeGrade, type GradeableResult } from '@/lib/grading'
import { GradeResult } from '@/components/GradeResult'

interface Item {
  id: string
  name: string
  weight: number
  critical: boolean
  status: 'PASS' | 'FAIL' | 'NA'
}

let nextId = 1

export function CalculatorForm() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: '', weight: 1, critical: false, status: 'PASS' },
  ])
  const [gradeOutcome, setGradeOutcome] = useState<ReturnType<typeof computeGrade> | null>(null)

  const addItem = () => {
    const id = String(++nextId)
    setItems((prev) => [...prev, { id, name: '', weight: 1, critical: false, status: 'PASS' }])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateItem = (id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  const handleCalculate = () => {
    const results: GradeableResult[] = items.map((item) => ({
      status: item.status,
      weight: item.weight,
      critical: item.critical,
    }))
    const outcome = computeGrade(results)
    setGradeOutcome(outcome)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-4"
          >
            <div className="min-w-0 flex-1">
              <label className="block text-xs font-medium text-ink/60">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="e.g. Temperature control"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60">Weight</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={item.weight}
                onChange={(e) =>
                  updateItem(item.id, { weight: Math.max(0, Number(e.target.value)) })
                }
                className="mt-1 w-20 rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60">Status</label>
              <select
                value={item.status}
                onChange={(e) =>
                  updateItem(item.id, { status: e.target.value as Item['status'] })
                }
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="PASS">Pass</option>
                <option value="FAIL">Fail</option>
                <option value="NA">N/A</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={item.critical}
                  onChange={(e) => updateItem(item.id, { critical: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                Critical
              </label>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
        >
          + Add item
        </button>
        <button
          type="button"
          onClick={handleCalculate}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Calculate grade
        </button>
      </div>

      {gradeOutcome && <GradeResult outcome={gradeOutcome} />}
    </div>
  )
}
