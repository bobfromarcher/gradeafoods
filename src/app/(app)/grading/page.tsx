"use client";

import { useState, useActionState } from "react";
import { z } from "zod";
import { computeGrade, generateReport } from "@/lib/grading";
import type { GradeableResult, ReportableResult, GradeOutcome } from "@/lib/grading";
import { captureEmail } from "@/app/(app)/actions";

const itemSchema = z.object({
  status: z.enum(["PASS", "FAIL", "NA"]),
  weight: z.number().int().min(1).max(100),
  critical: z.boolean(),
  text: z.string().optional(),
});

const itemsSchema = z.array(itemSchema).min(1, "Add at least one item");

export default function GradingPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [outcome, setOutcome] = useState<GradeOutcome | null>(null);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const [emailState, emailAction, emailPending] = useActionState(captureEmail, {
    error: null,
  });

  function handleCompute(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOutcome(null);
    setReport("");

    let parsed: z.infer<typeof itemsSchema>;
    try {
      const raw = JSON.parse(jsonInput);
      parsed = itemsSchema.parse(raw);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Invalid input");
      } else {
        setError("Could not parse JSON");
      }
      return;
    }

    const gradeable: GradeableResult[] = parsed.map((item) => ({
      status: item.status,
      weight: item.weight,
      critical: item.critical,
    }));

    const result = computeGrade(gradeable);
    setOutcome(result);

    const reportable: ReportableResult[] = parsed.map((item) => ({
      status: item.status,
      weight: item.weight,
      critical: item.critical,
      text: item.text,
    }));

    setReport(generateReport(result, reportable));
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <h1 className="text-3xl font-bold">Grading Calculator</h1>

      <form onSubmit={handleCompute} className="space-y-4">
        <div>
          <label htmlFor="items-json" className="block text-sm font-medium">
            Item specs (JSON)
          </label>
          <textarea
            id="items-json"
            rows={8}
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
            placeholder={`[
  { "status": "PASS", "weight": 10, "critical": false, "text": "Clean floors" },
  { "status": "FAIL", "weight": 20, "critical": true, "text": "Fire extinguisher" }
]`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Compute Grade
        </button>
      </form>

      {outcome && (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Result</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <dt className="font-medium">Grade</dt>
            <dd>{outcome.grade}</dd>
            <dt className="font-medium">Score</dt>
            <dd>{outcome.scorePercent}%</dd>
            <dt className="font-medium">Earned / Applicable</dt>
            <dd>
              {outcome.earnedWeight} / {outcome.applicableWeight}
            </dd>
            {outcome.criticalFailures > 0 && (
              <>
                <dt className="font-medium">Critical Failures</dt>
                <dd>{outcome.criticalFailures}</dd>
              </>
            )}
          </dl>

          {report && (
            <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs">
              {report}
            </pre>
          )}
        </section>
      )}

      <hr className="border-gray-200" />

      <section>
        <h2 className="text-xl font-semibold">Email the report</h2>
        <form action={emailAction} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={emailPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {emailPending ? "Sending…" : "Send Report"}
          </button>
        </form>
        {emailState.error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {emailState.error}
          </p>
        )}
        {emailState.error === null && emailPending === false && (
          <p className="mt-2 text-sm text-green-700">Report sent (placeholder).</p>
        )}
      </section>
    </main>
  );
}
