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


def find_company_in_text(text: str) -> str | None:
    """
    Checks if the text contains a company from companies.json.
    Returns company key like 'myntra', 'amazon', 'zerodha'.
    """
    if not text:
        return None

    companies = load_companies()
    text_lower = normalize_text(text)

    for company_key, company_data in companies.items():
        if company_key == "default":
            continue

        company_name = normalize_text(company_data.get("name", company_key))

        if company_key in text_lower or company_name in text_lower:
            return company_key

    return None


def extract_possible_company_from_prompt(prompt: str) -> str | None:
    """
    Fallback for prompts like:
    - good fit for Razorpay?
    - role at PhonePe?
    - hire him at Amazon?
    """
    patterns = [
        r"fit for ([a-zA-Z0-9&.\-\s]+)",
        r"fit at ([a-zA-Z0-9&.\-\s]+)",
        r"role at ([a-zA-Z0-9&.\-\s]+)",
        r"work at ([a-zA-Z0-9&.\-\s]+)",
        r"hire .* at ([a-zA-Z0-9&.\-\s]+)",
        r"what about ([a-zA-Z0-9&.\-\s]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, prompt, re.IGNORECASE)
        if match:
            possible_company = match.group(1).strip()

            possible_company = re.sub(
                r"\b(role|company|team|position|job)\b",
                "",
                possible_company,
                flags=re.IGNORECASE,
            ).strip()

            possible_company = possible_company.strip(" ?.,!")

            if possible_company:
                return possible_company

    return None


def is_company_fit_question(prompt: str, fallback_company_name: str | None = None) -> bool:
    prompt_lower = normalize_text(prompt)

    # If prompt mentions a company from companies.json, it is a company-context question.
    if find_company_in_text(prompt):
        return True

    # If the page/user_id has a company name and the prompt is about fit,
    # use that starting-page company.
    fit_words = [
        "fit",
        "good fit",
        "hire",
        "suitable",
        "relevant",
        "why should",
        "why is",
        "company",
        "role",
        "work",
        "what about",
    ]

    if fallback_company_name and any(word in prompt_lower for word in fit_words):
        return True

    # If prompt sounds like company-fit even without fallback.
    return any(word in prompt_lower for word in fit_words)


def detect_company_from_prompt_or_fallback(
    prompt: str,
    fallback_company_name: str | None = None,
) -> tuple[str | None, str | None]:
    """
    Priority:
    1. Company explicitly mentioned in prompt
    2. Company extracted from prompt phrase
    3. Company from starting page/user_id
    4. None
    """

    # 1. Exact company from prompt
    company_key = find_company_in_text(prompt)
    if company_key:
        return company_key, None

    # 2. Extract unknown company from prompt phrase
    possible_company = extract_possible_company_from_prompt(prompt)
    if possible_company:
        known_company_key = find_company_in_text(possible_company)
        if known_company_key:
            return known_company_key, None

        return None, possible_company

    # 3. Use starting page company
    if fallback_company_name:
        known_company_key = find_company_in_text(fallback_company_name)
        if known_company_key:
            return known_company_key, None

        return None, fallback_company_name

    return None, None


def format_company_context(company_data: dict) -> str:
    name = company_data.get("name", "the company")
    industry = company_data.get("industry", "")
    roles_researched = company_data.get("roles_researched", [])
    engineering_context = company_data.get("engineering_context", "")
    devops_sre_cloud_signals = company_data.get("devops_sre_cloud_signals", [])
    company_engineering_needs = company_data.get("company_engineering_needs", "")
    why_aveelash_fits = company_data.get("why_aveelash_fits", "")
    answer_angle = company_data.get("answer_angle", "")

    signals_text = ""
    if devops_sre_cloud_signals:
        signals_text = "\n".join(f"- {signal}" for signal in devops_sre_cloud_signals)

    roles_text = ""
    if roles_researched:
        roles_text = ", ".join(roles_researched)

    return f"""
Company name: {name}
Industry: {industry}
Roles researched: {roles_text}

Company engineering context:
{engineering_context}

DevOps/SRE/Cloud/Platform signals:
{signals_text}

Company engineering needs:
{company_engineering_needs}

How Aveelash maps to this company:
{why_aveelash_fits}

Answer guidance:
{answer_angle}
""".strip()


def get_company_context(
    prompt: str,
    fallback_company_name: str | None = None,
) -> str:
    """
    Returns only one company context.

    Priority:
    - If prompt says Zerodha, use Zerodha.
    - Else if page/user_id company is Myntra, use Myntra.
    - Else use default context.
    """
    if not is_company_fit_question(prompt, fallback_company_name):
        return ""

    companies = load_companies()

    company_key, unknown_company_name = detect_company_from_prompt_or_fallback(
        prompt=prompt,
        fallback_company_name=fallback_company_name,
    )

    if company_key:
        company_data = companies.get(company_key)
        if company_data:
            return format_company_context(company_data)

    if unknown_company_name:
        default_data = companies.get("default", {}).copy()
        default_data["name"] = unknown_company_name.title()
        return format_company_context(default_data)

    default_data = companies.get("default")
    if default_data:
        return format_company_context(default_data)

    return ""