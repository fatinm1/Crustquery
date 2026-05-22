'use client'

import Link from 'next/link'
import { useState } from 'react'

const MASK_IMAGE = 'https://images.unsplash.com/photo-1652982261193-8160514e985b?w=1474&fit=crop&fm=jpg&q=80'

const USE_CASES = [
  {
    icon: '↗',
    role: 'Sales Teams',
    description: 'Find 50 Series B SaaS companies in New York hiring a VP of Sales. In one sentence.',
    query: 'Series B SaaS companies in New York with 50 to 500 employees',
  },
  {
    icon: '◎',
    role: 'Recruiters',
    description: 'Source companies by headcount growth, funding stage, and location. No spreadsheets.',
    query: 'Software companies founded after 2020 with $10M+ funding in USA',
  },
  {
    icon: '⬡',
    role: 'Investors',
    description: 'Map entire verticals in seconds. See who is growing, who just raised, who is hiring.',
    query: 'Healthcare companies in USA with 500+ employees',
  },
]

const EXAMPLE_QUERIES = [
  'AI startups in New York under 200 employees',
  'Series B SaaS companies in San Francisco',
  'Healthcare companies in USA with 500+ employees',
  'Software companies founded after 2020 with $10M+ funding',
  'Fintech companies in London with 100 to 500 employees',
  'EdTech startups founded after 2018 with seed funding',
]

const STEPS = [
  {
    number: '01',
    icon: '✦',
    title: 'Ask in plain English',
    description: 'Type your query naturally. No boolean logic, no filter menus, no documentation needed.',
  },
  {
    number: '02',
    icon: '◈',
    title: 'AI Orchestrates the API',
    description: 'CrustQuery uses Gemini to parse your query and automatically calls the right Crustdata endpoints.',
  },
  {
    number: '03',
    icon: '↓',
    title: 'Get Instant Results',
    description: 'Results appear in seconds. Export to CSV or refine your query with a follow-up.',
  },
]

const glassCard = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(20px)' as const,
  borderRadius: '30px',
  padding: '32px',
}

const iconBadge = {
  width: '48px', height: '48px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)' as const,
  borderRadius: '16px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '20px', color: 'white',
  flexShrink: 0 as const,
}

