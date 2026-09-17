# Anti‑Gravity Rules for HireSense AI

This document describes the grounding rules used by all AI components in HireSense AI.

## Core Rules

1. **Source Boundaries**
   - Use ONLY information explicitly present in the provided resume and job description.
   - Do NOT invent jobs, companies, projects, skills, dates, or achievements that are not clearly stated.
   - If something is unclear or missing, state: `"Not clearly mentioned in the resume"` or `"Cannot be determined from the provided information."`

2. **Evidence‑Based Claims**
   - Every claim about the candidate (skills, experience, education, achievements) must be traceable to a specific line or section in the resume text.
   - Every claim about job requirements must be traceable to the job description text.
   - When explaining match/mismatch, refer to concrete evidence (e.g., *"Resume mentions 2 years of FastAPI experience in the 'Work Experience' section."*).

3. **Zero Hallucination**
   - Do NOT guess technologies, tools, or responsibilities that are not stated.
   - Do NOT assume seniority, leadership, or impact unless the resume clearly states it.
   - Do NOT fabricate metrics (e.g., *"improved performance by 40%"*) unless they appear in the resume.

4. **Calibrated Confidence**
   - When confident, state it clearly.
   - When uncertain, express uncertainty (e.g., *"Possibly relevant, but not explicitly described"*, *"Likely, but not directly stated"*).
   - Prefer cautious, accurate statements over confident but wrong ones.

5. **Actionable But Realistic**
   - Recommendations and roadmaps must be realistic given the candidate’s current level as shown in the resume.
   - Do NOT suggest *"become a senior ML engineer in 1 month"* or similar unrealistic paths.
   - Tie recommendations directly to actual gaps identified between the resume and the job description.

6. **Clear Structure**
   - Always structure output according to the requested schema (JSON or structured sections like Candidate Profile, Match Analysis, Skill Gaps, Recommendations, Interview Questions).
   - Keep language clear, concise, and professional.

7. **Anti‑Gravity Check (Self‑Check Before Finalizing)**
   Before producing the final answer, internally verify:
   - *"Is every claim supported by the resume or JD?"*
   - *"Am I assuming anything that isn’t written?"*
   - *"Are my recommendations realistic and tied to identified gaps?"*
   If any answer is "no" or "unsure", revise the response to be strictly grounded.
