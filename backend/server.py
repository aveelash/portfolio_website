from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pathlib import Path
from collections import defaultdict, deque
import os
import time
import threading
import logging

from services.context_loader import get_visitor_info, build_prompt
from services.llm_provider import get_llm_provider
from services.company_research import get_company_context
from services.document_handler import (
    DOCUMENTS,
    build_attachments,
    build_document_answer,
    detect_document_requests,
    document_available,
    get_document_path,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env", override=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------------- RATE LIMIT CONFIG ----------------

CHAT_LIMIT_PER_IP_PER_HOUR = int(os.getenv("CHAT_LIMIT_PER_IP_PER_HOUR", "5"))
CHAT_LIMIT_PER_IP_PER_DAY = int(os.getenv("CHAT_LIMIT_PER_IP_PER_DAY", "5"))
CHAT_GLOBAL_DAILY_LIMIT = int(os.getenv("CHAT_GLOBAL_DAILY_LIMIT", "40"))

ONE_HOUR_SECONDS = 60 * 60
ONE_DAY_SECONDS = 24 * 60 * 60

ip_chat_history = defaultdict(deque)
global_chat_history = deque()
rate_limit_lock = threading.Lock()


def get_client_ip(request: Request) -> str:
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()

    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


def prune_old_entries(history: deque, window_seconds: int) -> None:
    now = time.time()

    while history and now - history[0] > window_seconds:
        history.popleft()


def is_chat_limit_reached(request: Request) -> str | None:
    """
    Checks whether the visitor/site is already over limit.
    Does not register usage here.
    Usage is registered only after the AI provider successfully returns an answer.
    """
    now = time.time()
    client_ip = get_client_ip(request)

    with rate_limit_lock:
        user_history = ip_chat_history[client_ip]

        prune_old_entries(user_history, ONE_DAY_SECONDS)
        prune_old_entries(global_chat_history, ONE_DAY_SECONDS)

        hourly_count = sum(
            1 for timestamp in user_history if now - timestamp <= ONE_HOUR_SECONDS
        )

        # Check daily first. If hour=5 and day=5, the 6th request says daily limit.
        if len(user_history) >= CHAT_LIMIT_PER_IP_PER_DAY:
            return (
                "You have reached today's chat limit for this portfolio assistant. "
                "Please try again tomorrow. You can still view Aveelash's resume, "
                "projects, skills, education, certifications, and contact details from the portfolio."
            )

        if hourly_count >= CHAT_LIMIT_PER_IP_PER_HOUR:
            return (
                "You have reached the chat limit for this hour. "
                "Please try again in about 1 hour. You can still view Aveelash's resume, "
                "projects, skills, education, and certifications from the portfolio."
            )

        if len(global_chat_history) >= CHAT_GLOBAL_DAILY_LIMIT:
            return (
                "The portfolio assistant has reached its daily usage limit. "
                "Please try again tomorrow, or contact Aveelash directly."
            )

    return None


def register_successful_chat(request: Request) -> None:
    """
    Registers usage only after the AI provider successfully returns an answer.
    Failed AI/rate-limit attempts do not consume your custom chat quota.
    """
    now = time.time()
    client_ip = get_client_ip(request)

    with rate_limit_lock:
        ip_chat_history[client_ip].append(now)
        global_chat_history.append(now)


SYSTEM_PROMPT = """
You are Aveelash Hota's professional portfolio assistant.

Your job is to answer recruiters, hiring managers, and engineering leaders who are evaluating Aveelash for DevOps, SRE, Cloud, Platform Engineering, Backend Infrastructure, or related engineering roles.

You may answer questions only about Aveelash's professional profile, including:
- resume
- work experience
- projects
- technical skills
- DevOps, SRE, Cloud, Platform Engineering, Backend, Infrastructure
- AWS, Kubernetes, Docker, Terraform, CI/CD, Linux, Python, observability
- education
- certifications
- achievements
- career summary
- role fit
- company fit
- interview relevance
- strengths and areas of growth
- professional background

You must not answer random, private, irrelevant, or overly personal questions about Aveelash, including:
- food habits
- dating or relationships
- exact address or private location
- salary or financial details
- religion, caste, politics, health, family, or other sensitive personal details
- gossip
- jokes or unrelated personal trivia
- anything unrelated to hiring or professional evaluation

If the question is about Aveelash but not professionally relevant, politely redirect using this exact response:
"That question is outside the scope of this portfolio assistant. I can help with Aveelash's experience, projects, skills, education, certifications, resume, or fit for a DevOps/SRE/Cloud role."

Tone:
- Professional
- Clear
- Confident but not arrogant
- Recruiter-friendly
- Concise
- No fake claims
- No over-selling
- Do not say "aspiring DevOps"
- Do not invent experience, companies, numbers, certifications, or projects

Answer style:
- If the question is professional and related to Aveelash, answer directly.
- Prefer short paragraphs and bullets.
- Connect answers to hiring relevance when useful.
- If information is missing, say that clearly and suggest a relevant command or question.
- Keep every answer under 1000 words.
- Prefer concise answers. Most answers should be 150 to 350 words unless the recruiter asks for more detail.
"""


OUT_OF_SCOPE_RESPONSE = (
    "That question is outside the scope of this portfolio assistant. "
    "I can help with Aveelash's experience, projects, skills, education, "
    "certifications, resume, or fit for a DevOps/SRE/Cloud role."
)


PROFESSIONAL_KEYWORDS = [
    "resume",
    "cv",
    "experience",
    "work",
    "job",
    "role",
    "project",
    "projects",
    "skill",
    "skills",
    "tech",
    "technical",
    "education",
    "college",
    "degree",
    "certification",
    "certifications",
    "aws",
    "kubernetes",
    "docker",
    "terraform",
    "devops",
    "sre",
    "cloud",
    "platform",
    "backend",
    "infrastructure",
    "linux",
    "python",
    "ci/cd",
    "cicd",
    "monitoring",
    "observability",
    "prometheus",
    "grafana",
    "fit",
    "hire",
    "interview",
    "recruiter",
    "strength",
    "strengths",
    "weakness",
    "impact",
    "about",
    "summary",
    "career",
    "professional",
    "production",
    "deployment",
    "automation",
    "reliability",
    "company",
    "good fit",
    "suitable",
    "consider",
    "evaluate",
    "why",
    "background",
    "profile",
]


PRIVATE_OR_RANDOM_KEYWORDS = [
    "eat",
    "food",
    "drink",
    "dating",
    "girlfriend",
    "boyfriend",
    "relationship",
    "married",
    "wife",
    "husband",
    "salary",
    "ctc",
    "money",
    "religion",
    "caste",
    "politics",
    "political",
    "health",
    "disease",
    "address",
    "where does he live",
    "home address",
    "family",
    "gossip",
    "random",
    "personal life",
]


class ChatRequest(BaseModel):
    user_id: str | None = None
    visitor_name: str | None = None
    visitor_company: str | None = None
    prompt: str


class FileAttachment(BaseModel):
    type: str
    label: str
    filename: str
    url: str
    external: bool = False


class ChatResponse(BaseModel):
    answer: str
    provider: str
    attachments: list[FileAttachment] = Field(default_factory=list)


def count_words(text: str) -> int:
    return len(text.strip().split())


def is_professional_aveelash_question(prompt: str) -> bool:
    prompt_lower = prompt.lower()

    mentions_aveelash = (
        "aveelash" in prompt_lower
        or "hota" in prompt_lower
        or "candidate" in prompt_lower
    )

    has_professional_keyword = any(
        keyword in prompt_lower for keyword in PROFESSIONAL_KEYWORDS
    )

    has_private_or_random_keyword = any(
        keyword in prompt_lower for keyword in PRIVATE_OR_RANDOM_KEYWORDS
    )

    if has_private_or_random_keyword:
        return False

    if mentions_aveelash and has_professional_keyword:
        return True

    if has_professional_keyword:
        return True

    return False


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.get("/info")
async def info(user: str | None = None):
    return get_visitor_info(user)


@api_router.get("/documents")
async def list_documents():
    return build_attachments(list(DOCUMENTS.keys()))


@api_router.get("/files/{doc_type}")
async def download_document(doc_type: str):
    if doc_type not in DOCUMENTS:
        raise HTTPException(status_code=404, detail="Document not found")

    if not document_available(doc_type):
        raise HTTPException(
            status_code=404,
            detail=f"{DOCUMENTS[doc_type]['label']} is not available yet.",
        )

    doc = DOCUMENTS[doc_type]
    return FileResponse(
        path=get_document_path(doc_type),
        media_type="application/pdf",
        filename=doc["download_name"],
    )


@api_router.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, http_request: Request):
    user_prompt = chat_request.prompt.strip()
    provider_name = os.environ.get("LLM_PROVIDER", "auto")

    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    if count_words(user_prompt) > 100:
        raise HTTPException(
            status_code=400,
            detail="Prompt is too long. Please keep it under 100 words.",
        )

    if not is_professional_aveelash_question(user_prompt):
        return {
            "answer": OUT_OF_SCOPE_RESPONSE,
            "provider": provider_name,
            "attachments": [],
        }

    requested_documents = detect_document_requests(user_prompt)
    if requested_documents:
        return {
            "answer": build_document_answer(requested_documents),
            "provider": provider_name,
            "attachments": build_attachments(requested_documents),
        }

    limit_message = is_chat_limit_reached(http_request)
    if limit_message:
        return {
            "answer": limit_message,
            "provider": provider_name,
            "attachments": [],
        }

    try:
        visitor_info = get_visitor_info(chat_request.user_id)

        starting_page_company = (
            chat_request.visitor_company
            or visitor_info.get("company")
        )

        portfolio_context_prompt = build_prompt(
            user_id=chat_request.user_id,
            user_prompt=user_prompt,
        )

        company_context = get_company_context(
            prompt=user_prompt,
            fallback_company_name=starting_page_company,
        )

        final_prompt = f"""
{SYSTEM_PROMPT}

Visitor context:
Visitor name: {chat_request.visitor_name or visitor_info.get("name") or "Unknown"}
Visitor company from starting page: {starting_page_company or "Unknown"}
Company being evaluated: {starting_page_company or "Unknown"}

Company context:
{company_context if company_context else "No specific company context provided."}

Portfolio context:
{portfolio_context_prompt}

Recruiter question:
{user_prompt}

Answer in 500 words.
Use a natural recruiter-friendly tone.
Avoid markdown headings like ###.
Use short paragraphs and 3 to 5 bullets maximum.
Be specific but do not sound exaggerated.

If company context is provided, connect Aveelash's skills and experience to that company's engineering needs.
If the recruiter says "the company", "this company", or asks "why is Aveelash a good fit" without naming a company, use the visitor company from the starting page.
If a company name is available from the starting page, explicitly mention that company name in the first sentence.
Do not answer generically as "companies" or "organizations" when a company name is available.
Do not invent company facts beyond the company context.
If the company is unknown, give a general but practical company-fit answer.
"""

        llm = get_llm_provider()
        answer = llm.generate_answer(final_prompt)

        register_successful_chat(http_request)

        return {
            "answer": answer,
            "provider": provider_name,
            "attachments": [],
        }

    except RuntimeError as error:
        logging.exception("Chat request failed")

        return {
            "answer": (
                "The AI assistant is temporarily unavailable because the selected AI provider is rate-limiting requests right now. "
                "Please try again in a few minutes. You can still view Aveelash's resume, projects, skills, "
                "education, certifications, and contact details from the portfolio."
            ),
            "provider": provider_name,
            "attachments": [],
        }

    except Exception as error:
        logging.exception("Chat request failed")

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not generate an answer right now. "
                "Please try again in a few minutes."
            ),
        ) from error


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)