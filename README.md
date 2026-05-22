# CrustQuery

A natural language interface for the Crustdata B2B data API, powered by Claude. Type a plain English question — CrustQuery figures out which API filters to apply, executes the search, and returns a clean table of companies.

---

## The Problem

Crustdata's company search API is powerful but requires knowing the exact endpoint structure, how to nest boolean filter conditions, and which field names map to which data. Non-technical teams (sales, recruiting, VC) can't use it at all. Technical teams burn time writing boilerplate for every new query.

CrustQuery removes all of that friction. You describe what you want in plain English and the app handles everything else.

---

## How It Works

```
User types a query
       │
       ▼
FastAPI receives POST /query
       │
       ▼
Claude Sonnet reads the query + a system prompt describing the Crustdata API
       │
       ▼
Claude returns a structured JSON execution plan (endpoint, filters, sorts, fields)
       │
       ▼
Backend executes the Crustdata API call with the plan
       │
       ▼
Results + explanation returned to the frontend
       │
       ▼
Table rendered — company names linked, funding formatted, CSV export available
```

---

## Example Queries

| Query | What it does |
|---|---|
| `Find AI startups in New York with 50 to 200 employees` | Filters by industry, city, and headcount range |
| `Show me Series B SaaS companies in San Francisco` | Filters by funding stage, industry, and city |
| `Software companies founded after 2020 with more than $10M in funding` | Filters by year founded and total funding |
| `Healthcare companies in USA with 500+ employees` | Filters by industry, country, and headcount floor |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI | Claude Sonnet (`claude-sonnet-4-6`) via Anthropic SDK |
| HTTP client | httpx (async) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Data source | Crustdata B2B Data API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
crustquery/
├── backend/
│   ├── main.py                 # FastAPI app, POST /query endpoint, CORS
│   ├── agents/
│   │   └── query_agent.py      # Claude call → JSON plan → Crustdata API call
│   ├── requirements.txt
│   └── .env                    # ANTHROPIC_API_KEY, CRUSTDATA_API_KEY
└── frontend/
    ├── app/
    │   ├── page.tsx            # Full UI: search bar, chips, table, CSV export
    │   └── layout.tsx          # Root layout, metadata
    ├── package.json
    └── .env.local              # NEXT_PUBLIC_API_URL
```

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- A [Crustdata API key](https://crustdata.com/)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/fatinm1/Crustquery.git
cd Crustquery
```

### 2. Backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Add your API keys
cp .env .env.local              # or just edit .env directly
```

Edit `backend/.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
CRUSTDATA_API_KEY=...
```

Start the server:

```bash
uvicorn main:app --reload
# Running on http://localhost:8000
```

Verify it's up:

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

### 3. Frontend

```bash
cd frontend
npm install
```

Edit `frontend/.env.local` (already set by default for local dev):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
# Running on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## API Reference

### `POST /query`

The single endpoint the frontend calls.

**Request**

```json
{
  "query": "Find AI startups in New York with 50 to 200 employees"
}
```

**Response**

```json
{
  "results": [
    {
      "crustdata_company_id": 12345,
      "basic_info.name": "Acme AI",
      "basic_info.primary_domain": "acme.ai",
      "basic_info.year_founded": 2021,
      "headcount.total": 120,
      "locations.country": "USA",
      "locations.city": "New York",
      "funding.total_investment_usd": 15000000,
      "funding.last_round_type": "Series A",
      "taxonomy.professional_network_industry": "Software Development"
    }
  ],
  "total_count": 42,
  "explanation": "Searched for companies in the Software Development industry located in New York, USA with headcount between 50 and 200",
  "api_calls_made": ["POST /company/search"]
}
```

**Test with curl**

```bash
curl -X POST http://localhost:8000/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "Find software companies in the USA with more than 100 employees"}'
```

### `GET /health`

```json
{ "status": "ok" }
```

---

## How the Query Agent Works

`backend/agents/query_agent.py` runs three steps on every request:

**Step 1 — Ask Claude to build an execution plan**

Claude receives a system prompt that describes the Crustdata API: the available fields, supported filter operators, and the exact JSON structure it must return. It reads the user's natural language query and outputs a structured execution plan like this:

```json
{
  "endpoint": "POST /company/search",
  "payload": {
    "filters": {
      "op": "and",
      "conditions": [
        { "field": "taxonomy.professional_network_industry", "type": "in", "value": ["Software Development"] },
        { "field": "locations.country", "type": "=", "value": "USA" },
        { "field": "headcount.total", "type": ">", "value": 100 }
      ]
    },
    "fields": ["crustdata_company_id", "basic_info.name", "basic_info.primary_domain", ...],
    "sorts": [],
    "limit": 25
  },
  "explanation": "Searched for Software Development companies in the USA with more than 100 employees"
}
```

**Step 2 — Parse and validate the plan**

The agent extracts the JSON from Claude's response (handles markdown code fences if present) and raises a clear error if the output is malformed.

**Step 3 — Execute the Crustdata API call**

Using `httpx` async, it sends the payload to `https://api.crustdata.com/company/search` with the required headers, then returns the results alongside the explanation.

---

## Frontend Features

| Feature | Details |
|---|---|
| Dark UI | Background `#09090b`, zinc color palette |
| Search bar | Full-width input with placeholder query, disabled during loading |
| Example chips | 4 clickable preset queries that auto-submit |
| Loading state | Animated spinner with status text |
| Explanation card | Plain English summary of what was searched, result count, API call used |
| Results table | Company (linked to domain), Industry, City/Country, Headcount, Funding (formatted as $1.2M / $3.4B), Stage, Founded |
| CSV export | Downloads all returned results as a properly escaped CSV |
| Error state | Red banner with the error message from the backend |
| Zero results | Inline message prompting the user to broaden the query |

---

## Supported Filter Fields

The query agent can translate natural language into filters on any of these Crustdata fields:

| Field | Description | Operators |
|---|---|---|
| `basic_info.name` | Company name | `=` |
| `basic_info.primary_domain` | Website domain | `=` |
| `basic_info.year_founded` | Year the company was founded | `>` `<` `>=` `<=` |
| `locations.country` | Country (use `"USA"` for United States) | `=` `in` |
| `locations.city` | City name | `=` |
| `headcount.total` | Total employee count | `>` `<` `>=` `<=` |
| `funding.total_investment_usd` | Total funding raised in USD | `>` `<` `>=` `<=` |
| `funding.last_round_type` | Funding stage (`"Seed"`, `"Series A"`, `"Series B"`, …) | `=` `in` |
| `taxonomy.professional_network_industry` | Industry (`"Software Development"`, `"Healthcare"`, …) | `=` `in` |

Filters can be combined with `AND` / `OR` logic — Claude handles the nesting automatically.

---

## Deployment

### Backend — Railway

1. Create a new Railway project and connect this repo
2. Set the root directory to `backend/`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables: `ANTHROPIC_API_KEY`, `CRUSTDATA_API_KEY`
5. Deploy — Railway gives you a public URL like `https://crustquery-backend.railway.app`

### Frontend — Vercel

1. Import this repo into Vercel
2. Set root directory to `frontend/`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://crustquery-backend.railway.app`
4. Update CORS in `backend/main.py` to allow only your Vercel domain in production:

```python
allow_origins=["https://your-app.vercel.app"]
```

5. Deploy

---

## Credits & Costs

- Crustdata charges **0.03 credits per result returned**. Each search returning 25 results costs **0.75 credits**.
- Crustdata allows **15 requests per minute** on the default plan.
- Claude Sonnet API usage is billed separately per Anthropic's standard pricing.

---

## License

MIT
