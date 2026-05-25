import json
import logging
import os
import httpx
import anthropic
from fastapi import HTTPException

SYSTEM_PROMPT = """You are an API orchestration agent for Crustdata, a B2B data platform.
Your job is to parse a natural language query and return a structured JSON execution plan.

Available Crustdata endpoint:
POST https://api.crustdata.com/company/search
Headers: Authorization: Bearer {key}, x-api-version: 2025-11-01, Content-Type: application/json

Available operators:
- = (equals)
- != (not equals)
- < (less than)
- > (greater than)
- =< (less than or equal — use =< NOT <=)
- => (greater than or equal — use => NOT >=)
- in (value is a list)

CRITICAL: Never use >= or <=. Always use => and =< instead. Crustdata will reject >= and <=.

Filter structure — single condition (do NOT wrap a single filter in op/conditions):
{"field": "locations.country", "type": "=", "value": "USA"}

Filter structure — multiple conditions with AND:
{"op": "and", "conditions": [
  {"field": "field1", "type": "=", "value": "val1"},
  {"field": "field2", "type": ">", "value": 100}
]}

Keep filters simple — 2 to 3 conditions maximum.

Available filter fields:
- taxonomy.professional_network_industry — industry (type: =, in). Use exact values: "Software Development", "Financial Services", "Hospital & Health Care", "Information Technology & Services", "Computer Software", "Internet"
- locations.country — country (type: =, in). Use "USA" for United States only. Never use "United States" or "US". City-level filtering is NOT supported — never use locations.city.
- headcount.total — employee count (type: >, <, =>, =<)
- basic_info.year_founded — year founded (type: >, <, =>, =<)
- funding.total_investment_usd — total funding in USD (type: >, <, =>, =<)
- funding.last_round_type — funding stage (type: =, in). Use exact values: "series_a", "series_b", "series_c", "series_d", "seed", "post_ipo_equity", "post_ipo_debt", "private_equity"

Industry mapping rules:
- User says healthcare → use "Hospital & Health Care"
- User says fintech or finance → use "Financial Services"
- User says AI, software, or tech → use "Software Development"

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

    response = httpx.post(
        "https://api.crustdata.com/company/search",
        headers={
            "Authorization": f"Bearer {crustdata_key}",
            "x-api-version": "2025-11-01",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=30.0,
    )

    if response.status_code != 200:
        logging.error(f"Crustdata error. Payload sent:\n{json.dumps(payload, indent=2)}")
        logging.error(f"Crustdata error response: {response.text}")
        raise HTTPException(status_code=500, detail=f"Crustdata API error: {response.text}")

    data = response.json()

    logging.info(f"Crustdata raw response keys: {list(data.keys()) if isinstance(data, dict) else type(data)}")
    logging.info(f"Crustdata raw response sample: {str(data)[:500]}")

    results = (
        data.get("companies") or
        data.get("data") or
        data.get("results") or
        []
    )
    total_count = data.get("total_count") or len(results)

    if total_count == 0 or len(results) == 0:
        explanation += " No results found — try broadening your query (e.g. remove location or headcount constraints)."

    return {
        "results": results,
        "total_count": total_count,
        "explanation": explanation,
        "api_calls_made": [plan.get("endpoint", "POST /company/search")],
    }
