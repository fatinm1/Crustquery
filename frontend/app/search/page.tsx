'use client'

import { useState } from 'react'
import Link from 'next/link'

const MASK_IMAGE = 'https://images.unsplash.com/photo-1652982261193-8160514e985b?w=1474&fit=crop&fm=jpg&q=80'

const CHIPS = [
  'AI startups in New York under 200 employees',
  'Series B SaaS companies in San Francisco',
  'Software companies founded after 2020 with $10M+ funding',
  'Healthcare companies in USA with 500+ employees',
]

// Normalize flat dotted keys ("basic_info.name") into nested objects
function normalise(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(raw)) {
    const parts = key.split('.')
    if (parts.length === 1) {
      out[key] = val
    } else {
      const top = parts[0]
      const rest = parts.slice(1).join('.')
      if (!out[top] || typeof out[top] !== 'object') out[top] = {}
      ;(out[top] as Record<string, unknown>)[rest] = val
    }
  }
  return out
}

const formatFunding = (usd: number | null) => {
  if (!usd) return '—'
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`
  return `$${(usd / 1_000).toFixed(0)}K`
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [explanation, setExplanation] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState('')
  const [iconHovered, setIconHovered] = useState(false)
  const [arrowHovered, setArrowHovered] = useState(false)
  const [searchBtnHovered, setSearchBtnHovered] = useState(false)

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery ?? query
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setExplanation('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Query failed')
      const normalised = (data.results || []).map(normalise)
      setResults(normalised)
      setExplanation(data.explanation || '')
      setTotalCount(data.total_count || normalised.length || 0)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Company', 'Domain', 'Industry', 'Country', 'Headcount', 'Funding USD', 'Founded']
    const rows = results.map((c) => {
      const bi = c.basic_info as Record<string, unknown> | undefined
      const tx = c.taxonomy as Record<string, unknown> | undefined
      const lo = c.locations as Record<string, unknown> | undefined
      const hc = c.headcount as Record<string, unknown> | undefined
      const fu = c.funding as Record<string, unknown> | undefined
      return [bi?.name, bi?.primary_domain, tx?.professional_network_industry, lo?.country, hc?.total, fu?.total_investment_usd, bi?.year_founded]
    })
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'crustquery-results.csv'
    a.click()
  }

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
        <Link href="/" style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: 'white', textDecoration: 'none' }}>
          CrustQuery
        </Link>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '100px', fontFamily: 'var(--font-inter)' }}>
          Powered by Crustdata
        </span>
      </nav>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1440px', margin: '0 auto', padding: '80px 40px 60px' }}>

        {/* Section 1 — SVG masked headline */}
        <div style={{ marginBottom: '32px' }}>
          <svg viewBox="0 0 1600 150" preserveAspectRatio="xMinYMid meet" style={{ width: '100%', height: '180px' }}>
            <defs>
              <mask id="textMask">
                <text x="0" y="120" fontFamily="Syne, sans-serif" fontSize="118" fontWeight="800" fill="white" style={{ textTransform: 'uppercase', letterSpacing: '-2px' }}>CRUSTQUERY</text>
              </mask>
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="white" stopOpacity="0" />
                <stop offset="40%"  stopColor="white" stopOpacity="0" />
                <stop offset="50%"  stopColor="white" stopOpacity="0.85" />
                <stop offset="60%"  stopColor="white" stopOpacity="0" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
                <animateTransform attributeName="gradientTransform" type="translate" from="-1600 0" to="1600 0" dur="5s" repeatCount="indefinite" />
              </linearGradient>
              <mask id="shimmerMask">
                <text x="0" y="120" fontFamily="Syne, sans-serif" fontSize="118" fontWeight="800" fill="white" style={{ textTransform: 'uppercase', letterSpacing: '-2px' }}>CRUSTQUERY</text>
              </mask>
            </defs>
            <foreignObject mask="url(#textMask)" width="100%" height="100%">
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={MASK_IMAGE} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </foreignObject>

            {/* Shimmer light sweep */}
            <rect x="0" y="0" width="1600" height="150" fill="url(#shimmer)" mask="url(#shimmerMask)" style={{ mixBlendMode: 'screen' }} />
          </svg>
        </div>

        {/* Section 2 — Main glass card */}
        <div style={{
          borderRadius: '50px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
        }}>

          {/* Card content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', padding: '56px 60px' }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px' }}>
              {/* Icon badge */}
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

              <div>
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-inter)', lineHeight: 1.5, margin: 0 }}>
                  Natural Language<br />B2B Intelligence
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['200M+', 'Company profiles'],
                  ['<2s', 'Query time'],
                  ['9', 'Searchable fields'],
                ].map(([val, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '22px', fontWeight: 800, color: 'white' }}>{val}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-inter)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              <p style={{ fontSize: '18px', color: 'white', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-inter)' }}>
                CrustQuery translates your words into Crustdata API calls. No filters, no boolean logic — just ask in plain English.
              </p>

              {/* Search bar */}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: '100px',
                padding: '8px 8px 8px 24px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Find AI startups in New York with 50 to 200 employees..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'white', fontSize: '15px', fontFamily: 'var(--font-inter)',
                  }}
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={loading || !query.trim()}
                  onMouseEnter={() => setSearchBtnHovered(true)}
                  onMouseLeave={() => setSearchBtnHovered(false)}
                  style={{
                    background: 'white', color: '#1a1a1a',
                    border: 'none', borderRadius: '100px',
                    padding: '10px 24px', fontSize: '15px',
                    fontWeight: 600, cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !query.trim() ? 0.5 : 1,
                    transform: searchBtnHovered && !loading && query.trim() ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s, opacity 0.15s',
                    fontFamily: 'var(--font-inter)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Example chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => { setQuery(chip); handleSearch(chip) }}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '100px', padding: '6px 14px',
                      fontSize: '13px', color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: 'var(--font-inter)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Arrow button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => handleSearch()}
                  onMouseEnter={() => setArrowHovered(true)}
                  onMouseLeave={() => setArrowHovered(false)}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    background: 'white', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transform: arrowHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s',
                  }}
                >
                  <svg viewBox="19.588 20.146 159.561 159.541" style={{ width: '40px', height: '40px', color: '#1a1a1a' }}>
                    <path fill="currentColor" d="M170.281 20.146v144.371L25.892 20.16l-6.27 6.268 144.421 144.393H19.588v8.866h159.561V20.146h-8.868z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3 — Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'white',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: 'var(--font-inter)' }}>
              Querying Crustdata...
            </p>
          </div>
        )}

        {/* Section 4 — Explanation card */}
        {explanation && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px', padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter)' }}>
              {explanation}
            </span>
            <span style={{ fontSize: '13px', color: 'white', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '16px', fontFamily: 'var(--font-inter)' }}>
              {totalCount} results
            </span>
          </div>
        )}

        {/* Section 5 — Results table */}
        {results.length > 0 && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '30px', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Company', 'Industry', 'Location', 'Headcount', 'Funding', 'Founded'].map(col => (
                    <th key={col} style={{
                      padding: '14px 20px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-inter)',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((company, i) => {
                  const bi = company.basic_info as Record<string, unknown> | undefined
                  const tx = company.taxonomy as Record<string, unknown> | undefined
                  const lo = company.locations as Record<string, unknown> | undefined
                  const hc = company.headcount as Record<string, unknown> | undefined
                  const fu = company.funding as Record<string, unknown> | undefined
                  return (
                    <tr key={i}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <a
                          href={`https://${bi?.primary_domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'white')}
                        >
                          {String(bi?.name || 'Unknown')}
                        </a>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)' }}>
                        {String(tx?.professional_network_industry || '—')}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)' }}>
                        {String(lo?.country || '—')}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                        {hc?.total != null ? Number(hc.total).toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                        {formatFunding(fu?.total_investment_usd as number | null)}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                        {String(bi?.year_founded || '—')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={exportCSV} style={{
                background: 'white', color: '#1a1a1a',
                border: 'none', borderRadius: '100px',
                padding: '8px 20px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-inter)',
              }}>
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* Section 6 — Error */}
        {error && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px', padding: '14px 24px',
            fontSize: '14px', color: '#fca5a5',
            fontFamily: 'var(--font-inter)',
          }}>
            {error}
          </div>
        )}

      </div>
      </div>
    </div>
  )
}
