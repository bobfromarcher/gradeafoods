"use client";

import { useMemo, useState } from "react";
import { GradeBadge } from "@/components/GradeBadge";
import { Card } from "@/components/ui";
import { computeGrade } from "@/lib/grading";
import { RESULT_STATUSES, RESULT_STATUS_LABELS, type ResultStatus } from "@/lib/constants";
import { saveInspection } from "../../actions";

type Item = {
  itemId: string;
  category: string;
  text: string;
  weight: number;
  critical: boolean;
  status: string;
  note: string;
};

const STATUS_STYLES: Record<ResultStatus, string> = {
  PASS: "bg-brand-600 text-white",
  FAIL: "bg-red-600 text-white",
  NA: "bg-gray-500 text-white",
};

export function InspectionForm({
  inspectionId,
  status,
  defaultNotes,
  items,
}: {
  inspectionId: string;
  status: string;
  defaultNotes: string;
  items: Item[];
}) {
  const [results, setResults] = useState<Record<string, ResultStatus>>(() =>
    Object.fromEntries(
      items.map((i) => [
        i.itemId,
        (RESULT_STATUSES as readonly string[]).includes(i.status)
          ? (i.status as ResultStatus)
          : "PASS",
      ]),
    ),
  );

  const outcome = useMemo(
    () =>
      computeGrade(
        items.map((i) => ({
          status: results[i.itemId],
          weight: i.weight,
          critical: i.critical,
        })),
      ),
    [items, results],
  );

  const categories = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <form action={saveInspection} className="space-y-5 pb-24">
      <input type="hidden" name="inspectionId" value={inspectionId} />

      <Card className="flex items-center justify-between bg-brand-50/60">
        <div>
          <p className="text-sm text-ink/60">Live grade preview</p>
          <p className="text-2xl font-bold text-ink">
            {outcome.scorePercent}%
            {outcome.criticalFailures > 0 && (
              <span className="ml-2 text-sm font-medium text-red-600">
                {outcome.criticalFailures} critical violation
                {outcome.criticalFailures === 1 ? "" : "s"}
              </span>
            )}
          </p>
        </div>
        <GradeBadge grade={outcome.grade} size="lg" />
      </Card>

      {categories.map(([category, list]) => (
        <Card key={category}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
            {category}
          </h2>
          <ul className="space-y-4">
            {list.map((item) => (
              <li key={item.itemId} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">
                      {item.text}
                      {item.critical && (
                        <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                          Critical
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/45">weight {item.weight}</p>
                  </div>
                  <div className="inline-flex overflow-hidden rounded-lg border border-gray-200">
                    {RESULT_STATUSES.map((s) => {
                      const active = results[item.itemId] === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            setResults((prev) => ({ ...prev, [item.itemId]: s }))
                          }
                          className={`px-3 py-1.5 text-xs font-medium transition ${
                            active
                              ? STATUS_STYLES[s]
                              : "bg-white text-ink/60 hover:bg-gray-50"
                          }`}
                        >
                          {RESULT_STATUS_LABELS[s]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <input
                  type="hidden"
                  name={`status_${item.itemId}`}
                  value={results[item.itemId]}
                />
                <input
                  type="text"
                  name={`note_${item.itemId}`}
                  defaultValue={item.note}
                  placeholder="Add a note (optional)"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                />
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Card>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink/80">
            Inspector notes
          </span>
          <textarea
            name="notes"
            defaultValue={defaultNotes}
            rows={3}
            placeholder="Overall observations, follow-up actions…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </Card>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-8 py-3">
          <button
            type="submit"
            name="intent"
            value="save"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-ink/80 shadow-sm transition hover:bg-gray-50"
          >
            Save draft
          </button>
          <button
            type="submit"
            name="intent"
            value="complete"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {status === "COMPLETED" ? "Save & re-grade" : "Complete inspection"}
          </button>
        </div>
      </div>
    </form>
  );
}
