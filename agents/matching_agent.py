"""Matching Agent for HireSense AI.
Evaluates candidate alignment with JD, generating evidence-based match scores,
strengths with citations, and verifiable concerns.
"""

import json
from typing import Dict, Any, Optional
from llm.client import call_llm
from config.system_prompts import ANTI_GRAVITY_PROMPT, MATCH_PROMPT_TEMPLATE
from utils.text import extract_json

def match_candidate_to_job(
    candidate: Dict[str, Any],
    job: Dict[str, Any],
    system_prompt: str = ANTI_GRAVITY_PROMPT,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Compare candidate against job profile, providing grounded score and citations."""
    user_prompt = MATCH_PROMPT_TEMPLATE.replace(
        "{candidate_json}", json.dumps(candidate, indent=2)
    ).replace(
        "{job_json}", json.dumps(job, indent=2)
    )
    raw_response = call_llm(system_prompt=system_prompt, user_prompt=user_prompt, api_key=api_key)
    parsed = extract_json(raw_response)
    
    score = parsed.get("match_score", 50)
    try:
        score = int(score)
    except Exception:
        score = 50

    return {
        "match_score": max(0, min(100, score)),
        "confidence_level": parsed.get("confidence_level", "Medium"),
        "strengths": parsed.get("strengths", []),
        "concerns": parsed.get("concerns", []),
        "explanation": parsed.get("explanation", "Match computed strictly from explicit resume and job description entries.")
    }
