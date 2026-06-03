import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://gradeafoods.com";
const DESC = "Inspect, score, and grade food facilities. Run quality checklists, track supplier compliance, and generate audit-ready reports. By de Montfort LLC.";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Grade A Foods — Food Safety & Quality Grading",
  description: DESC,
  applicationName: "Grade A Foods",
  authors: [{ name: "de Montfort LLC" }],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Grade A Foods",
    title: "Grade A Foods — Food Safety & Quality Grading",
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "Grade A Foods — Food Safety & Quality Grading",
    description: DESC,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "de Montfort LLC",
            "url": "https://gradeafoods.com",
            "logo": "https://gradeafoods.com/favicon.ico",
            "description": "de Montfort LLC builds food safety and quality software including Grade A Foods.",
            "brand": { "@type": "Brand", "name": "Grade A Foods" },
            "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "email": "support@gradeafoods.com" }
          }) }}
        />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var GA4_ID=\"G-TVS843W146\";var META_PIXEL_ID=\"\";if(!GA4_ID&&!META_PIXEL_ID)return;function load(){if(GA4_ID){var s=document.createElement(\"script\");s.async=1;s.src=\"https://www.googletagmanager.com/gtag/js?id=\"+GA4_ID;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag(\"js\",new Date());gtag(\"config\",GA4_ID);}if(META_PIXEL_ID){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\"2.0\";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,\"script\",\"https://connect.facebook.net/en_US/fbevents.js\");fbq(\"init\",META_PIXEL_ID);fbq(\"track\",\"PageView\");}}var c=localStorage.getItem(\"coi_consent\");if(c===\"yes\"){load();return;}if(c===\"no\"){return;}function banner(){var d=document.createElement(\"div\");d.style.cssText=\"position:fixed;bottom:0;left:0;right:0;background:#0b1220;color:#eaf0fb;padding:13px 18px;font:14px/1.5 system-ui,sans-serif;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;z-index:99999\";d.innerHTML=\"<span>We use cookies to measure traffic and improve this site. See our <a href=\\\"/privacy\\\" style=\\\"color:#5eead4\\\">Privacy Policy</a>.</span>\";var ok=document.createElement(\"button\");ok.textContent=\"Accept\";ok.style.cssText=\"background:#16a34a;color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:700;cursor:pointer\";var no=document.createElement(\"button\");no.textContent=\"Decline\";no.style.cssText=\"background:#1f2a3d;color:#cbd5e1;border:0;border-radius:8px;padding:9px 16px;font-weight:700;cursor:pointer\";ok.onclick=function(){localStorage.setItem(\"coi_consent\",\"yes\");d.remove();load();};no.onclick=function(){localStorage.setItem(\"coi_consent\",\"no\");d.remove();};d.appendChild(ok);d.appendChild(no);document.body.appendChild(d);}if(document.body)banner();else document.addEventListener(\"DOMContentLoaded\",banner);})();" }} />
        {children}</body>
    </html>
  );
}
