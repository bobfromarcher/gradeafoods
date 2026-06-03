export default function CancelPage() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif" }}>
      <div style={{ fontSize: 48 }}>↩️</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "16px 0 8px" }}>Checkout canceled</h1>
      <p style={{ color: "#475569", fontSize: 18 }}>No charge was made. You can pick a plan whenever you&apos;re ready.</p>
      <a href="/pricing" style={{ display: "inline-block", marginTop: 24, background: "#0f172a", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}>
        Back to pricing
      </a>
    </main>
  );
}
