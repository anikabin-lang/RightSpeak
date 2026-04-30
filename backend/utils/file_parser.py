try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from docx import Document
except ImportError:
    Document = None

import io


def parse_pdf(file_bytes):
    """Extract text from PDF using PyMuPDF."""
    if fitz is None:
        raise ImportError("PyMuPDF (fitz) is not installed. Please run 'pip install pymupdf'.")
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def parse_docx(file_bytes):
    """Extract text from DOCX using python-docx."""
    if Document is None:
        raise ImportError("python-docx is not installed. Please run 'pip install python-docx'.")
    doc = Document(io.BytesIO(file_bytes))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text


def parse_file(file_content: bytes, filename: str) -> str:
    """Main entry point for file parsing."""
    extension = filename.split('.')[-1].lower()
    if extension == 'pdf':
        return parse_pdf(file_content)
    elif extension in ['docx', 'doc']:
        return parse_docx(file_content)
    elif extension == 'txt':
        return file_content.decode('utf-8', errors='ignore')
    else:
        raise ValueError(f"Unsupported file type: {extension}")
