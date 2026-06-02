export const metadata = {
  title: "Privacy Policy — Grade A Foods",
  description: "How Grade A Foods, operated by de Montfort LLC, collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  const updated = "June 2, 2026";
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif", color: "#0f172a", lineHeight: 1.7 }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>← Back to Grade A Foods</a>
      <h1 style={{ fontSize: 36, fontWeight: 800, margin: "16px 0 4px" }}>Privacy Policy</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>Last updated: {updated}</p>

      <p>Grade A Foods (&quot;we,&quot; &quot;us&quot;) is operated by <strong>de Montfort LLC</strong>. This policy explains what we collect, why, and the rights you have. We collect the minimum data needed to provide the service.</p>

      <h2 style={h2}>1. Information we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email, and company when you register.</li>
        <li><strong>Billing data:</strong> processed by Stripe; we never store full card numbers.</li>
        <li><strong>Product data:</strong> the food specifications and records you submit for grading.</li>
        <li><strong>Usage data:</strong> log and device information to keep the service secure and reliable.</li>
      </ul>

      <h2 style={h2}>2. How we use it</h2>
      <p>To provide and improve the service, process payments, communicate with you, prevent abuse, and meet legal obligations. We do <strong>not</strong> sell your personal information.</p>

      <h2 style={h2}>3. Cookies</h2>
      <p>We use essential cookies for authentication and security, and limited analytics to understand product usage. You can control non-essential cookies through your browser or our consent banner where required.</p>

      <h2 style={h2}>4. Data sharing</h2>
      <p>We share data only with processors that help us operate (e.g., Stripe for payments, our hosting provider) under contractual confidentiality, and where required by law.</p>

      <h2 style={h2}>5. Your rights</h2>
      <p>Depending on your jurisdiction (including GDPR and CCPA/CPRA), you may request access, correction, deletion, or export of your data, and object to certain processing. Contact us to exercise these rights.</p>

      <h2 style={h2}>6. Security & retention</h2>
      <p>We use industry-standard safeguards (encryption in transit, access controls) and retain data only as long as needed to provide the service or meet legal requirements.</p>

      <h2 style={h2}>7. Contact</h2>
      <p>de Montfort LLC — <a href="mailto:privacy@gradeafoods.com" style={{ color: "#2563eb" }}>privacy@gradeafoods.com</a></p>

      <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 40 }}>This policy is provided for transparency and does not constitute legal advice.</p>
    </main>
  );
}
const h2 = { fontSize: 20, fontWeight: 700, marginTop: 32 } as const;
