"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { Card } from "@/components/ui";
import { createTemplate, type FormState } from "../../actions";

type Item = {
  category: string;
  text: string;
  weight: number;
  critical: boolean;
};

const STARTER: Item[] = [
  { category: "Temperature Control", text: "Cold holding at or below 41°F", weight: 5, critical: true },
  { category: "Hygiene", text: "Handwashing stations stocked and accessible", weight: 3, critical: false },
  { category: "Documentation", text: "Allergen labeling present and accurate", weight: 2, critical: false },
];

const initialState: FormState = { error: null };

export function NewTemplateForm() {
  const [state, formAction] = useActionState(createTemplate, initialState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Item[]>(STARTER);

  const update = (index: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));
  const add = () =>
    setItems((prev) => [
      ...prev,
      { category: "", text: "", weight: 1, critical: false },
    ]);

  const payload = JSON.stringify({ name, description, items });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />

      <Card className="max-w-2xl space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink/80">
            Checklist name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant Health Inspection"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink/80">
            Description (optional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Checklist items</h2>
          <button
            type="button"
            onClick={add}
            className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            + Add item
          </button>
        </div>

        {items.map((item, index) => (
          <Card key={index} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
              <input
                value={item.category}
                onChange={(e) => update(index, { category: e.target.value })}
                placeholder="Category"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
              <input
                value={item.text}
                onChange={(e) => update(index, { text: e.target.value })}
                placeholder="Criterion to check"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink/70">
                Weight
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={item.weight}
                  onChange={(e) =>
                    update(index, { weight: Number(e.target.value) || 1 })
                  }
                  className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={item.critical}
                  onChange={(e) => update(index, { critical: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-400"
                />
                Critical control point
              </label>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-auto text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton>Save checklist</SubmitButton>
    </form>
  );
}
