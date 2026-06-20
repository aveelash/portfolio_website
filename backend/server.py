from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

from services.context_loader import get_visitor_info, build_prompt
from services.llm_provider import get_llm_provider
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
    attachments: list[FileAttachment] = []


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
async def chat(request: ChatRequest):
    user_prompt = request.prompt.strip()

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
            "provider": os.environ.get("LLM_PROVIDER", "gemini"),
            "attachments": [],
        }

    requested_documents = detect_document_requests(user_prompt)
    if requested_documents:
        return {
            "answer": build_document_answer(requested_documents),
            "provider": os.environ.get("LLM_PROVIDER", "gemini"),
            "attachments": build_attachments(requested_documents),
        }

    try:
        portfolio_context_prompt = build_prompt(
            user_id=request.user_id,
            user_prompt=user_prompt,
        )

        final_prompt = f"""
{SYSTEM_PROMPT}

Portfolio context:
{portfolio_context_prompt}

Recruiter question:
{user_prompt}

Answer professionally in 1000 words or less:
"""

        llm = get_llm_provider()
        answer = llm.generate_answer(final_prompt)

        return {
            "answer": answer,
            "provider": os.environ.get("LLM_PROVIDER", "gemini"),
            "attachments": [],
        }

    except Exception as error:
        logging.exception("Chat request failed")

        raise HTTPException(
            status_code=500,
            detail="Could not generate an answer right now.",
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
