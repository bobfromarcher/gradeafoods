"use client";

import { useActionState } from "react";
import { Field } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import { createFacility, type FormState } from "../../actions";
import { FACILITY_TYPES, FACILITY_TYPE_LABELS } from "@/lib/constants";

const initialState: FormState = { error: null };

export function NewFacilityForm() {
  const [state, formAction] = useActionState(createFacility, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Facility name" name="name" placeholder="Riverside Kitchen" />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink/80">Type</span>
        <select
          name="type"
          defaultValue="RESTAURANT"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        >
          {FACILITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {FACILITY_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <Field label="Address" name="address" required={false} placeholder="123 Market St" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contact name" name="contactName" required={false} />
        <Field
          label="Contact email"
          name="contactEmail"
          type="email"
          required={false}
        />
      </div>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton>Create facility</SubmitButton>
    </form>
  );
}
