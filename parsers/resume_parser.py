"""Resume parsing module for HireSense AI.
Extracts raw text from PDF/text and segments sections with high precision.
"""

import io
import re
from typing import Dict, Any, List, Union
from utils.text import clean_text

def extract_text_from_pdf(pdf_file: Union[bytes, io.BytesIO, str]) -> str:
    """Extract raw text from a PDF file stream or path using pypdf."""
    try:
        import pypdf
        if isinstance(pdf_file, str):
            reader = pypdf.PdfReader(pdf_file)
        elif isinstance(pdf_file, bytes):
            reader = pypdf.PdfReader(io.BytesIO(pdf_file))
        else:
            reader = pypdf.PdfReader(pdf_file)

        text_pages = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            text_pages.append(page_text)
        return clean_text("\n".join(text_pages))
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def parse_resume(resume_text: str) -> Dict[str, Any]:
    """Parse raw resume text into structured components without inventing details.
    
    Adheres to anti-gravity rules:
    - Only extracts what is explicitly stated in the text.
    - Preserves exact line items and wording.
    """
    cleaned = clean_text(resume_text)
    
    # Heuristic extraction of contact info
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", cleaned)
    phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", cleaned)
    linkedin_match = re.search(r"linkedin\.com/in/[\w\-]+", cleaned, re.IGNORECASE)
    github_match = re.search(r"github\.com/[\w\-]+", cleaned, re.IGNORECASE)

    # Common section header patterns
    sections_patterns = {
        "summary": r"(?:summary|professional summary|profile|about me|objective)",
        "experience": r"(?:work experience|experience|employment history|professional experience|work history)",
        "education": r"(?:education|academic background|qualifications)",
        "skills": r"(?:skills|technical skills|core competencies|technologies)",
        "projects": r"(?:projects|personal projects|key projects)",
        "certifications": r"(?:certifications|certificates|licenses)"
    }

    # Split lines and identify sections
    lines = [line.strip() for line in cleaned.split("\n") if line.strip()]
    
    candidate_name = lines[0] if lines else "Not clearly mentioned in the resume"
    # If the first line is an email/phone or generic header, fallback
    if email_match and candidate_name == email_match.group(0):
        candidate_name = "Candidate (Name not explicitly isolated)"

    # Identify section spans
    section_indices = []
    for idx, line in enumerate(lines):
        # Match standalone headers
        line_clean = line.lower().strip(":# -")
        for sec_name, pattern in sections_patterns.items():
            if re.fullmatch(pattern, line_clean):
                section_indices.append((idx, sec_name))
                break

    parsed_sections: Dict[str, List[str]] = {
        "summary": [],
        "experience": [],
        "education": [],
        "skills": [],
        "projects": [],
        "certifications": [],
        "other": []
    }

    if not section_indices:
        # No clear standard headers found, keep as raw lines
        parsed_sections["other"] = lines
    else:
        # Collect lines under each section
        for i in range(len(section_indices)):
            start_idx, sec_name = section_indices[i]
            end_idx = section_indices[i + 1][0] if i + 1 < len(section_indices) else len(lines)
            content_lines = lines[start_idx + 1 : end_idx]
            parsed_sections[sec_name].extend(content_lines)

    # Extract skill tokens from the skills section or whole text
    skills_content = "\n".join(parsed_sections["skills"])
    extracted_skills = []
    if skills_content:
        # Split by commas, bullets, pipes, or newlines
        raw_tokens = re.split(r"[,•|;\n/]", skills_content)
        extracted_skills = [t.strip() for t in raw_tokens if t.strip() and len(t.strip()) < 40]

    return {
        "candidate_name": candidate_name,
        "contact_info": {
            "email": email_match.group(0) if email_match else "Not clearly mentioned in the resume",
            "phone": phone_match.group(0) if phone_match else "Not clearly mentioned in the resume",
            "linkedin": linkedin_match.group(0) if linkedin_match else "Not clearly mentioned in the resume",
            "github": github_match.group(0) if github_match else "Not clearly mentioned in the resume",
        },
        "summary": "\n".join(parsed_sections["summary"]) if parsed_sections["summary"] else "Not clearly mentioned in the resume",
        "work_experience": parsed_sections["experience"],
        "education": parsed_sections["education"],
        "skills": extracted_skills if extracted_skills else (["See raw text"] if cleaned else []),
        "projects": parsed_sections["projects"],
        "certifications": parsed_sections["certifications"],
        "raw_text": cleaned
    }
