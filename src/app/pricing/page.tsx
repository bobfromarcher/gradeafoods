"use client";
import { useState } from "react";

const PLANS = [
  { id: "starter", name: "Starter", price: "$99", period: "/mo",
    blurb: "For a single facility getting audit-ready.",
    features: ["1 facility", "Unlimited inspections", "PDF audit reports", "Checklist templates"] },
  { id: "team", name: "Team", price: "$249", period: "/mo", popular: true,
    blurb: "Up to 5 facilities, shared templates & reports.",
    features: ["Up to 5 facilities", "Everything in Starter", "Shared team templates", "Priority support"] },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  async function subscribe(plan: string) {
    setLoading(plan);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await r.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Could not start checkout");
    } finally { setLoading(null); }
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif" }}>
      <p style={{ color: "#2563eb", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", fontSize: 14, margin: 0 }}>Pricing</p>
      <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.02em", margin: "8px 0 8px" }}>Simple, transparent pricing</h1>
      <p style={{ color: "#475569", fontSize: 18, marginBottom: 40 }}>Start a 14-day free trial. Cancel anytime.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
        {PLANS.map((p) => (
          <div key={p.id} style={{
            border: p.popular ? "2px solid #2563eb" : "1px solid #e2e8f0",
            borderRadius: 16, padding: 32, background: "#fff",
            boxShadow: p.popular ? "0 12px 32px rgba(37,99,235,.12)" : "0 1px 2px rgba(15,23,42,.06)", position: "relative" }}>
            {p.popular && <span style={{ position: "absolute", top: -12, right: 24, background: "#2563eb", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>Most popular</span>}
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{p.name}</h2>
            <p style={{ color: "#475569", margin: "0 0 16px", minHeight: 44 }}>{p.blurb}</p>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 40, fontWeight: 800 }}>{p.price}</span>
              <span style={{ color: "#94a3b8" }}>{p.period}</span>
            </div>
            <button onClick={() => subscribe(p.id)} disabled={loading === p.id}
              style={{ width: "100%", minHeight: 44, borderRadius: 10, border: "none", cursor: "pointer",
                background: p.popular ? "#2563eb" : "#0f172a", color: "#fff", fontWeight: 600, fontSize: 16,
                opacity: loading === p.id ? .6 : 1 }}>
              {loading === p.id ? "Starting…" : "Start free trial"}
            </button>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 24, color: "#475569" }}>
              {p.features.map((f) => <li key={f} style={{ padding: "6px 0" }}>✓ {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 32, textAlign: "center" }}>
        Secure payments by Stripe.</p>
    </main>
  );
}
