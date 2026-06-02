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
        {children}</body>
    </html>
  );
}
