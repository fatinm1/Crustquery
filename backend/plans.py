"""Constrain model-generated plans before spending API credits."""
from pydantic import BaseModel, ConfigDict, Field, field_validator

FIELDS = {
    "crustdata_company_id", "basic_info.name", "basic_info.primary_domain", "headcount.total",
    "locations.country", "funding.total_investment_usd", "funding.last_round_type",
    "taxonomy.professional_network_industry", "basic_info.year_founded",
}
OPERATORS = {"=", "!=", "<", ">", "=<", "=>", "in"}


def validate_filter(value: dict, depth: int = 0) -> dict:
    if depth > 3:
        raise ValueError("Filter nesting is too deep")
    if not value:
        return value
    if "conditions" in value:
        if set(value) != {"op", "conditions"} or value["op"] not in {"and", "or"}:
            raise ValueError("Invalid filter group")
        children = value["conditions"]
        if not isinstance(children, list) or not 1 <= len(children) <= 3:
            raise ValueError("Use one to three filter conditions")
        for child in children:
            if not isinstance(child, dict):
                raise ValueError("Filter conditions must be objects")
            validate_filter(child, depth + 1)
    else:
        if set(value) != {"field", "type", "value"} or value["field"] not in FIELDS or value["type"] not in OPERATORS:
            raise ValueError("Unsupported filter field or operator")
        operand = value["value"]
        if value["type"] == "in":
            if not isinstance(operand, list) or not 1 <= len(operand) <= 25 or not all(isinstance(v, (str, int, float)) for v in operand):
                raise ValueError("Invalid membership values")
        elif not isinstance(operand, (str, int, float)) or isinstance(operand, bool):
            raise ValueError("Invalid filter value")
    return value


class QueryPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")
    filters: dict = Field(default_factory=dict)
    fields: list[str] = Field(min_length=1, max_length=20)
    sorts: list[dict] = Field(default_factory=list, max_length=3)
    limit: int = Field(default=25, ge=1, le=25)

    @field_validator("filters")
    @classmethod
    def filters_allowed(cls, value):
        return validate_filter(value)

    @field_validator("fields")
    @classmethod
    def fields_allowed(cls, value):
        if not set(value).issubset(FIELDS):
            raise ValueError("Unsupported result field")
        return value

    @field_validator("sorts")
    @classmethod
    def sorts_allowed(cls, value):
        for item in value:
            if set(item) != {"field", "order"} or item["field"] not in FIELDS or item["order"] not in {"asc", "desc"}:
                raise ValueError("Unsupported sort")
        return value
