import json
import re
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
COMPANIES_FILE = ROOT_DIR / "companies.json"


def load_companies() -> dict:
    if not COMPANIES_FILE.exists():
        return {}

    with open(COMPANIES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize_text(text: str) -> str:
    return text.lower().strip()


def detect_company_from_prompt(prompt: str) -> str | None:
    """
    Detect company from questions like:
    - Why is Aveelash a good fit for Myntra?
    - Why should Amazon hire him?
    - Is Aveelash suitable for Flipkart?
    """
    companies = load_companies()
    prompt_lower = normalize_text(prompt)

    for company_key, company_data in companies.items():
        if company_key == "default":
            continue

        company_name = normalize_text(company_data.get("name", company_key))

        if company_key in prompt_lower or company_name in prompt_lower:
            return company_key

    # Pattern fallback: "fit for Myntra", "good fit for Amazon"
    patterns = [
        r"fit for ([a-zA-Z0-9&.\-\s]+)",
        r"fit at ([a-zA-Z0-9&.\-\s]+)",
        r"hire .* at ([a-zA-Z0-9&.\-\s]+)",
        r"for ([a-zA-Z0-9&.\-\s]+)\?",
    ]

    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            possible_company = match.group(1).strip()

            # remove extra words
            possible_company = re.sub(
                r"\b(role|company|team|position|job)\b",
                "",
                possible_company,
                flags=re.IGNORECASE,
            ).strip()

            if possible_company:
                return possible_company.lower()

    return None


def is_company_fit_question(prompt: str) -> bool:
    prompt_lower = normalize_text(prompt)

    fit_words = [
        "fit",
        "good fit",
        "hire",
        "suitable",
        "relevant",
        "why should",
        "why is",
        "company",
        "role at",
        "work at",
    ]

    return any(word in prompt_lower for word in fit_words)


def get_company_context(prompt: str) -> str:
    """
    Returns company context if the prompt asks about company fit.
    Falls back to default company context if company is unknown.
    """
    if not is_company_fit_question(prompt):
        return ""

    companies = load_companies()
    company_key = detect_company_from_prompt(prompt)

    if not company_key:
        company_data = companies.get("default")
    else:
        company_data = companies.get(company_key)

        if not company_data:
            company_data = companies.get("default", {}).copy()
            company_data["name"] = company_key.title()

    if not company_data:
        return ""

    name = company_data.get("name", "the company")
    industry = company_data.get("industry", "")
    engineering_context = company_data.get("engineering_context", "")
    why_aveelash_fits = company_data.get("why_aveelash_fits", "")

    return f"""
Company name: {name}
Industry: {industry}

Company engineering context:
{engineering_context}

How Aveelash maps to this company:
{why_aveelash_fits}
""".strip()
