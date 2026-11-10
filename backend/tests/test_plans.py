import pytest
from pydantic import ValidationError
from plans import QueryPayload

def plan(**updates):
    return {"fields": ["basic_info.name"], "filters": {}, **updates}

def test_valid_plan():
    assert QueryPayload.model_validate(plan()).limit == 25

@pytest.mark.parametrize("updates", [
    {"limit": 10000}, {"fields": ["private.secret"]},
    {"filters": {"field": "private.secret", "type": "=", "value": "x"}},
    {"filters": {"field": "headcount.total", "type": ">=", "value": 1}},
    {"filters": {"op": "or", "conditions": [None]}},
    {"sorts": [{"field": "private.secret", "order": "asc"}]},
])
def test_invalid_plan(updates):
    with pytest.raises((ValidationError, ValueError)):
        QueryPayload.model_validate(plan(**updates))
