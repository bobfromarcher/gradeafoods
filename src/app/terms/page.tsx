export const metadata = {
  title: "Terms of Service — Grade A Foods",
  description: "The terms governing use of Grade A Foods, operated by de Montfort LLC.",
};

export default function TermsPage() {
  const updated = "June 2, 2026";
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif", color: "#0f172a", lineHeight: 1.7 }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← Back to Grade A Foods</a>
      <h1 style={{ fontSize: 36, fontWeight: 800, margin: "16px 0 4px" }}>Terms of Service</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>Last updated: {updated}</p>

      <p>These Terms govern your use of Grade A Foods (the &quot;Service&quot;), operated by <strong>de Montfort LLC</strong> (&quot;we,&quot; &quot;us&quot;). By using the Service you agree to these Terms.</p>

      <h2 style={h2}>1. The service</h2>
      <p>Grade A Foods provides food quality and safety grading tools. Results are decision-support aids and do not replace your own regulatory or professional judgment.</p>

      <h2 style={h2}>2. Accounts</h2>
      <p>You are responsible for safeguarding your account credentials and for activity under your account. Provide accurate information and keep it current.</p>

      <h2 style={h2}>3. Subscriptions & billing</h2>
      <p>Paid plans renew on a recurring basis until cancelled. Payments are processed by Stripe. You may cancel at any time; access continues through the end of the paid period. Fees are non-refundable except where required by law.</p>

      <h2 style={h2}>4. Acceptable use</h2>
      <p>Do not misuse the Service, attempt to disrupt it, reverse engineer it, or use it for unlawful purposes. We may suspend accounts that violate these Terms.</p>

      <h2 style={h2}>5. Intellectual property</h2>
      <p>The Service and its content are owned by de Montfort LLC. You retain ownership of the data you submit and grant us a limited license to process it to provide the Service.</p>

      <h2 style={h2}>6. Disclaimers & liability</h2>
      <p>The Service is provided &quot;as is.&quot; To the maximum extent permitted by law, de Montfort LLC is not liable for indirect or consequential damages. Our total liability is limited to the amount you paid in the prior 12 months.</p>

      <h2 style={h2}>7. Changes & governing law</h2>
      <p>We may update these Terms; material changes will be notified. These Terms are governed by the laws of the United States and the state in which de Montfort LLC is organized.</p>

      <h2 style={h2}>8. Contact</h2>
      <p>de Montfort LLC — <a href="mailto:legal@gradeafoods.com" style={{ color: "#2563eb" }}>legal@gradeafoods.com</a></p>

      <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 40 }}>These terms are provided for transparency and do not constitute legal advice.</p>
    </main>
  );
}
const h2 = { fontSize: 20, fontWeight: 700, marginTop: 32 } as const;
