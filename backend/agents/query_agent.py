import json
import os
import httpx
import anthropic

SYSTEM_PROMPT = """You are an API orchestration agent for Crustdata, a B2B data platform.
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
    "filters": {},
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
    "sorts": [],
    "limit": 25
  },
  "explanation": "Human readable explanation of what you searched for"
}"""


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        inner = "\n".join(lines[1:])
        if inner.rstrip().endswith("```"):
            inner = inner.rstrip()[:-3].rstrip()
        text = inner
    return json.loads(text)


async def run_query(user_query: str) -> dict:
    crustdata_key = os.getenv("CRUSTDATA_API_KEY")

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": SYSTEM_PROMPT + "\n\nUser query: " + user_query}
        ],
    )

    raw = response.content[0].text

    try:
        plan = _extract_json(raw)
    except (json.JSONDecodeError, IndexError) as e:
        raise ValueError(f"Claude returned malformed JSON: {e}\n\nRaw response:\n{raw}")

    payload = plan.get("payload", {})
    explanation = plan.get("explanation", "")

    async with httpx.AsyncClient(timeout=30) as http:
        response = await http.post(
            "https://api.crustdata.com/company/search",
            headers={
                "Authorization": f"Bearer {crustdata_key}",
                "x-api-version": "2025-11-01",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    results = data.get("results", data if isinstance(data, list) else [])
    total_count = data.get("total_count", len(results))

    if total_count == 0 or len(results) == 0:
        explanation += " No results found — try broadening your query (e.g. remove location or headcount constraints)."

    return {
        "results": results,
        "total_count": total_count,
        "explanation": explanation,
        "api_calls_made": [plan.get("endpoint", "POST /company/search")],
    }
