"""
Gemini AI Service
-----------------
Centralized service for interacting with the Google Gemini API.

Responsibilities:
- Initialize Gemini client
- Generate transformed content
- Manage prompts
- Validate inputs
- Handle API errors
- Return predictable responses
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Literal

from dotenv import load_dotenv
from google import genai


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

logger = logging.getLogger(__name__)


OutputType = Literal[
    "summary",
    "blog",
    "linkedin",
    "instagram",
    "email",
]

Tone = Literal[
    "professional",
    "casual",
    "academic",
    "friendly",
    "marketing",
]

Length = Literal[
    "short",
    "medium",
    "long",
]


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class GeminiServiceError(Exception):
    """Base exception for Gemini service errors."""


class GeminiConfigurationError(GeminiServiceError):
    """Raised when Gemini configuration is missing or invalid."""


class GeminiGenerationError(GeminiServiceError):
    """Raised when Gemini fails to generate content."""


class InvalidContentError(GeminiServiceError):
    """Raised when supplied content is invalid."""


# ---------------------------------------------------------------------------
# Response Model
# ---------------------------------------------------------------------------

@dataclass(slots=True)
class GenerationResult:
    """Standard response returned by the Gemini service."""

    content: str
    output_type: str
    model: str


# ---------------------------------------------------------------------------
# Gemini Service
# ---------------------------------------------------------------------------

class GeminiService:
    """
    Wrapper around the Google Gemini API.

    Example:

        service = GeminiService()

        result = service.generate_content(
            source_text="Artificial intelligence is...",
            output_type="summary",
            tone="professional",
            length="medium",
            language="English",
        )
    """

    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("GEMINI_MODEL")

        self._validate_configuration()

        try:
            self.client = genai.Client(
                api_key=self.api_key
            )

        except Exception as exc:
            logger.exception(
                "Failed to initialize Gemini client."
            )

            raise GeminiConfigurationError(
                "Unable to initialize Gemini client."
            ) from exc

    # -----------------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------------

    def generate_content(
        self,
        source_text: str,
        output_type: OutputType,
        tone: Tone = "professional",
        length: Length = "medium",
        language: str = "English",
    ) -> GenerationResult:
        """
        Transform source content into the requested format.

        Args:
            source_text:
                Extracted and cleaned source content.

            output_type:
                Desired output format.

            tone:
                Writing style.

            length:
                Desired output length.

            language:
                Target language.

        Returns:
            GenerationResult

        Raises:
            InvalidContentError:
                Invalid input content.

            GeminiGenerationError:
                Gemini API generation failure.
        """

        # Validate inputs
        self._validate_source_text(source_text)
        self._validate_output_type(output_type)
        self._validate_tone(tone)
        self._validate_length(length)

        # Build prompt
        prompt = self._build_prompt(
            source_text=source_text,
            output_type=output_type,
            tone=tone,
            length=length,
            language=language,
        )

        try:
            logger.info(
                "Generating %s content using model=%s",
                output_type,
                self.model,
            )

            # ---------------------------------------------------------------
            # Gemini Interactions API
            # ---------------------------------------------------------------

            interaction = self.client.interactions.create(
                model=self.model,
                input=prompt,
            )

            generated_text = interaction.output_text

            # ---------------------------------------------------------------
            # Response validation
            # ---------------------------------------------------------------

            if not generated_text or not generated_text.strip():
                raise GeminiGenerationError(
                    "Gemini returned an empty response."
                )

            logger.info(
                "Successfully generated %s content.",
                output_type,
            )

            return GenerationResult(
                content=generated_text.strip(),
                output_type=output_type,
                model=self.model,
            )

        except GeminiServiceError:
            raise

        except Exception as exc:
            logger.exception(
                "Gemini generation failed for output_type=%s",
                output_type,
            )

            raise GeminiGenerationError(
                "Gemini failed to generate the requested content."
            ) from exc

    # -----------------------------------------------------------------------
    # Prompt Engineering
    # -----------------------------------------------------------------------

    def _build_prompt(
        self,
        source_text: str,
        output_type: OutputType,
        tone: Tone,
        length: Length,
        language: str,
    ) -> str:
        """
        Build the prompt used for Gemini content transformation.
        """

        format_instruction = self._get_format_instruction(
            output_type
        )

        return f"""
You are the content transformation engine of GenAI-Transform.

Your task is to transform the SOURCE CONTENT into the requested
output format while preserving the original meaning and facts.

IMPORTANT RULES:

