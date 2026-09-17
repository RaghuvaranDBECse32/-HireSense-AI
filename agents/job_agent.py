"""Job Description Analysis Agent for HireSense AI.
Strictly parses requirements from the JD text without inventing requirements.
"""

from typing import Dict, Any, Optional
from llm.client import call_llm
from config.system_prompts import ANTI_GRAVITY_PROMPT, JOB_ANALYSIS_PROMPT
from utils.text import extract_json

def analyze_job(
    jd_text: str,
    system_prompt: str = ANTI_GRAVITY_PROMPT,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Extract structured requirements from JD text adhering strictly to Anti-Gravity rules."""
    user_prompt = JOB_ANALYSIS_PROMPT.replace("{jd_text}", jd_text)
    raw_response = call_llm(system_prompt=system_prompt, user_prompt=user_prompt, api_key=api_key)
    parsed = extract_json(raw_response)
    
    # Ensure minimum schema
    return {
        "job_title": parsed.get("job_title", "Role Not Specified"),
        "required_skills": parsed.get("required_skills", []),
        "preferred_skills": parsed.get("preferred_skills", []),
        "experience_required": parsed.get("experience_required", "Not specified"),
        "education_required": parsed.get("education_required", "Not specified"),
        "key_responsibilities": parsed.get("key_responsibilities", []),
        "raw_text": jd_text
    }
