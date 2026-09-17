"""Career Coach Agent for HireSense AI.
Generates realistic, grounded progression roadmaps without exaggerated timelines or claims.
"""

import json
from typing import Dict, Any, Optional
from llm.client import call_llm
from config.system_prompts import ANTI_GRAVITY_PROMPT, CAREER_COACH_PROMPT_TEMPLATE
from utils.text import extract_json

def generate_career_plan(
    candidate: Dict[str, Any],
    job: Dict[str, Any],
    gaps: Dict[str, Any],
    system_prompt: str = ANTI_GRAVITY_PROMPT,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Produce grounded career growth recommendations based on the candidate's current baseline."""
    user_prompt = CAREER_COACH_PROMPT_TEMPLATE.replace(
        "{candidate_json}", json.dumps(candidate, indent=2)
    ).replace(
        "{gaps_json}", json.dumps(gaps, indent=2)
    )
    raw_response = call_llm(system_prompt=system_prompt, user_prompt=user_prompt, api_key=api_key)
    parsed = extract_json(raw_response)
    
    return {
        "current_level_assessment": parsed.get("current_level_assessment", "Baseline determined strictly from verified resume points."),
        "recommendations": parsed.get("recommendations", []),
        "action_plan_steps": parsed.get("action_plan_steps", [])
    }