1. Use only information supported by the source content.
2. Do not invent statistics, names, events, citations, or facts.
3. Do not introduce unsupported claims.
4. Preserve important technical terminology.
5. Remove unnecessary repetition.
6. If information is insufficient, state that clearly.
7. Produce only the requested content.
8. Do not mention that you are an AI.
9. Follow the requested language, tone, and length.
10. Maintain factual consistency with the source.

OUTPUT FORMAT:
{output_type}

TONE:
{tone}

LENGTH:
{length}

TARGET LANGUAGE:
{language}

FORMAT-SPECIFIC REQUIREMENTS:
{format_instruction}

SOURCE CONTENT:
----------------
{source_text}
----------------

Generate the final transformed content now.
""".strip()

    # -----------------------------------------------------------------------
    # Output Format Instructions
    # -----------------------------------------------------------------------

    @staticmethod
    def _get_format_instruction(
        output_type: OutputType,
    ) -> str:
        """
        Return format-specific generation instructions.
        """

        instructions = {

            "summary": """
Create a concise and accurate summary.

Include:
- Main topic
- Important points
- Key findings
- Important conclusions

Do not add information that is absent from the source.
""",

            "blog": """
Create a well-structured blog/article.

Structure:
- Title
- Introduction
- Main sections
- Key points
- Conclusion

Keep the article informative, readable and
strictly grounded in the source.
""",

            "linkedin": """
Create a professional LinkedIn post.

Requirements:
- Start with a strong hook.
- Use short readable paragraphs.
- Highlight the most important insight.
- Keep the tone professional.
- End with 3–5 relevant hashtags.
- Avoid excessive hashtags.
""",

            "instagram": """
Create an engaging Instagram caption.

Requirements:
- Strong opening line.
- Short readable paragraphs.
- Clear key message.
- Appropriate emojis where useful.
- Relevant hashtags.
- Do not sacrifice factual accuracy.
""",

            "email": """
Create a professional email.

Include:
- Subject line
- Greeting
- Clear introduction
- Main information
- Call to action if appropriate
- Professional closing

Keep the email concise and clear.
""",
        }

        return instructions[output_type].strip()

    # -----------------------------------------------------------------------
    # Configuration Validation
    # -----------------------------------------------------------------------

    def _validate_configuration(self) -> None:
        """
        Validate required environment variables.
        """

        if not self.api_key:
            raise GeminiConfigurationError(
                "GEMINI_API_KEY is not configured."
            )

        if not self.model:
            raise GeminiConfigurationError(
                "GEMINI_MODEL is not configured."
            )

    # -----------------------------------------------------------------------
    # Source Text Validation
    # -----------------------------------------------------------------------

    @staticmethod
    def _validate_source_text(
        source_text: str,
    ) -> None:
        """
        Validate extracted document text.
        """

        if not source_text or not source_text.strip():
            raise InvalidContentError(
                "Source content cannot be empty."
            )

        # MVP safety limit.
        max_characters = 100_000

        if len(source_text) > max_characters:
            raise InvalidContentError(
                f"Source content exceeds the "
                f"{max_characters:,} character limit."
            )

    # -----------------------------------------------------------------------
    # Output Type Validation
    # -----------------------------------------------------------------------

    @staticmethod
    def _validate_output_type(
        output_type: str,
    ) -> None:

        valid_types = {
            "summary",
            "blog",
            "linkedin",
            "instagram",
            "email",
        }

        if output_type not in valid_types:
            raise InvalidContentError(
                f"Unsupported output type: {output_type}"
            )

    # -----------------------------------------------------------------------
    # Tone Validation
    # -----------------------------------------------------------------------

    @staticmethod
    def _validate_tone(
        tone: str,
    ) -> None:

        valid_tones = {
            "professional",
            "casual",
            "academic",
            "friendly",
            "marketing",
        }

        if tone not in valid_tones:
            raise InvalidContentError(
                f"Unsupported tone: {tone}"
            )

    # -----------------------------------------------------------------------
    # Length Validation
    # -----------------------------------------------------------------------

    @staticmethod
    def _validate_length(
        length: str,
    ) -> None:

        valid_lengths = {
            "short",
            "medium",
            "long",
        }

        if length not in valid_lengths:
            raise InvalidContentError(
                f"Unsupported length: {length}"
            )


# ---------------------------------------------------------------------------
# Shared Gemini Service Instance
# ---------------------------------------------------------------------------

gemini_service = GeminiService()