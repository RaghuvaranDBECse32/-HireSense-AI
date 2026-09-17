"""Interview Agent for HireSense AI.
Generates claim-verification and gap-exploring interview questions.
"""

import json
from typing import Dict, Any, Optional
from llm.client import call_llm
from config.system_prompts import ANTI_GRAVITY_PROMPT, INTERVIEW_PROMPT_TEMPLATE
from utils.text import extract_json

def generate_interview_questions(
    candidate: Dict[str, Any],
    job: Dict[str, Any],
    gaps: Dict[str, Any],
    system_prompt: str = ANTI_GRAVITY_PROMPT,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Draft targeted questions to verify candidate claims and explore ambiguous gaps."""
    user_prompt = INTERVIEW_PROMPT_TEMPLATE.replace(
        "{candidate_json}", json.dumps(candidate, indent=2)
    ).replace(
        "{job_json}", json.dumps(job, indent=2)
    ).replace(
        "{gaps_json}", json.dumps(gaps, indent=2)
    )
    raw_response = call_llm(system_prompt=system_prompt, user_prompt=user_prompt, api_key=api_key)
    parsed = extract_json(raw_response)
    
    return {
        "verification_questions": parsed.get("verification_questions", []),
        "gap_exploration_questions": parsed.get("gap_exploration_questions", [])
    }
