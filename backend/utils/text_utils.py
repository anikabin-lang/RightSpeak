def chunk_text(text: str, max_words: int = 1200) -> list[str]:
    """
    Splits text into chunks of roughly max_words while trying to maintain
    logical boundaries (paragraphs).
    """
    # Split by paragraphs first
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_word_count = 0

    for para in paragraphs:
        words = para.split()
        word_count = len(words)

        if not words:
            continue

        if current_word_count + word_count > max_words and current_chunk:
            # Join the current chunk and start a new one
            chunks.append('\n\n'.join(current_chunk))
            current_chunk = [para]
            current_word_count = word_count
        else:
            current_chunk.append(para)
            current_word_count += word_count

    if current_chunk:
        chunks.append('\n\n'.join(current_chunk))

    return chunks
