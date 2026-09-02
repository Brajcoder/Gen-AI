"""
Document Processing Service
---------------------------
Handles extraction of text and metadata from supported documents.
"""

from __future__ import annotations
import logging
from pathlib import Path

import pymupdf # PyMuPDF


logger = logging.getLogger(__name__)


class DocumentProcessingError(Exception):
    """Raised when document processing fails."""


class DocumentService:
    """Service for extracting content from supported documents."""

    SUPPORTED_EXTENSIONS = {".pdf"}

    def extract_text(self, file_path: str | Path) -> dict:
        """
        Extract text from a PDF document.

        Returns:
            {
                "filename": "...",
                "text": "...",
                "page_count": 10
            }
        """

        path = Path(file_path)

        if not path.exists():
            raise DocumentProcessingError(
                "Document does not exist."
            )

        if path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
            raise DocumentProcessingError(
                f"Unsupported file type: {path.suffix}"
            )

        try:
            document = pymupdf.open(path)

            pages = []
            page_count = len(document)

            for page_number, page in enumerate(document, start=1):
                text = page.get_text("text").strip()

                if text:
                    pages.append(
                        f"[Page {page_number}]\n{text}"
                    )

            document.close()

            extracted_text = "\n\n".join(pages).strip()

            if not extracted_text:
                raise DocumentProcessingError(
                    "No readable text found in the PDF."
                )

            logger.info(
                "Extracted %d pages from %s",
                page_count,
                path.name,
            )

            return {
                "filename": path.name,
                "text": extracted_text,
                "page_count": page_count,
            }

        except DocumentProcessingError:
            raise

        except Exception as exc:
            logger.exception(
                "Failed to process document: %s",
                path.name,
            )

            raise DocumentProcessingError(
                "Failed to extract text from document."
            ) from exc


document_service = DocumentService()