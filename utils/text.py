"""Text processing and parsing utilities for HireSense AI."""

import re
import json
from typing import Dict, Any, Optional

def clean_text(text: str) -> str:
    """Normalize whitespace and line endings."""
    if not text:
        return ""
    # Normalize unicode spaces and quotes
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract_json(response: str) -> Dict[str, Any]:
    """Robustly extract and parse JSON from LLM output, handling markdown codeblocks."""
    if not response:
        return {}
    
    clean = response.strip()
    # Check for markdown code blocks
    pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(pattern, clean, re.IGNORECASE)
    if match:
        clean = match.group(1).strip()
    
    # Try direct parse
    try:
        return json.loads(clean)
    except Exception:
        pass

    # Try finding the first '{' and last '}'
    start = clean.find("{")
    end = clean.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = clean[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            pass
            
    # Try finding array '[' and ']'
    start_arr = clean.find("[")
    end_arr = clean.rfind("]")
    if start_arr != -1 and end_arr != -1 and end_arr > start_arr:
        candidate = clean[start_arr : end_arr + 1]
        try:
            parsed = json.loads(candidate)
            return {"items": parsed}
        except Exception:
            pass

    return {"raw_text": response}
