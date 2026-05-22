# CrustQuery — Claude Code Build Prompt

Build a web app called **CrustQuery** — a natural language interface on top of the Crustdata B2B data API powered by Claude.

## The Problem

Crustdata has powerful APIs for company data, people data, jobs, and social posts. But every query requires knowing which endpoint to call, how to structure nested boolean filters, and how to manually join results across multiple API calls. Non-technical sales, recruiting, and VC teams cannot use it at all. Even technical teams spend significant time writing boilerplate.

CrustQuery solves this by letting users type a plain English question and automatically orchestrating the right Crustdata API calls behind the scenes.

## Example Queries The App Should Handle

- "Find AI startups in New York with 50 to 200 employees"
- "Show me software companies founded after 2020 with more than $10M in funding"
- "Find companies in the USA with headcount growth over 20% this year"
- "Show me Series B SaaS companies in San Francisco sorted by headcount"

## Tech Stack

- Backend: FastAPI (Python 3.11)
- Frontend: Next.js 14 with TypeScript and Tailwind CSS
- AI: Claude Sonnet via Anthropic SDK to parse queries into structured API calls
- Deployment: Vercel (frontend) + Railway (backend)
- Monorepo structure: /backend and /frontend folders

## Project Structure

```
crustquery/
├── backend/
│   ├── main.py
│   ├── agents/
│   │   └── query_agent.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   └── layout.tsx
    ├── package.json
    └── .env.local
```

---

## Backend — FastAPI

### Single endpoint: POST /query

Accepts:
```json
{ "query": "Find AI startups in New York with 50 to 200 employees" }
```

Returns:
```json
{
  "results": [...],
  "total_count": 42,
  "explanation": "Searched for companies in the Software Development industry located in USA with headcount between 50 and 200",
  "api_calls_made": ["POST /company/search"]
}
```

### The Query Agent (backend/agents/query_agent.py)

Step 1 — Send the user query to Claude Sonnet with this system prompt:

```
You are an API orchestration agent for Crustdata, a B2B data platform.
Your job is to parse a natural language query and return a structured JSON execution plan.

Available Crustdata endpoint:
POST https://api.crustdata.com/company/search
Headers required: Authorization: Bearer {key}, x-api-version: 2025-11-01, Content-Type: application/json

Filter structure:
- Single filter: {"field": "field_name", "type": "operator", "value": value}
- AND group: {"op": "and", "conditions": [...]}
- OR group: {"op": "or", "conditions": [...]}

Available operators: = | in | > | < | >= | <=

Key searchable fields for company search:
- basic_info.name — company name (type: =)
- basic_info.primary_domain — website domain (type: =)
- basic_info.year_founded — year founded (type: >, <, >=, <=)
- locations.country — country, use "USA" for United States (type: =, in)
- locations.city — city name (type: =)
- headcount.total — total employees (type: >, <, >=, <=)
- funding.total_investment_usd — total funding in USD (type: >, <, >=, <=)
- funding.last_round_type — funding stage e.g. "Series A", "Series B", "Seed" (type: =, in)
- taxonomy.professional_network_industry — industry e.g. "Software Development", "Financial Services", "Healthcare" (type: =, in)

Always return a JSON object with this exact structure and nothing else:
{
  "endpoint": "POST /company/search",
  "payload": {
    "filters": {...},
    "fields": [
      "crustdata_company_id",
      "basic_info.name",
      "basic_info.primary_domain",
      "headcount.total",
      "locations.country",
      "locations.city",
      "funding.total_investment_usd",
      "funding.last_round_type",
      "taxonomy.professional_network_industry",
      "basic_info.year_founded"
    ],
    "sorts": [...],
    "limit": 25
  },
  "explanation": "Human readable explanation of what you searched for"
}
```

Step 2 — Parse Claude's JSON response to get the execution plan

Step 3 — Execute the Crustdata API call using the plan

Step 4 — Return results plus the explanation

### Environment Variables (backend/.env)

```
ANTHROPIC_API_KEY=your_key
CRUSTDATA_API_KEY=your_key
```

### Requirements (backend/requirements.txt)

```
fastapi
uvicorn
python-dotenv
anthropic
httpx
pydantic
```

### CORS

Allow all origins in development. In production allow the Vercel frontend URL.

---

## Frontend — Next.js 14

### Single page (app/page.tsx)

Dark background (#09090b). Clean, minimal UI.

Layout:
1. Header — "CrustQuery" in large serif font, subtitle "Natural language search for B2B data powered by Crustdata + Claude"
2. Search bar — full width text input with placeholder "Find AI startups in New York with 50 to 200 employees..." and a Search button
3. Explanation card — shows the plain English explanation of what was searched after results load
4. Results table — columns: Company Name (linked to domain), Industry, Country, Headcount, Funding, Founded
5. CSV Export button — downloads results as CSV
6. Loading state — animated spinner while query runs
7. Error state — clean error message if query fails

### Example queries shown below the search bar (clickable chips):

- "AI startups in New York under 200 employees"
- "Series B SaaS companies in San Francisco"
- "Software companies founded after 2020 with $10M+ funding"
- "Healthcare companies in USA with 500+ employees"

### Environment Variables (frontend/.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Implementation Notes

1. Build the backend first and test it with curl before touching the frontend
2. The query agent must handle cases where Claude returns malformed JSON — wrap the parse in try/except and return a helpful error
3. If Crustdata returns 0 results suggest the user broaden their query in the explanation
4. Rate limit: Crustdata allows 15 requests per minute — no need to handle this for the demo
5. Credits: 0.03 credits per result returned — each search of 25 results costs 0.75 credits

---

## First Thing To Build

Start with just the backend. Create backend/main.py and backend/agents/query_agent.py. Get the /query endpoint working end to end. Test it with this curl:

```bash
curl -X POST http://localhost:8000/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "Find software companies in the USA with more than 100 employees"}'
```

Once that returns results, build the frontend.

Do not ask me questions — make reasonable decisions and build. If something is unclear, pick the most sensible default and move forward.
