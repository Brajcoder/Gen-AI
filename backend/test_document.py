from services.document_service import document_service


def main() -> None:
    result = document_service.extract_text(
        "uploads/test.pdf"
    )

    print("\n--- DOCUMENT ---")
    print(result["filename"])

    print("\n--- PAGE COUNT ---")
    print(result["page_count"])

    print("\n--- EXTRACTED TEXT ---")
    print(result["text"][:3000])


if __name__ == "__main__":
    main()