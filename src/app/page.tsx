'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-brand-700">
            GradeAFoods
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-ink/80 hover:text-ink transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-ink/80 hover:text-ink transition-colors">How it works</a>
            <a href="/pricing" className="text-sm font-medium text-ink/80 hover:text-ink transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-ink/80 hover:text-ink transition-colors">FAQ</a>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-700 rounded-lg hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
            >
              Get started
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-ink/70 hover:text-ink hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <a href="#features" className="block text-sm font-medium text-ink/80 hover:text-ink" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-sm font-medium text-ink/80 hover:text-ink" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" className="block text-sm font-medium text-ink/80 hover:text-ink" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="block text-sm font-medium text-ink/80 hover:text-ink" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-brand-700 rounded-lg hover:bg-brand-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-brand-50 to-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
              Grade food facilities faster
            </h1>
            <p className="mt-4 text-lg md:text-xl text-ink/70 max-w-2xl mx-auto">
              Weighted checklists, critical-control points, and instant grading — built for food safety teams that need accuracy and speed.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-brand-700 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-sm transition-colors"
              >
                Start grading for free
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink/50">No credit card required</p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center">Everything you need to grade with confidence</h2>
            <p className="mt-4 text-lg text-ink/60 max-w-2xl mx-auto text-center">
              Replace paper checklists and manual calculations with a tool designed for food safety professionals.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Weighted criteria',
                  desc: 'Assign importance to each item so critical violations carry more weight.',
                  icon: (
                    <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  ),
                },
                {
                  title: 'Critical-control points',
                  desc: 'Mark items that cap the overall grade at F if failed — never miss a food safety risk.',
                  icon: (
                    <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ),
                },
                {
                  title: 'Instant grading',
                  desc: 'See the final grade update in real time as you complete each checklist item.',
                  icon: (
                    <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div key={feature.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-50">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-brand-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center">How it works</h2>
            <p className="mt-4 text-lg text-ink/60 max-w-2xl mx-auto text-center">
              Three simple steps to go from checklist to grade.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: '1', title: 'Create a template', desc: 'Define your criteria, weights, and critical-control points in minutes.' },
                { step: '2', title: 'Conduct an inspection', desc: 'Walk through the checklist on any device — online or offline.' },
                { step: '3', title: 'Get an instant grade', desc: 'The final score is calculated automatically and ready to share.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing teaser */}
        <section id="pricing" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-ink/60 max-w-2xl mx-auto text-center">
              Start free and upgrade when you’re ready to scale.
            </p>
            <div className="mt-12 max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <p className="text-sm font-semibold text-brand-700 uppercase tracking-wide">Pro</p>
              <p className="mt-4 text-5xl font-extrabold text-ink">$29<span className="text-lg font-medium text-ink/60">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-ink/70">
                <li>Unlimited templates</li>
                <li>Unlimited inspections</li>
                <li>Critical-control points</li>
                <li>Export reports</li>
                <li>Priority support</li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-brand-700 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-sm transition-colors"
                >
                  Get started free
                </Link>
              </div>
              <p className="mt-4 text-xs text-ink/50">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24 bg-brand-50/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center">Frequently asked questions</h2>
            <div className="mt-12 space-y-4">
              {[
                { q: 'What is GradeAFoods?', a: 'GradeAFoods is a web application that helps food safety teams grade facilities using weighted checklists and critical-control points. It replaces manual calculations and paper forms with a fast, reliable digital tool.' },
                { q: 'How does grading work?', a: 'You create a template with weighted criteria and optional critical-control points. During an inspection, you mark each item as pass or fail. The app calculates the final grade instantly based on your weights and any critical failures.' },
                { q: 'Is there a free trial?', a: 'Yes! You can start with a 14-day free trial of the Pro plan — no credit card required. After the trial, you can choose to upgrade or continue with limited features.' },
                { q: 'Can I customize criteria?', a: 'Absolutely. You can add, remove, and weight criteria to match your organization’s standards. Critical-control points let you enforce automatic failures for the most important items.' },
                { q: 'What support is available?', a: 'We offer email support for all plans, and priority support for Pro subscribers. We’re also building a knowledge base and video tutorials to help you get the most out of GradeAFoods.' },
              ].map((faq, idx) => (
                <details key={idx} className="group bg-white rounded-lg border border-gray-200 hover:border-brand-200 transition-colors">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="text-sm font-medium text-ink">{faq.q}</span>
                    <svg className="h-5 w-5 text-ink/40 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-ink/70">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-xl font-bold text-white">GradeAFoods</Link>
              <p className="mt-2 text-sm text-white/60">Built for food safety teams.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} GradeAFoods. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
