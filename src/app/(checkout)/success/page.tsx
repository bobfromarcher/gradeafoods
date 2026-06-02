export default function SuccessPage() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif" }}>
      <div style={{ fontSize: 48 }}>✅</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "16px 0 8px" }}>You&apos;re all set</h1>
      <p style={{ color: "#475569", fontSize: 18 }}>
        Your Grade A Foods subscription is active. A receipt is on its way to your email.
      </p>
      <a href="/dashboard" style={{ display: "inline-block", marginTop: 24, background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}>
        Go to your dashboard →
      </a>
    </main>
  );
}
