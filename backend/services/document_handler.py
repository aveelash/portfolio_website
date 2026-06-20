import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT_DIR / "assets"

DOCUMENTS = {
    "resume": {
        "filename": "Aveelash_Hota_Resume.pdf",
        "download_name": "Aveelash_Hota_Resume.pdf",
        "label": "Download Resume (PDF)",
        "fallback_url": (
            "https://drive.google.com/file/d/1JUfEgofnn3SfYxbxM2ZjRmVRV9OWZAZH/view?usp=sharing"
        ),
    },
    "certificate": {
        "filename": "AWS Certification (1).pdf",
        "download_name": "AWS_Cloud_Foundations_Certificate.pdf",
        "label": "Download Certificate (PDF)",
        "fallback_url": (
            "https://drive.google.com/file/d/1dygomEAHKNxzVBLbH-Rh57Cz8r0Ag2Ds/view?usp=sharing"
        ),
    },
}

FILE_INTENT_PATTERNS = [
    r"\b(send|share|download|get|provide|give|attach|need|want)\b.*\b(resume|cv|certificate|certification|cert)\b",
    r"\b(resume|cv|certificate|certification|cert)\b.*\b(pdf|file|please|download|link)\b",
    r"\b(show|view|see)\b.*\b(resume|cv|certificate|certification|cert)\b",
    r"\b(can i|could i|may i)\b.*\b(resume|cv|certificate|certification|cert)\b",
    r"\bcopy of\b.*\b(resume|cv|certificate|certification|cert)\b",
]

RESUME_TERMS = ("resume", " cv", "cv ", "curriculum vitae", " résumé")
CERTIFICATE_TERMS = (
    "certificate",
    "certification",
    "cert ",
    " cert",
    "credentials",
    "aws cloud foundations",
)

DIRECT_RESUME_PROMPTS = {
    "resume",
    "cv",
    "resume please",
    "your resume",
    "his resume",
    "the resume",
    "send resume",
    "download resume",
}

DIRECT_CERTIFICATE_PROMPTS = {
    "certificate",
    "certification",
    "certificate please",
    "your certificate",
    "your certification",
    "send certificate",
    "download certificate",
    "aws certificate",
    "aws certification",
}


def get_document_path(doc_type: str) -> Path:
    if doc_type not in DOCUMENTS:
        raise KeyError(f"Unknown document type: {doc_type}")
    return ASSETS_DIR / DOCUMENTS[doc_type]["filename"]


def document_available(doc_type: str) -> bool:
    try:
        path = get_document_path(doc_type)
    except KeyError:
        return False
    return path.is_file()


def _normalize_prompt(prompt: str) -> str:
    return re.sub(r"\s+", " ", prompt.strip().lower())


def _wants_resume(prompt: str) -> bool:
    if prompt in DIRECT_RESUME_PROMPTS:
        return True
    if not any(term in prompt for term in RESUME_TERMS):
        return False
    return any(re.search(pattern, prompt) for pattern in FILE_INTENT_PATTERNS)


def _wants_certificate(prompt: str) -> bool:
    if prompt in DIRECT_CERTIFICATE_PROMPTS:
        return True
    if not any(term in prompt for term in CERTIFICATE_TERMS):
        return False
    return any(re.search(pattern, prompt) for pattern in FILE_INTENT_PATTERNS)


def detect_document_requests(prompt: str) -> list[str]:
    normalized = _normalize_prompt(prompt)
    requested: list[str] = []

    if _wants_resume(normalized):
        requested.append("resume")
    if _wants_certificate(normalized):
        requested.append("certificate")

    return requested


def build_document_answer(doc_types: list[str]) -> str:
    if len(doc_types) == 2:
        return (
            "Here are Aveelash's resume and AWS Cloud Foundations certificate. "
            "Use the download buttons below."
        )

    doc_type = doc_types[0]
    doc = DOCUMENTS[doc_type]
    noun = "resume" if doc_type == "resume" else "certificate"
    return f"Here is Aveelash's {noun}. Use the download button below to get the PDF ({doc['label']})."


def build_attachments(doc_types: list[str]) -> list[dict]:
    attachments: list[dict] = []

    for doc_type in doc_types:
        doc = DOCUMENTS[doc_type]
        local = document_available(doc_type)
        attachments.append(
            {
                "type": doc_type,
                "label": doc["label"],
                "filename": doc["download_name"],
                "url": f"/files/{doc_type}" if local else doc["fallback_url"],
                "external": not local,
            }
        )

    return attachments
