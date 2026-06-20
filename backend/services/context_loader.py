from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


VISITORS = {
    "abc123": {
        "name": "Rahul",
        "company": "Zerodha",
        "sample_prompt": "Why is Aveelash a good fit for Zerodha?",
        "company_data": "Zerodha is a fintech company where reliability, scale, security, and uptime matter because users depend on the platform for financial workflows.",
    },
    "def456": {
        "name": "Priya",
        "company": "Razorpay",
        "sample_prompt": "What DevOps work has Aveelash done?",
        "company_data": "Razorpay is a payments and fintech platform where reliable infrastructure, safe deployments, observability, and incident prevention are important.",
    },
}


DEFAULT_VISITOR = {
    "name": "there",
    "company": "your company",
    "sample_prompt": "Why should we interview Aveelash?",
    "company_data": "The visitor's company is unknown. Keep the answer generally useful for a DevOps, SRE, Cloud, or Platform Engineering role.",
}


def read_text_file(filename: str) -> str:
    file_path = DATA_DIR / filename

    if not file_path.exists():
        return ""

    return file_path.read_text(encoding="utf-8")


def get_visitor_info(user_id: str | None) -> dict:
    if not user_id:
        return DEFAULT_VISITOR

    return VISITORS.get(user_id, DEFAULT_VISITOR)


def build_portfolio_context(user_id: str | None) -> dict:
    visitor = get_visitor_info(user_id)

    return {
        "visitor": visitor,
        "instructions": read_text_file("instructions.txt"),
        "resume": read_text_file("resume.txt"),
        "projects": read_text_file("projects.txt"),
        "about": read_text_file("about.txt"),
    }


def build_prompt(user_id: str | None, user_prompt: str) -> str:
    context = build_portfolio_context(user_id)
    visitor = context["visitor"]

    return f"""
{context["instructions"]}

VISITOR DATA:
Name: {visitor["name"]}
Company: {visitor["company"]}

COMPANY DATA:
{visitor["company_data"]}

AVEELASH RESUME:
{context["resume"]}

AVEELASH PROJECTS:
{context["projects"]}

OTHER INFO ABOUT AVEELASH:
{context["about"]}

USER QUESTION:
{user_prompt}

Return only the final answer. Do not mention that you were given context files.
""".strip()
