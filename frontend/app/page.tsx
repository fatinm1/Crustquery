'use client'

import Link from 'next/link'
import { useState } from 'react'

const STEPS = [
  {
    number: '01',
    title: 'Type your question',
    description: 'Describe what you\'re looking for in plain English. No syntax, no filters, no documentation required.',
    example: '"Find Series B SaaS companies in San Francisco with 100–500 employees"',
  },
  {
    number: '02',
    title: 'Claude builds the query',
    description: 'Our AI parses your intent and constructs the exact Crustdata API call — filters, operators, field selection, all of it.',
    example: 'POST /company/search with nested boolean filter conditions',
  },
  {
    number: '03',
    title: 'Results, instantly',
    description: 'A clean table of matching companies with funding, headcount, location, and domain links. Export to CSV in one click.',
    example: '42 companies returned in under 2 seconds',
  },
]

const FEATURES = [
  {
    icon: '⬡',
    title: 'Natural language input',
    description: 'No API docs, no filter builder, no boolean logic. Just describe what you want.',
  },
  {
    icon: '⬡',
    title: 'Real Crustdata results',
    description: 'Pulls live data from Crustdata\'s company search API — millions of B2B data points.',
  },
  {
    icon: '⬡',
    title: 'Complex queries handled',
    description: 'Headcount ranges, funding stages, founding years, geography — all combined automatically.',
  },
  {
    icon: '⬡',
    title: 'CSV export',
    description: 'Download any result set as a CSV file. Drop it straight into your CRM or spreadsheet.',
  },
  {
    icon: '⬡',
    title: 'Instant explanation',
    description: 'Every search shows a plain-English summary of exactly what was queried so you can trust the results.',
  },
  {
    icon: '⬡',
    title: 'Zero setup',
    description: 'No account, no configuration, no SDK to integrate. Open the app and start searching.',
  },
]

const EXAMPLE_QUERIES = [
  'Find AI startups in New York under 200 employees',
  'Series B SaaS companies in San Francisco',
  'Software companies founded after 2020 with $10M+ funding',
  'Healthcare companies in USA with 500+ employees',
  'Fintech startups in London with Seed or Series A funding',
  'Enterprise software companies with 1000+ employees in Germany',
]

const STATS = [
  { value: '200M+', label: 'Company profiles' },
  { value: '<2s', label: 'Average query time' },
  { value: '9', label: 'Searchable fields' },
  { value: '∞', label: 'Query combinations' },
]

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '700px', height: '700px', background: '#6366f1', filter: 'blur(160px)', opacity: 0.1, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', right: '-200px', width: '600px', height: '600px', background: '#06b6d4', filter: 'blur(160px)', opacity: 0.07, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '500px', height: '500px', background: '#8b5cf6', filter: 'blur(140px)', opacity: 0.08, borderRadius: '50%' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(6,6,8,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800 }}>CrustQuery</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '100px' }}>
            Powered by Crustdata
          </span>
          <Link href="/search" style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-jakarta)' }}>
            Try it free →
          </Link>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <section style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', padding: '160px 24px 100px' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
            <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 500 }}>Natural Language B2B Intelligence</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
            Find any company.<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Just ask for it.
            </span>
          </h1>

          <p style={{ fontSize: '19px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.65 }}>
            CrustQuery turns plain English questions into Crustdata API calls. No filters. No boolean logic. No documentation.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{ background: '#6366f1', color: 'white', borderRadius: '12px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-jakarta)', display: 'inline-block', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Start searching →
            </Link>
            <a href="#how-it-works" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 28px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-jakarta)', display: 'inline-block', backdropFilter: 'blur(12px)' }}>
              See how it works
            </a>
          </div>

          {/* Hero query preview */}
          <div style={{ maxWidth: '660px', margin: '64px auto 0', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>crustquery.app</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-jakarta)' }}>Find AI startups in New York with 50 to 200 employees</span>
                <span style={{ marginLeft: 'auto', background: '#6366f1', color: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>Search</span>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Searching Software Development companies in New York, USA with 50–200 employees</span>
                <span style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px' }}>38 results</span>
              </div>
              {[
                { name: 'Cohere', domain: 'cohere.com', hc: '312', funding: '$445M', founded: '2019' },
                { name: 'Hugging Face', domain: 'huggingface.co', hc: '180', funding: '$235M', founded: '2016' },
                { name: 'Weights & Biases', domain: 'wandb.ai', hc: '250', funding: '$250M', founded: '2018' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', gap: '8px', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'white' }}>{row.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{row.domain}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{row.hc}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{row.funding}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{row.founded}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {STATS.map((stat) => (
              <div key={stat.label} style={{ background: 'var(--bg)', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>How it works</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>Three steps from question to data. No setup, no configuration.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', backdropFilter: 'blur(12px)', marginBottom: i < STEPS.length - 1 ? '2px' : 0 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>{step.number}</span>
                    <div style={{ width: '40px', height: '1px', background: 'var(--border)', marginTop: '12px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{step.description}</p>
                    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a5b4fc' }}>{step.example}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>Everything you need</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>Built for sales, recruiting, and VC teams who need company data fast.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
              {FEATURES.map((feature, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{ background: hoveredFeature === i ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${hoveredFeature === i ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`, borderRadius: '14px', padding: '28px', transition: 'all 0.2s', backdropFilter: 'blur(12px)', cursor: 'default' }}>
                  <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '16px', color: '#a5b4fc' }}>
                    {['↗', '◈', '⊞', '↓', '≋', '◎'][i]}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Example queries ── */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>What you can ask</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Any question about companies, in any phrasing.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {EXAMPLE_QUERIES.map((q, i) => (
                <Link key={i} href={`/search`}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', backdropFilter: 'blur(12px)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-jakarta)', lineHeight: 1.4 }}>&ldquo;{q}&rdquo;</span>
                  <span style={{ color: 'rgba(99,102,241,0.6)', fontSize: '16px', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '72px 48px', textAlign: 'center', backdropFilter: 'blur(24px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: '#6366f1', filter: 'blur(100px)', opacity: 0.12, borderRadius: '50%', pointerEvents: 'none' }} />
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '16px', position: 'relative' }}>
              Ready to search smarter?
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, position: 'relative' }}>
              No account needed. Just open the app and start asking.
            </p>
            <Link href="/search"
              style={{ background: '#6366f1', color: 'white', borderRadius: '12px', padding: '16px 36px', fontSize: '16px', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-jakarta)', display: 'inline-block', position: 'relative', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Open CrustQuery →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '16px', fontWeight: 800 }}>CrustQuery</span>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Built on Crustdata · Powered by Gemini</span>
          <Link href="/search" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Launch app →
          </Link>
        </footer>

      </main>
    </div>
  )
}
