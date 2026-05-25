import json
import logging
import os
import httpx
import anthropic
from fastapi import HTTPException

SYSTEM_PROMPT = """You are an API orchestration agent for Crustdata, a B2B data platform.
Your job is to parse a natural language query and return a structured JSON execution plan.

Available Crustdata endpoint:
POST https://api.crustdata.com/screener/screen/
Auth header: Authorization: Token {key}

Filter structure — always use op/conditions even for a single filter:
{
  "filters": {
    "op": "and",
    "conditions": [
      {"column": "column_name", "type": "operator", "value": value}
    ]
  },
  "offset": 0,
  "count": 25
}

Available operators: =, !=, >, >=, <, <=
Note: >= and <= ARE valid for this endpoint.

Available columns:
- company_name — company name (type: =, contains)
- headcount — total employees (type: =, !=, >, >=, <, <=)
- headcount_qoq_pct — headcount growth quarter over quarter % (type: >, >=, <, <=)
- largest_headcount_country — country where most employees are based (type: =). Common values: "USA", "India", "United Kingdom", "Canada", "Germany", "France", "Australia". Always use "USA" not "United States" or "US". City-level filtering is NOT supported — filter by country only.
- total_funding_raised_usd — total funding raised in USD (type: =, !=, >, >=, <, <=)
- days_since_last_fundraise — days since last funding round (type: >, >=, <, <=)

Always return a JSON object with this exact structure and nothing else:
{
  "endpoint": "POST /screener/screen/",
  "payload": {
    "filters": {
      "op": "and",
      "conditions": []
    },
    "offset": 0,
    "count": 25
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
        "https://api.crustdata.com/screener/screen/",
        headers={
            "Authorization": f"Token {crustdata_key}",
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

    results = data.get("records") or []
    total_count = data.get("total_count") or len(results)

    if total_count == 0 or len(results) == 0:
        explanation += " No results found — try broadening your query (e.g. remove location or headcount constraints)."

    return {
        "results": results,
        "total_count": total_count,
        "explanation": explanation,
        "api_calls_made": [plan.get("endpoint", "POST /screener/screen/")],
    }
