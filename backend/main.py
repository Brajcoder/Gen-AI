"""
GenAI-Transform
---------------
FastAPI backend for the GenAI content transformation platform.
"""

from __future__ import annotations

import logging
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.document_service import (
    DocumentProcessingError,
    document_service,
)

from services.gemini_service import (
    GeminiServiceError,
    gemini_service,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# File Upload Configuration
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="GenAI-Transform API",
    description=(
        "AI-powered content transformation API "
        "using Google Gemini."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request Models
# ---------------------------------------------------------------------------

class TransformRequest(BaseModel):
    """
    Request body for content transformation.
    """

    content: str = Field(
        ...,
        min_length=1,
        description="Source content to transform.",
    )

    output_type: str = Field(
        default="summary",
        description=(
            "Output type: summary, blog, linkedin, "
            "instagram, or email."
        ),
    )

    tone: str = Field(
        default="professional",
        description="Desired writing tone.",
    )

    length: str = Field(
        default="medium",
        description="Desired content length.",
    )

    language: str = Field(
        default="English",
        description="Target language.",
    )


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/health")
async def health_check() -> dict:
    """
    Check whether the API is running.
    """

    return {
        "success": True,
        "message": "GenAI-Transform API is running.",
        "version": "0.1.0",
    }
# ---------------------------------------------------------------------------
# PDF Upload
# ---------------------------------------------------------------------------

@app.post("/api/v1/upload")
async def upload_document(
    file: UploadFile = File(...),
) -> dict:
    """
    Upload and extract text from a PDF document.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided.",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds the 10 MB limit.",
            )

        # Generate a unique filename to prevent collisions.
        file_id = uuid4().hex
        saved_filename = f"{file_id}{extension}"
        file_path = UPLOAD_DIR / saved_filename

        file_path.write_bytes(content)

        logger.info(
            "Uploaded document: %s",
            file.filename,
        )

        # Extract text
        document = document_service.extract_text(
            file_path
        )

        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "filename": document["filename"],
                "page_count": document["page_count"],
                "text": document["text"],
            },
        }

    except DocumentProcessingError as exc:
        logger.warning(
            "Document processing failed: %s",
            str(exc),
        )

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception(
            "Unexpected upload error.",
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to process uploaded document.",
        ) from exc


# ---------------------------------------------------------------------------
# Content Transformation
# ---------------------------------------------------------------------------

@app.post("/api/v1/transform")
async def transform_content(
    request: TransformRequest,
) -> dict:
    """
    Transform source content using Gemini.
    """

    logger.info(
        "Transformation request received: output_type=%s",
        request.output_type,
    )

    try:
        result = gemini_service.generate_content(
            source_text=request.content,
            output_type=request.output_type,
            tone=request.tone,
            length=request.length,
            language=request.language,
        )

        return {
            "success": True,
            "data": {
                "content": result.content,
                "output_type": result.output_type,
                "model": result.model,
            },
        }

    except GeminiServiceError as exc:
        logger.warning(
            "Gemini service error: %s",
            str(exc),
        )

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        logger.exception(
            "Unexpected transformation error."
        )

        raise HTTPException(
            status_code=500,
            detail="Internal server error.",
        ) from exc


# ---------------------------------------------------------------------------
# Direct Document Transformation (Upload + Process + Transform)
# ---------------------------------------------------------------------------

@app.post("/api/v1/transform-document")
async def transform_document(
    file: UploadFile = File(...),
    output_type: str = Form("summary"),
    tone: str = Form("professional"),
    length: str = Form("medium"),
    language: str = Form("English"),
) -> dict:
    """
    Upload a document and transform its content using Gemini in one request.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided.",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds the 10 MB limit.",
            )

        file_id = uuid4().hex
        saved_filename = f"{file_id}{extension}"
        file_path = UPLOAD_DIR / saved_filename

        file_path.write_bytes(content)

        logger.info(
            "Transforming document: %s (type=%s, tone=%s)",
            file.filename,
            output_type,
            tone,
        )

        # 1. Extract text from PDF
        doc_data = document_service.extract_text(file_path)

        # 2. Transform content with Gemini
        result = gemini_service.generate_content(
            source_text=doc_data["text"],
            output_type=output_type,
            tone=tone,
            length=length,
            language=language,
        )

        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "filename": doc_data["filename"],
                "page_count": doc_data["page_count"],
                "output_type": result.output_type,
                "model": result.model,
                "content": result.content,
            },
        }

    except DocumentProcessingError as exc:
        logger.warning("Document processing error: %s", str(exc))
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    except GeminiServiceError as exc:
        logger.warning("Gemini service error: %s", str(exc))
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Unexpected transform-document error.")
        raise HTTPException(
            status_code=500,
            detail="Failed to transform document.",
        ) from exc


# ---------------------------------------------------------------------------
# File Upload Configuration
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

ALLOWED_EXTENSIONS = {
    ".pdf",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB