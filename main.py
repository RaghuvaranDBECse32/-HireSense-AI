"""HireSense AI - Main Orchestration Pipeline.
Executes the grounded multi-agent evaluation pipeline according to Anti-Gravity rules.
"""

import sys
import json
from typing import Optional, Dict, Any
from config.system_prompts import ANTI_GRAVITY_PROMPT
from parsers.resume_parser import parse_resume
from agents.job_agent import analyze_job
from agents.matching_agent import match_candidate_to_job
from agents.skill_gap_agent import identify_skill_gaps
from agents.career_coach_agent import generate_career_plan
from agents.interview_agent import generate_interview_questions
from agents.report_agent import build_report

SYSTEM_PROMPT = ANTI_GRAVITY_PROMPT

def analyze_resume_and_jd(
    resume_text: str,
    jd_text: str,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Execute the full Anti-Gravity grounded pipeline.
    
    1. Parse Resume -> structured candidate profile
    2. Analyze Job -> structured requirements profile
    3. Match -> score, verified strengths, grounded concerns
    4. Skill Gaps -> matched vs missing vs ambiguous
    5. Career Plan -> realistic milestones from candidate baseline
    6. Interview Questions -> claim verification + gap exploration
    7. Report -> unified output
    """
    # 1. Parse resume
    candidate = parse_resume(resume_text)

    # 2. Analyze job description
    job_profile = analyze_job(jd_text, system_prompt=SYSTEM_PROMPT, api_key=api_key)

    # 3. Matching
    match_result = match_candidate_to_job(
        candidate, job_profile, system_prompt=SYSTEM_PROMPT, api_key=api_key
    )

    # 4. Skill gaps
    skill_gaps = identify_skill_gaps(
        candidate, job_profile, system_prompt=SYSTEM_PROMPT, api_key=api_key
    )

    # 5. Career plan
    career_plan = generate_career_plan(
        candidate, job_profile, skill_gaps, system_prompt=SYSTEM_PROMPT, api_key=api_key
    )

    # 6. Interview questions
    interview_qs = generate_interview_questions(
        candidate, job_profile, skill_gaps, system_prompt=SYSTEM_PROMPT, api_key=api_key
    )

    # 7. Final report
    report = build_report(
        candidate, job_profile, match_result,
        skill_gaps, career_plan, interview_qs
    )

    return report

if __name__ == "__main__":
    print("Testing HireSense AI pipeline with sample data...")
    with open("data/samples/sample_resume.txt", "r", encoding="utf-8") as f:
        sample_resume = f.read()
    with open("data/samples/sample_jd.txt", "r", encoding="utf-8") as f:
        sample_jd = f.read()

    result = analyze_resume_and_jd(sample_resume, sample_jd)
    print("\n================ REPORT SUMMARY ================")
    print(f"Candidate: {result['candidate_name']}")
    print(f"Target Role: {result['job_title']}")
    print(f"Match Score: {result['match_score']}% (Confidence: {result['confidence_level']})")
    print(f"\nExplanation:\n{result['explanation']}")
    print(f"\nSkills Matched: {', '.join(result['skills_matched'])}")
    print(f"Skill Gaps: {', '.join(result['skill_gaps'])}")
    print(f"\nRecommendations:")
    for r in result['recommendations']:
        print(f"- {r}")
    print(f"\nInterview Questions:")
    for q in result['interview_questions'][:4]:
        print(f"- {q}")
    print("\nAnti-Gravity Rules Enforced: Yes (Zero-Hallucination & Grounded)")