export default function LandingPage() {
  const [arrowHovered, setArrowHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)

  return (
    <div style={{ background: '#060608', minHeight: '100vh', position: 'relative' }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', background: '#6366f1', filter: 'blur(140px)', opacity: 0.12, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-150px', width: '500px', height: '500px', background: '#06b6d4', filter: 'blur(140px)', opacity: 0.08, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '35%', width: '450px', height: '450px', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(6, 6, 8, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: 'white' }}>CrustQuery</span>
        <Link href="/search" style={{
          background: 'white', color: '#1a1a1a',
          borderRadius: '100px', padding: '8px 20px',
          fontSize: '14px', fontWeight: 600,
          textDecoration: 'none', fontFamily: 'var(--font-inter)',
        }}>
          Get Started
        </Link>
      </nav>

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 40px' }}>

          {/* ── Hero ── */}
          <section style={{ paddingTop: '100px', paddingBottom: '80px' }}>

            {/* SVG masked headline */}
            <div style={{ marginBottom: '32px' }}>
              <svg viewBox="0 0 1600 150" preserveAspectRatio="xMinYMid meet" style={{ width: '100%', height: '180px' }}>
                <defs>
                  <mask id="textMask">
                    <text x="0" y="120" fontFamily="Syne, sans-serif" fontSize="118" fontWeight="800" fill="white" style={{ textTransform: 'uppercase', letterSpacing: '-2px' }}>CRUSTQUERY</text>
                  </mask>
                </defs>
                <foreignObject mask="url(#textMask)" width="100%" height="100%">
                  {/* @ts-expect-error — foreignObject xmlns required for SVG mask */}
                  <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={MASK_IMAGE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </foreignObject>
              </svg>
            </div>

            {/* Hero glass card */}
            <div style={{
              borderRadius: '50px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
            }}>

              {/* Card content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', padding: '56px 60px' }}>

                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px' }}>
                  <div
                    onMouseEnter={() => setIconHovered(true)}
                    onMouseLeave={() => setIconHovered(false)}
                    style={{
                      width: '80px', height: '80px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'default',
                      transform: iconHovered ? 'rotate(6deg)' : 'rotate(0deg)',
                      transition: 'transform 500ms ease',
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-inter)', lineHeight: 1.5, margin: 0 }}>
                    Search 200M+ companies<br />in plain English
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['200M+ Companies', 'Real-time Data', 'No Setup Required'].map(stat => (
                      <span key={stat} style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '100px', padding: '6px 14px',
                        fontSize: '13px', color: 'rgba(255,255,255,0.8)',
                        fontFamily: 'var(--font-inter)',
                      }}>{stat}</span>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px' }}>
                  <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '42px', fontWeight: 800, color: 'white', lineHeight: 1.1, margin: 0 }}>
                    Stop wrestling with<br />B2B data filters.
                  </h1>

                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter)', lineHeight: 1.6, margin: 0 }}>
                    CrustQuery turns your plain English questions into Crustdata API calls automatically. Ask anything. Get results instantly.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/search" style={{
                      background: 'white', color: '#1a1a1a',
                      borderRadius: '100px', padding: '12px 28px',
                      fontSize: '15px', fontWeight: 600,
                      textDecoration: 'none', fontFamily: 'var(--font-inter)',
                    }}>
                      Try CrustQuery
                    </Link>
                    <a href="https://github.com/fatinm1/Crustquery" target="_blank" rel="noopener noreferrer" style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white', borderRadius: '100px',
                      padding: '12px 28px', fontSize: '15px',
                      fontWeight: 500, textDecoration: 'none',
                      fontFamily: 'var(--font-inter)',
                      backdropFilter: 'blur(20px)',
                    }}>
                      View on GitHub
                    </a>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="/search"
                      onMouseEnter={() => setArrowHovered(true)}
                      onMouseLeave={() => setArrowHovered(false)}
                      style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        background: 'white', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transform: arrowHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s',
                        flexShrink: 0,
                      }}
                    >
                      <svg viewBox="19.588 20.146 159.561 159.541" style={{ width: '40px', height: '40px', color: '#1a1a1a' }}>
                        <path fill="currentColor" d="M170.281 20.146v144.371L25.892 20.16l-6.27 6.268 144.421 144.393H19.588v8.866h159.561V20.146h-8.868z" />
                      </svg>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section style={{ paddingBottom: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '40px', textAlign: 'center' }}>
              How it works
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {STEPS.map((step) => (
                <div key={step.number} style={{ ...glassCard, position: 'relative', overflow: 'hidden' }}>
                  {/* Large ghost number */}
                  <div style={{
                    position: 'absolute', top: '-10px', right: '20px',
                    fontFamily: 'var(--font-syne)', fontSize: '80px', fontWeight: 800,
                    color: 'rgba(255,255,255,0.06)', lineHeight: 1, userSelect: 'none',
                    pointerEvents: 'none',
                  }}>{step.number}</div>

                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={iconBadge}>{step.icon}</div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter)', lineHeight: 1.6, margin: 0 }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Use Cases ── */}
          <section style={{ paddingBottom: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px', textAlign: 'center' }}>
              Built for teams that move fast
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)', textAlign: 'center', marginBottom: '40px' }}>
              From sourcing to research — CrustQuery fits how you already think.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {USE_CASES.map((uc) => (
                <div key={uc.role} style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={iconBadge}>{uc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
                      {uc.role}
                    </h3>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter)', lineHeight: 1.6, margin: 0 }}>
                      {uc.description}
                    </p>
                  </div>
                  <Link
                    href={`/search`}
                    style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '100px', padding: '8px 16px',
                      fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none', fontFamily: 'var(--font-inter)',
                      transition: 'all 0.15s',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  >
                    &ldquo;{uc.query}&rdquo; →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── Example Queries ── */}
          <section style={{ paddingBottom: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px', textAlign: 'center' }}>
              Ask anything
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)', textAlign: 'center', marginBottom: '40px' }}>
              Any question about companies, in any phrasing.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {EXAMPLE_QUERIES.map((q) => (
                <Link key={q} href="/search" style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px', padding: '16px 20px',
                  fontSize: '15px', color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none', fontFamily: 'var(--font-inter)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '12px', transition: 'all 0.15s',
                  backdropFilter: 'blur(20px)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
                >
                  <span>&ldquo;{q}&rdquo;</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section style={{ paddingBottom: '80px' }}>
            <div style={{
              borderRadius: '50px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative', textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
            }}>
              <div style={{ padding: '80px 60px' }}>
                <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '48px', fontWeight: 800, color: 'white', marginBottom: '16px', lineHeight: 1.1 }}>
                  Start searching in seconds.
                </h2>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-inter)', marginBottom: '40px' }}>
                  No signup. No API key. Just ask.
                </p>
                <Link href="/search" style={{
                  display: 'inline-block',
                  background: 'white', color: '#1a1a1a',
                  borderRadius: '100px', padding: '16px 40px',
                  fontSize: '16px', fontWeight: 600,
                  textDecoration: 'none', fontFamily: 'var(--font-inter)',
                  marginBottom: '24px',
                }}>
                  Try CrustQuery Free
                </Link>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)', margin: 0 }}>
                  Powered by Crustdata + Gemini
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '28px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          maxWidth: '1440px', margin: '0 auto',
        }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontSize: '18px', fontWeight: 700, color: 'white' }}>CrustQuery</span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)' }}>Built by Fatin Mojumder</span>
          <a href="https://github.com/fatinm1/Crustquery" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </footer>

      </main>
      </div>
    </div>
  )
}
