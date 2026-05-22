"use client";

import { useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const EXAMPLE_QUERIES = [
  "AI startups in New York under 200 employees",
  "Series B SaaS companies in San Francisco",
  "Software companies founded after 2020 with $10M+ funding",
  "Healthcare companies in USA with 500+ employees",
];

interface Company {
  crustdata_company_id?: string | number;
  "basic_info.name"?: string;
  "basic_info.primary_domain"?: string;
  "basic_info.year_founded"?: number | string;
  "headcount.total"?: number | string;
  "locations.country"?: string;
  "locations.city"?: string;
  "funding.total_investment_usd"?: number | string;
  "funding.last_round_type"?: string;
  "taxonomy.professional_network_industry"?: string;
  [key: string]: unknown;
}

interface QueryResult {
  results: Company[];
  total_count: number;
  explanation: string;
  api_calls_made: string[];
}

function formatFunding(usd: number | string | undefined): string {
  if (usd == null || usd === "") return "—";
  const n = typeof usd === "string" ? parseFloat(usd) : usd;
  if (isNaN(n)) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function toCSV(results: Company[]): string {
  const headers = ["Company", "Domain", "Industry", "Country", "City", "Headcount", "Funding", "Stage", "Founded"];
  const rows = results.map((c) => [
    c["basic_info.name"] ?? "",
    c["basic_info.primary_domain"] ?? "",
    c["taxonomy.professional_network_industry"] ?? "",
    c["locations.country"] ?? "",
    c["locations.city"] ?? "",
    c["headcount.total"] ?? "",
    c["funding.total_investment_usd"] ?? "",
    c["funding.last_round_type"] ?? "",
    c["basic_info.year_founded"] ?? "",
  ]);
  return [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Request failed");
      }

      const data: QueryResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(query);
  };

  const handleChip = (q: string) => {
    setQuery(q);
    runQuery(q);
  };

  const downloadCSV = () => {
    if (!result) return;
    const csv = toCSV(result.results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "crustquery_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-white mb-3 tracking-tight">
            CrustQuery
          </h1>
          <p className="text-zinc-400 text-lg">
            Natural language search for B2B data powered by Crustdata + Claude
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find AI startups in New York with 50 to 200 employees..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-white text-zinc-900 font-semibold px-7 py-4 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
          >
            Search
          </button>
        </form>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleChip(q)}
              disabled={loading}
              className="text-sm text-zinc-400 border border-zinc-700 rounded-full px-4 py-1.5 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            <span className="text-zinc-400">Querying Crustdata via Claude...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-5 py-4 mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Explanation card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
              <p className="text-sm text-zinc-400 mb-1">What we searched for</p>
              <p className="text-white">{result.explanation}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                <span>{result.total_count} companies found</span>
                <span>{result.api_calls_made.join(", ")}</span>
              </div>
            </div>

            {/* CSV Export */}
            {result.results.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={downloadCSV}
                  className="text-sm border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Export CSV
                </button>
              </div>
            )}

            {/* Table */}
            {result.results.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-400 text-left">
                      <th className="px-4 py-3 font-medium">Company</th>
                      <th className="px-4 py-3 font-medium">Industry</th>
                      <th className="px-4 py-3 font-medium">Country</th>
                      <th className="px-4 py-3 font-medium">Headcount</th>
                      <th className="px-4 py-3 font-medium">Funding</th>
                      <th className="px-4 py-3 font-medium">Stage</th>
                      <th className="px-4 py-3 font-medium">Founded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {result.results.map((company, i) => {
                      const domain = company["basic_info.primary_domain"];
                      const name = company["basic_info.name"] ?? "Unknown";
                      return (
                        <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="px-4 py-3">
                            {domain ? (
                              <a
                                href={`https://${domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-medium"
                              >
                                {name}
                              </a>
                            ) : (
                              <span className="font-medium">{name}</span>
                            )}
                            {domain && (
                              <div className="text-xs text-zinc-500 mt-0.5">{domain}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {company["taxonomy.professional_network_industry"] ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {[company["locations.city"], company["locations.country"]]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {company["headcount.total"]?.toLocaleString() ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {formatFunding(company["funding.total_investment_usd"])}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {company["funding.last_round_type"] ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {company["basic_info.year_founded"] ?? "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                No results returned. Try broadening your query.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
