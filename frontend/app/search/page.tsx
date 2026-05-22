'use client'

import { useState } from 'react'
import Link from 'next/link'

const formatFunding = (usd: number | null) => {
  if (!usd) return '—'
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`
  return `$${(usd / 1_000).toFixed(0)}K`
}

// Normalise flat dotted keys ("basic_info.name") into nested objects so both
// API response shapes work transparently.
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

export default function Home() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [explanation, setExplanation] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState('')

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setExplanation('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', background: '#6366f1', filter: 'blur(140px)', opacity: 0.12, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-150px', width: '500px', height: '500px', background: '#06b6d4', filter: 'blur(140px)', opacity: 0.08, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '35%', width: '450px', height: '450px', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(6,6,8,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, color: 'inherit', textDecoration: 'none' }}>CrustQuery</Link>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '100px' }}>
          Powered by Crustdata
        </span>
      </nav>

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 1, padding: '0 24px 80px' }}>

        {/* Hero */}
        <section style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
            <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 500 }}>Natural Language B2B Intelligence</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
            Search any company,<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              in plain English.
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            CrustQuery translates your words into Crustdata API calls automatically. No filters, no boolean logic, no setup.
          </p>
        </section>

        {/* Search bar */}
        <div style={{ maxWidth: '680px', margin: '0 auto 24px', background: 'var(--surface)', backdropFilter: 'blur(24px)', border: `1px solid ${focused ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`, boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.08)' : 'none', borderRadius: '14px', padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
          <input
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'var(--font-jakarta)' }}
            placeholder="Find AI startups in New York with 50 to 200 employees..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading || !query.trim() ? 0.5 : 1, transition: 'all 0.15s', fontFamily: 'var(--font-jakarta)', whiteSpace: 'nowrap' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '680px', margin: '0 auto 60px' }}>
          {[
            'AI startups in New York under 200 employees',
            'Series B SaaS companies in San Francisco',
            'Software companies founded after 2020 with $10M+ funding',
            'Healthcare companies in USA with 500+ employees'
          ].map(chip => (
            <button key={chip}
              onClick={() => { setQuery(chip); handleSearch(chip) }}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '100px', padding: '7px 16px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-jakarta)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Querying Crustdata...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ maxWidth: '680px', margin: '0 auto 24px', background: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: '12px', padding: '14px 20px', fontSize: '14px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {/* Explanation card */}
        {explanation && (
          <div style={{ maxWidth: '900px', margin: '0 auto 20px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{explanation}</span>
            <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '16px' }}>{totalCount} results</span>
          </div>
        )}

        {/* Results table */}
        {results.length > 0 && (
          <div style={{ maxWidth: '900px', margin: '0 auto 40px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                  {['Company', 'Industry', 'Location', 'Headcount', 'Funding', 'Founded'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: 'var(--font-jakarta)' }}>{col}</th>
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
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <a href={`https://${bi?.primary_domain}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'white')}
                        >
                          {String(bi?.name || 'Unknown')}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {String(tx?.professional_network_industry || '—')}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {String(lo?.country || '—')}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {hc?.total != null ? Number(hc.total).toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {formatFunding(fu?.total_investment_usd as number | null)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {String(bi?.year_founded || '—')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* CSV Export */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={exportCSV} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-jakarta)' }}>
                Export CSV
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
