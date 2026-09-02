from services.gemini_service import gemini_service


def main() -> None:
    result = gemini_service.generate_content(
        source_text="""
        Artificial Intelligence is transforming education.
        AI-powered tools can provide personalized learning,
        automate repetitive tasks, and help students understand
        complex concepts.
        """,
        output_type="summary",
        tone="professional",
        length="short",
        language="English",
    )

    print("\n--- GENERATED CONTENT ---\n")
    print(result.content)

    print("\n--- MODEL ---")
    print(result.model)


if __name__ == "__main__":
    main()