"""Skill Gap Analysis Agent for HireSense AI.
Strictly identifies verified matches, missing requirements, and ambiguous items.
"""

import json
from typing import Dict, Any, Optional
from llm.client import call_llm
from config.system_prompts import ANTI_GRAVITY_PROMPT, SKILL_GAP_PROMPT_TEMPLATE
from utils.text import extract_json

def identify_skill_gaps(
    candidate: Dict[str, Any],
    job: Dict[str, Any],
    system_prompt: str = ANTI_GRAVITY_PROMPT,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Identify matched vs missing vs ambiguous competencies with evidence citations."""
    user_prompt = SKILL_GAP_PROMPT_TEMPLATE.replace(
        "{candidate_json}", json.dumps(candidate, indent=2)
    ).replace(
        "{job_json}", json.dumps(job, indent=2)
    )
    raw_response = call_llm(system_prompt=system_prompt, user_prompt=user_prompt, api_key=api_key)
    parsed = extract_json(raw_response)
    
    return {
        "skills_matched": parsed.get("skills_matched", []),
        "missing_skills": parsed.get("missing_skills", []),
        "ambiguous_skills": parsed.get("ambiguous_skills", [])
    }
