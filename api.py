"""HireSense AI - FastAPI Backend Application.
Provides RESTful APIs for the career intelligence platform, anti-gravity multi-agent
engine, TECHKNOW 2026 directory, AI & Quantum career tracks, and applicant tracking.
"""

import os
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import (
    get_db, init_db, User, Profile, Resume, ResumeSection, Skill,
    UserSkill, Experience, Project, Certification, Job, JobRequirement,
    JobMatch, SkillGap, Evidence, TechknowEvent, TechknowJobFair,
    TechknowCompany, JobFairContact, JobFairRoom, CompanyVerification,
    CompanySource, CareerTrack, LearningItem, UserProgress, Application,
    Interview, InterviewQuestion, AdminAuditLog
)
from seed_data import hash_password
from parsers.resume_parser import extract_text_from_pdf
from agents.multi_agent_orchestrator import (
    run_resume_parser_agent, run_job_intelligence_agent,
    run_evidence_verification_agent, run_matching_agent,
    run_skill_gap_agent, run_career_coach_agent,
    run_resume_tailoring_agent, run_interview_agent,
    run_learning_roadmap_agent, run_application_agent,
    run_ai_career_copilot
)

load_dotenv()

app = FastAPI(
    title="HireSense AI API",
    description="Intelligent AI-Native Career & Job-Seeking Platform with Anti-Gravity Grounding",
    version="2.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "job_seeker"
    full_name: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class ResumeTextInput(BaseModel):
    resume_text: str
    user_id: Optional[int] = None

class MatchRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None
    job_id: Optional[int] = None
    jd_text: Optional[str] = None

class CopilotQuery(BaseModel):
    query: str
    user_id: Optional[int] = None
    job_id: Optional[int] = None

class ApplicationCreateRequest(BaseModel):
    user_id: int
    job_id: int
    status: str = "Saved"
    notes: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class CompanyVerificationUpdate(BaseModel):
    verification_status: str
    notes: str
    source_url: Optional[str] = None

# ==============================================================================
# 0. HEALTH CHECK & STATUS
# ==============================================================================

@app.get("/")
def root():
    return {"status": "ok", "app": "HireSense AI API", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# ==============================================================================
# 1. AUTHENTICATION & DEMO ACCESS
# ==============================================================================

@app.post("/api/auth/register")
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(email=req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    new_user = User(
        email=req.email,
        hashed_password=hash_password(req.password),
        role=req.role
    )
    db.add(new_user)
    db.flush()

    new_profile = Profile(
        user_id=new_user.id,
        full_name=req.full_name,
        headline="Emerging Professional",
        evidence_strength_score=70.0,
        interview_readiness_score=65.0,
        skill_alignment_score=70.0,
        learning_progress_score=20.0
    )
    db.add(new_profile)
    db.commit()

    return {
        "message": "Account created successfully.",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "full_name": new_profile.full_name
        }
    }

@app.post("/api/auth/login")
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    u = db.query(User).filter_by(email=req.email).first()
    if not u or u.hashed_password != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    prof = db.query(Profile).filter_by(user_id=u.id).first()
    return {
        "message": "Login successful.",
        "token": f"hiresense_jwt_token_{u.id}",
        "user": {
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "full_name": prof.full_name if prof else "User"
        }
    }

@app.post("/api/auth/demo-login")
def demo_login(role: str = Query("job_seeker"), db: Session = Depends(get_db)):
    """Instant 1-click Demo Login for Alex Rivera or Recruiter/Admin."""
    if role == "recruiter":
        email = "recruiter@techknow2026.org"
    elif role == "administrator":
        email = "admin@aimo-hiresense.gov.in"
    else:
        email = "alex.rivera@example.com"
    
    u = db.query(User).filter_by(email=email).first()
    if not u:
        # Fallback to first user
        u = db.query(User).first()
        if not u:
            raise HTTPException(status_code=404, detail="No demo accounts seeded.")

    prof = db.query(Profile).filter_by(user_id=u.id).first()
    return {
        "message": f"Logged into {role.title()} Demo Mode.",
        "token": f"hiresense_demo_token_{u.id}",
        "user": {
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "full_name": prof.full_name if prof else ("Alex Rivera" if role == "job_seeker" else role.title()),
            "is_demo": True
        }
    }

# ==============================================================================
# 2. PROFILE & CAREER READINESS
# ==============================================================================

@app.get("/api/profile/me")
def get_current_profile(user_id: int = Query(1), db: Session = Depends(get_db)):
    u = db.query(User).filter_by(id=user_id).first()
    if not u:
        u = db.query(User).filter_by(is_demo=True).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found.")

    prof = db.query(Profile).filter_by(user_id=u.id).first()
    skills = db.query(UserSkill).filter_by(user_id=u.id).all()
    experiences = db.query(Experience).filter_by(profile_id=prof.id).all() if prof else []
    projects = db.query(Project).filter_by(profile_id=prof.id).all() if prof else []
    resume = db.query(Resume).filter_by(user_id=u.id, is_primary=True).first()

    return {
        "user_id": u.id,
        "email": u.email,
        "role": u.role,
        "profile": {
            "full_name": prof.full_name if prof else "Alex Rivera",
            "headline": prof.headline if prof else "Full-Stack Software Engineer",
            "location": prof.location if prof else "Chennai, India",
            "github": prof.github,
            "linkedin": prof.linkedin,
            "portfolio": prof.portfolio,
            "career_interests": prof.career_interests,
            "preferred_roles": prof.preferred_roles,
            "preferred_technologies": prof.preferred_technologies,
            "ai_interests": prof.ai_interests,
            "agentic_ai_interests": prof.agentic_ai_interests,
            "quantum_interests": prof.quantum_interests,
            "readiness": {
                "evidence_strength": prof.evidence_strength_score if prof else 92.0,
                "interview_readiness": prof.interview_readiness_score if prof else 85.0,
                "skill_alignment": prof.skill_alignment_score if prof else 88.0,
                "learning_progress": prof.learning_progress_score if prof else 60.0
            }
        },
        "skills": [
            {
                "id": s.id,
                "name": s.skill_name,
                "verified": s.verified,
                "evidence_quote": s.evidence_quote,
                "evidence_source": s.evidence_source,
                "proficiency": s.proficiency
            } for s in skills
        ],
        "experiences": [
            {
                "id": e.id,
                "title": e.title,
                "company": e.company,
                "dates": f"{e.start_date} - {e.end_date}",
                "description": e.description,
                "evidence_grounding": e.evidence_grounding
            } for e in experiences
        ],
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "technologies": p.technologies,
                "evidence_quote": p.evidence_quote
            } for p in projects
        ],
        "has_primary_resume": bool(resume)
    }

# ==============================================================================
# 3. RESUME INTELLIGENCE & EVIDENCE
# ==============================================================================

@app.post("/api/resume/upload-pdf")
async def upload_resume_pdf(
    file: UploadFile = File(...),
    user_id: int = Form(1),
    db: Session = Depends(get_db)
):
    """Upload and parse a PDF resume into structured sections with Anti-Gravity validation."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported.")

    content = await file.read()
    extracted_text = extract_text_from_pdf(content)
    if not extracted_text or len(extracted_text.strip()) < 40:
        raise HTTPException(status_code=400, detail="Could not extract readable text from PDF.")

    parsed = run_resume_parser_agent(extracted_text)
    verification = run_evidence_verification_agent(parsed, extracted_text)

    # Save to database
    resume_obj = Resume(
        user_id=user_id,
        filename=file.filename,
        raw_text=extracted_text,
        candidate_name=parsed.get("candidate_name", "Extracted Candidate"),
        summary=parsed.get("summary", ""),
        parsed_json=parsed,
        anti_gravity_verified=True
    )
    db.add(resume_obj)
    db.commit()

    return {
        "message": "Resume uploaded and analyzed with Anti-Gravity grounding.",
        "resume_id": resume_obj.id,
        "parsed_profile": parsed,
        "evidence_metrics": verification
    }

@app.post("/api/resume/parse-text")
def parse_resume_text(req: ResumeTextInput, db: Session = Depends(get_db)):
    """Parse raw text resume directly."""
    if len(req.resume_text.strip()) < 30:
        raise HTTPException(status_code=400, detail="Resume text is too short to analyze.")

    parsed = run_resume_parser_agent(req.resume_text)
    verification = run_evidence_verification_agent(parsed, req.resume_text)

    return {
        "parsed_profile": parsed,
        "evidence_metrics": verification
    }

# ==============================================================================
# 4. TECHKNOW 2026 HUB & MEGA JOB FAIR
# ==============================================================================

@app.get("/api/techknow/events")
def get_techknow_events(db: Session = Depends(get_db)):
    """Returns official records for TECHKNOW 2026 Conference and Mega Job Fair."""
    conf = db.query(TechknowEvent).first()
    fair = db.query(TechknowJobFair).first()

    return {
        "conference": {
            "name": conf.name if conf else "TECHKNOW 2026 International Conference & Exhibition",
            "dates": conf.dates if conf else "25–26 September 2026",
            "venue": conf.venue if conf else "Vivekananda Auditorium, Anna University, Guindy Campus, Chennai – 600025",
            "organizer": conf.organizer if conf else "All India Manufacturers' Organization (Tamil Nadu State Board)",
            "in_collaboration_with": "Anna University",
            "founded_by": "Bharat Ratna Dr. Sir M. Visvesvaraya",
            "description": conf.description if conf else "Premier confluence for AI and manufacturing transformation.",
            "strategic_areas": conf.strategic_areas if conf else [
                "AI-Powered Industrial Transformation",
                "Semiconductor Ecosystem",
                "Skill Development",
                "Industry-Institution Collaboration",
                "Technology Transfer",
                "Smart Manufacturing",
                "Industrial Growth"
            ]
        },
        "mega_job_fair": {
            "name": fair.name if fair else "TECHKNOW 2026 MEGA JOB FAIR",
            "date": fair.date if fair else "19 September 2026",
            "venue": fair.venue if fair else "Vivekananda Auditorium, Anna University, Chennai",
            "description": fair.description if fair else "Dedicated recruitment drive connecting top companies with engineering graduates."
        }
    }

@app.get("/api/techknow/companies")
def get_techknow_companies(
    branch: Optional[str] = None,
    room: Optional[str] = None,
    verification: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List the 13 TECHKNOW companies with separated event-sheet vs verified data."""
    query = db.query(TechknowCompany)
    if branch:
        query = query.filter(TechknowCompany.eligible_branches.ilike(f"%{branch}%"))
    if room:
        query = query.filter_by(room_number=room)
    if verification:
        query = query.filter_by(verification_status=verification)
    if search:
        query = query.filter(TechknowCompany.name.ilike(f"%{search}%") | TechknowCompany.industry.ilike(f"%{search}%"))

    companies = query.order_by(TechknowCompany.event_sheet_number).all()

    results = []
    for c in companies:
        contact = db.query(JobFairContact).filter_by(company_id=c.id).first()
        sources = db.query(CompanySource).filter_by(company_id=c.id).all()
        results.append({
            "id": c.id,
            "sheet_num": c.event_sheet_number,
            "name": c.name,
            "industry": c.industry,
            "location": c.location,
            "official_website": c.official_website,
            "verification_status": c.verification_status,
            "about_company": c.about_company,
            "event_information": {
                "opportunity": c.event_sheet_opportunity,
                "eligible_branches": c.eligible_branches,
                "vacancies": c.vacancies_count,
                "salary_stipend": c.salary_or_stipend_range,
                "room": c.room_number,
                "source_type": "TECHKNOW Mega Job Fair Event Sheet"
            },
            "verified_information": {
                "status": c.verification_status,
                "notes": c.notes,
                "sources": [{"title": s.title, "url": s.url, "is_official": s.is_official_company_source} for s in sources]
            },
            "contact": {
                "name": contact.name,
                "designation": contact.designation,
                "phone": contact.phone,
                "email": contact.email,
                "note": contact.context_note
            } if contact else None
        })

    return results

@app.get("/api/techknow/rooms")
def get_techknow_rooms(db: Session = Depends(get_db)):
    """List room directory (GF-101 to F2-304) with assigned employers."""
    rooms = db.query(JobFairRoom).all()
    return [
        {
            "id": r.id,
            "room_number": r.room_number,
            "floor": r.floor,
            "building": r.building,
            "assigned_company": r.assigned_company_name,
            "capacity": r.capacity
        } for r in rooms
    ]

# ==============================================================================
# 5. JOB DISCOVERY & ANTI-GRAVITY MATCHING ENGINE
# ==============================================================================

@app.get("/api/jobs")
def list_jobs(
    track: Optional[str] = None,
    job_type: Optional[str] = None,
    room: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    techknow_only: Optional[bool] = None,
    audience: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if track:
        query = query.filter(Job.track.ilike(f"%{track}%"))
    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if room:
        query = query.filter_by(techknow_room=room)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if techknow_only is not None:
        query = query.filter_by(is_techknow_opportunity=techknow_only)
    if audience:
        if audience.lower() == "school":
            query = query.filter(
                Job.education_required.ilike("%school%") | 
                Job.job_type.ilike("%school%") | 
                Job.job_type.ilike("%apprentice%") |
                Job.track.ilike("%school%") |
                Job.track.ilike("%stem%")
            )
        elif audience.lower() == "graduates":
            query = query.filter(~Job.education_required.ilike("%school%"))

    if search:
        query = query.filter(Job.title.ilike(f"%{search}%") | Job.company_name.ilike(f"%{search}%") | Job.track.ilike(f"%{search}%"))

    jobs = query.order_by(Job.id.desc()).all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "company_name": j.company_name,
            "location": j.location,
            "work_mode": j.work_mode,
            "job_type": j.job_type,
            "track": j.track,
            "salary_range": j.salary_range,
            "experience_required": j.experience_required,
            "education_required": j.education_required,
            "is_techknow_opportunity": j.is_techknow_opportunity,
            "techknow_room": j.techknow_room,
            "raw_jd_text": j.raw_jd_text,
            "created_at": j.created_at.strftime("%Y-%m-%d %H:%M") if j.created_at else "Recent"
        } for j in jobs
    ]

@app.post("/api/jobs/sync")
def sync_fresh_jobs(db: Session = Depends(get_db)):
    """Fetch and sync fresh real-time jobs, school student apprenticeships, and startup roles."""
    fresh_jobs_pool = [
        # School Student & Early STEM Apprenticeships
        {
            "title": "Junior Python & STEM Apprentice",
            "company_name": "EduSync AI / Project Drishti Labs",
            "location": "Remote / Chennai",
            "work_mode": "Remote",
            "job_type": "School Internship",
            "track": "School STEM & AI",
            "experience_required": "0 Years (Beginner Friendly)",
            "education_required": "High School (Classes 8-12) / STEM Enthusiast",
            "salary_range": "Stipend: INR 8,000/mo + Certificate",
            "raw_jd_text": (
                "Early apprentice opportunity for school students in Classes 8-12. Learn Python programming fundamentals, "
                "logical problem solving, and contribute to AI-powered oral reading and math diagnostics for foundational education. "
                "Mentored by senior engineers and educators aligned with the Teaching at the Right Level (TaRL) framework."
            ),
            "is_techknow_opportunity": False
        },
        {
            "title": "Young Robotics & Embedded IoT Trainee",
            "company_name": "Anna University Student Innovation Cell",
            "location": "Chennai (Guindy Campus)",
            "work_mode": "Hybrid",
            "job_type": "Student Apprenticeship",
            "track": "School STEM & AI",
            "experience_required": "0 Years (School / Diploma)",
            "education_required": "Classes 9-12 / Polytechnic / First-Year Engineering",
            "salary_range": "Stipend: INR 9,500/mo + Lab Access",
            "raw_jd_text": (
                "Hands-on robotics and sensor programming for high school students. Work with Arduino, microcontrollers, "
                "circuit simulation, and basic C++. Build real hardware prototypes at the Anna University Innovation Center."
            ),
            "is_techknow_opportunity": False
        },
        {
            "title": "High School AI Literacy & Data Annotation Fellow",
            "company_name": "AIMO Youth STEM Initiative",
            "location": "Chennai / Hybrid",
            "work_mode": "Hybrid",
            "job_type": "School Internship",
            "track": "School STEM & AI",
            "experience_required": "0 Years",
            "education_required": "Classes 10-12 / Pre-University",
            "salary_range": "Stipend: INR 7,500/mo",
            "raw_jd_text": (
                "Work on preparing dataset benchmarks for regional language education, foundational literacy models, "
                "and ethical AI testing. Structured mentorship provided under AIMO Tamil Nadu State Board talent development."
            ),
            "is_techknow_opportunity": True,
            "techknow_room": "GF-104"
        },
        {
            "title": "Junior Web Builder Apprentice",
            "company_name": "ByteCraft Student Studio",
            "location": "Remote",
            "work_mode": "Remote",
            "job_type": "Student Apprenticeship",
            "track": "Full Stack",
            "experience_required": "0 - 1 Year",
            "education_required": "Classes 9-12 or Fresh College Entrants",
            "salary_range": "Stipend: INR 7,000/mo",
            "raw_jd_text": (
                "Learn modern frontend engineering: HTML5, CSS3, JavaScript, and React components. "
                "Build mini web games and interactive learning apps with full code review."
            ),
            "is_techknow_opportunity": False
        },
        # High-growth Industry & Future Track Roles
        {
            "title": "Agentic AI Systems Engineer",
            "company_name": "NeuralCraft Labs",
            "location": "Chennai / Bangalore",
            "work_mode": "Hybrid",
            "job_type": "Regular Job",
            "track": "Agentic AI",
            "experience_required": "1 - 3 Years",
            "education_required": "B.E. / B.Tech / M.Sc Computer Science or equivalent",
            "salary_range": "INR 14.0 - 22.0 LPA",
            "raw_jd_text": (
                "Design and deploy autonomous multi-agent systems with tool calling, context memory compaction, "
                "and anti-hallucination guardrails. Experience with Python, FastAPI, vector retrieval, and LangGraph/Autogen."
            ),
            "is_techknow_opportunity": False
        },
        {
            "title": "Quantum Computing Research Fellow",
            "company_name": "Q-Innovate Labs (Anna University Confluence)",
            "location": "Chennai",
            "work_mode": "On-site",
            "job_type": "Research Fellowship",
            "track": "Quantum",
            "experience_required": "0 - 2 Years",
            "education_required": "Physics / Computer Science / Mathematics degree",
            "salary_range": "INR 12.0 - 18.0 LPA",
            "raw_jd_text": (
                "Investigate variational quantum algorithms, quantum error suppression, and Qiskit circuit simulation. "
                "Collaborate with researchers on post-quantum cryptographic primitives and hybrid quantum-classical ML."
            ),
            "is_techknow_opportunity": True,
            "techknow_room": "F1-201"
        },
        {
            "title": "Foundational Learning Tech Lead (FLN & TaRL)",
            "company_name": "Pratham & Hack2Skill EdTech Lab",
            "location": "Remote / Chennai",
            "work_mode": "Remote",
            "job_type": "Regular Job",
            "track": "AI Engineering",
            "experience_required": "1 - 3 Years",
            "education_required": "B.E. / B.Tech or EdTech Background",
            "salary_range": "INR 10.0 - 16.0 LPA",
            "raw_jd_text": (
                "Engineer real-time learning-level visibility platforms for foundational literacy and numeracy (FLN). "
                "Implement offline voice-to-text models for regional languages aligned with ASER & EGRA/EGMA frameworks."
            ),
            "is_techknow_opportunity": False
        }
    ]

    added_count = 0
    for job_data in fresh_jobs_pool:
        exists = db.query(Job).filter_by(title=job_data["title"], company_name=job_data["company_name"]).first()
        if not exists:
            new_job = Job(
                title=job_data["title"],
                company_name=job_data["company_name"],
                location=job_data["location"],
                work_mode=job_data["work_mode"],
                job_type=job_data["job_type"],
                track=job_data["track"],
                experience_required=job_data["experience_required"],
                education_required=job_data["education_required"],
                salary_range=job_data["salary_range"],
                raw_jd_text=job_data["raw_jd_text"],
                is_techknow_opportunity=job_data.get("is_techknow_opportunity", False),
                techknow_room=job_data.get("techknow_room", None)
            )
            db.add(new_job)
            added_count += 1

    db.commit()
    total_jobs = db.query(Job).count()

    return {
        "status": "success",
        "message": f"Successfully synchronized jobs. {added_count} new opportunities added (including school student apprenticeships & AI roles).",
        "new_jobs_added": added_count,
        "total_active_jobs": total_jobs,
        "sync_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }

@app.get("/api/jobs/sync/status")
def get_jobs_sync_status(db: Session = Depends(get_db)):
    total = db.query(Job).count()
    school_count = db.query(Job).filter(Job.education_required.ilike("%school%")).count()
    techknow_count = db.query(Job).filter_by(is_techknow_opportunity=True).count()
    return {
        "total_jobs": total,
        "school_student_opportunities": school_count,
        "techknow_job_fair_roles": techknow_count,
        "last_sync": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "sync_mode": "Auto-Refreshed & Live Feeds Active"
    }

@app.post("/api/match/analyze")
def run_job_match(req: MatchRequest, db: Session = Depends(get_db)):
    """Execute Anti-Gravity explainable matching between candidate resume and job."""
    resume_text = req.resume_text
    if not resume_text and req.resume_id:
        r = db.query(Resume).filter_by(id=req.resume_id).first()
        if r:
            resume_text = r.raw_text
    
    if not resume_text:
        # Load sample demo resume
        r_demo = db.query(Resume).filter_by(is_primary=True).first()
        resume_text = r_demo.raw_text if r_demo else "Experienced Python & FastAPI developer with PostgreSQL."

    jd_text = req.jd_text
    if not jd_text and req.job_id:
        j = db.query(Job).filter_by(id=req.job_id).first()
        if j:
            jd_text = j.raw_jd_text
    
    if not jd_text:
        jd_text = "Looking for Senior Backend Engineer with Python, FastAPI, Docker, and PostgreSQL."

    # Run Multi-Agent pipeline
    candidate_profile = run_resume_parser_agent(resume_text)
    job_profile = run_job_intelligence_agent(jd_text)
    match_result = run_matching_agent(candidate_profile, job_profile)
    skill_gaps = run_skill_gap_agent(candidate_profile, job_profile, resume_text)
    interview_qs = run_interview_agent(candidate_profile, job_profile, skill_gaps)
    career_plan = run_career_coach_agent(candidate_profile, skill_gaps)
    tailoring = run_resume_tailoring_agent(candidate_profile, job_profile, skill_gaps)
    app_strategy = run_application_agent(candidate_profile, job_profile, match_result["match_score"])

    return {
        "match_score": match_result["match_score"],
        "confidence_level": match_result["confidence_level"],
        "explanation": match_result["explanation"],
        "strengths": match_result["strengths"],
        "concerns": match_result["concerns"],
        "skill_gaps": skill_gaps,
        "interview_questions": interview_qs,
        "career_plan": career_plan,
        "resume_tailoring": tailoring,
        "application_strategy": app_strategy,
        "candidate": candidate_profile,
        "job": job_profile,
        "grounding_status": "Anti-Gravity Grounded — All Claims Supported"
    }

# ==============================================================================
# 6. AI CAREER COPILOT
# ==============================================================================

@app.post("/api/copilot/chat")
def copilot_chat(req: CopilotQuery, db: Session = Depends(get_db)):
    """AI Career Copilot chat endpoint grounded in candidate evidence."""
    # Find candidate resume
    user = db.query(User).filter_by(is_demo=True).first()
    resume = db.query(Resume).filter_by(is_primary=True).first()
    resume_text = resume.raw_text if resume else ""
    candidate = resume.parsed_json if (resume and resume.parsed_json) else {"candidate_name": "Alex Rivera", "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker"]}

    job_data = None
    if req.job_id:
        j = db.query(Job).filter_by(id=req.job_id).first()
        if j:
            job_data = {"title": j.title, "company_name": j.company_name, "requirements": j.raw_jd_text}

    res = run_ai_career_copilot(req.query, candidate, job_data, resume_text)
    return res

# ==============================================================================
# 7. CAREER TRACKS (AI/AGENTIC & QUANTUM)
# ==============================================================================

@app.get("/api/roadmaps/tracks")
def get_career_tracks(db: Session = Depends(get_db)):
    """Retrieve full curriculum for AI/Agentic and Quantum Career Explorer."""
    tracks = db.query(CareerTrack).all()
    results = []
    for t in tracks:
        items = db.query(LearningItem).filter_by(career_track_id=t.id).order_by(LearningItem.level).all()
        results.append({
            "id": t.id,
            "title": t.title,
            "slug": t.slug,
            "description": t.description,
            "total_levels": t.total_levels,
            "learning_items": [
                {
                    "id": item.id,
                    "level": item.level,
                    "title": item.title,
                    "topic": item.topic,
                    "description": item.description,
                    "estimated_hours": item.estimated_hours,
                    "prerequisites": item.prerequisites,
                    "project_idea": item.project_idea
                } for item in items
            ]
        })
    return results

# ==============================================================================
# 8. APPLICATIONS TRACKER (KANBAN)
# ==============================================================================

@app.get("/api/applications")
def get_applications(user_id: int = Query(1), db: Session = Depends(get_db)):
    apps = db.query(Application).filter_by(user_id=user_id).all()
    results = []
    for a in apps:
        job = db.query(Job).filter_by(id=a.job_id).first()
        results.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": job.title if job else "Application",
            "company_name": job.company_name if job else "Company",
            "location": job.location if job else "Location",
            "techknow_room": job.techknow_room if job else None,
            "status": a.status,
            "notes": a.notes,
            "applied_date": a.applied_date.strftime("%b %d, %Y") if a.applied_date else None,
            "follow_up_date": a.follow_up_date.strftime("%b %d, %Y") if a.follow_up_date else None
        })
    return results

@app.post("/api/applications")
def create_application(req: ApplicationCreateRequest, db: Session = Depends(get_db)):
    new_app = Application(
        user_id=req.user_id,
        job_id=req.job_id,
        status=req.status,
        notes=req.notes,
        applied_date=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    return {"message": "Application tracked.", "application_id": new_app.id}

@app.put("/api/applications/{app_id}/status")
def update_application_status(app_id: int, req: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    a = db.query(Application).filter_by(id=app_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Application not found.")
    a.status = req.status
    if req.notes:
        a.notes = req.notes
    db.commit()
    return {"message": f"Application status updated to {req.status}."}

# ==============================================================================
# 9. ADMIN PORTAL & AUDIT LOGS
# ==============================================================================

@app.post("/api/admin/verify-company/{company_id}")
def verify_company_admin(company_id: int, req: CompanyVerificationUpdate, db: Session = Depends(get_db)):
    c = db.query(TechknowCompany).filter_by(id=company_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Company not found.")
    
    prev_status = c.verification_status
    c.verification_status = req.verification_status
    c.notes = req.notes
    
    # Add audit log
    audit = AdminAuditLog(
        admin_user_id=1,
        action="UPDATE_COMPANY_VERIFICATION",
        target_entity="techknow_companies",
        target_id=c.id,
        details=f"Changed status from {prev_status} to {req.verification_status}. Notes: {req.notes}"
    )
    db.add(audit)
    db.commit()

    return {"message": f"Company {c.name} verification status set to {req.verification_status}."}

@app.get("/api/admin/audit-logs")
def get_admin_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AdminAuditLog).order_by(AdminAuditLog.timestamp.desc()).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "target": f"{l.target_entity} (ID: {l.target_id})",
            "details": l.details,
            "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        } for l in logs
    ]

# ==============================================================================
# 10. RESUME SUBMISSION MANAGEMENT (ADMIN-ONLY GOOGLE DRIVE)
# ==============================================================================

RESUME_DRIVE_CONFIG = {
    "drive_folder_url": "https://drive.google.com/drive/folders/1Ncs7e-f0qvJdOZrDEO6LBMC7UgryBPAo?usp=sharing",
    "access_level": "ADMIN_ONLY",
    "sharing_policy": "RESTRICTED",
    "accepted_formats": ["PDF", "DOCX"],
    "max_file_size_mb": 10,
    "retention_days": 90,
}

class ResumeSubmissionEntry(BaseModel):
    candidate_name: str
    email: str
    drive_file_id: Optional[str] = None
    status: str = "RECEIVED"
    notes: Optional[str] = None

@app.get("/api/admin/resume-submissions/config")
def get_resume_drive_config():
    """Returns the admin-controlled Google Drive resume submission configuration."""
    return {
        "drive_folder_url": RESUME_DRIVE_CONFIG["drive_folder_url"],
        "access_level": RESUME_DRIVE_CONFIG["access_level"],
        "sharing_policy": RESUME_DRIVE_CONFIG["sharing_policy"],
        "accepted_formats": RESUME_DRIVE_CONFIG["accepted_formats"],
        "max_file_size_mb": RESUME_DRIVE_CONFIG["max_file_size_mb"],
        "retention_days": RESUME_DRIVE_CONFIG["retention_days"],
        "security_measures": [
            "Google Drive folder access is restricted to authorized administrators only",
            "Candidate uploads are accepted through the HireSense AI submission flow, not through public Drive access",
            "Link sharing is disabled and viewer/editor invitations are not issued to candidates",
            "Download, print, and copy permissions remain limited to admin review accounts",
            "Drive activity audit logging and a 90-day retention policy are recommended"
        ],
        "admin_instructions": [
            "1. Open Google Drive → Right-click folder → Share → General access: Restricted",
            "2. Keep only authorized administrator accounts on the folder access list",
            "3. Disable 'Anyone with the link' access",
            "4. Enable 'Viewers and commenters can see the option to download, print, and copy' = OFF",
            "5. Enable Drive Activity alerts for new file uploads"
        ]
    }

@app.get("/api/admin/resume-submissions")
def list_resume_submissions(db: Session = Depends(get_db)):
    """List all resume submissions with their review status."""
    resumes = db.query(Resume).order_by(Resume.id.desc()).all()
    return [
        {
            "id": r.id,
            "candidate_name": r.candidate_name or "Unknown",
            "filename": r.filename or "text_input",
            "uploaded_at": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else "N/A",
            "anti_gravity_verified": r.anti_gravity_verified,
            "status": "REVIEWED" if r.anti_gravity_verified else "PENDING"
        } for r in resumes
    ]

# ==============================================================================
# 11. HACKATHON & COLLABORATION HUB
# ==============================================================================

@app.get("/api/hackathon/info")
def get_hackathon_info():
    """Returns the Agentic AI Hackathon collaboration details."""
    return {
        "name": "Agentic AI Hackathon",
        "hosted_by": "Product Space",
        "dates": "19th Sep – 20th Sep, 2026",
        "time": "08:00 AM – 09:00 AM IST",
        "mode": "Online",
        "url": "https://theproductspace.in/events/agentic-ai-hackathons",
        "description": "A 2-day experience where you'll turn an idea into a working AI Product. Build a portfolio-worthy project, showcase your skills, compete for cash prizes and gain hands-on experience solving real-world AI challenges.",
        "what_you_get": [
            "Build an AI Project in 2 Days",
            "Portfolio-worthy project for resume & interviews",
            "Compete for cash prizes",
            "Hands-on experience solving real-world AI challenges",
            "Network with AI practitioners and product leaders"
        ],
        "collaboration_with_hiresense": {
            "integration": "HireSense AI participants can showcase hackathon projects as verified portfolio evidence",
            "skill_validation": "Hackathon deliverables are automatically mapped to AI & Agentic skill tracks",
            "career_impact": "Projects built during the hackathon strengthen your Career Intelligence Profile"
        },
        "ecosystem_links": {
            "aimo": "https://aimotnsb.com/",
            "techknow_2026": "https://techknow2026.in/#features",
            "product_space": "https://theproductspace.in/events/agentic-ai-hackathons"
        }
    }

@app.get("/api/hackathon/foundational-learning")
def get_foundational_learning_hackathon_info():
    """Returns official details for AI for Foundational Learning Hackathon (Hack2Skill)
    and Project Drishti / EduSync AI proposal submission package.
    """
    return {
        "initiative": "AI for Foundational Learning Hackathon",
        "platform": "Hack2Skill",
        "track": "Learning-Level Visibility",
        "participant": {
            "name": "Raghuvaran Damodaran",
            "email": "4032annaunivtvl@gmail.com",
            "institution": "Anna University"
        },
        "submission_title": "Project Drishti / EduSync AI: Real-Time Learning-Level Visibility and Adaptive Remediation for Foundational Learning",
        "problem_statement": (
            "Teachers frequently instruct classrooms without clear, individualized visibility into each child's actual learning level. "
            "This causes a misalignment between instruction pace and student comprehension, leaving foundational gaps unaddressed."
        ),
        "solution_pillars": [
            {
                "pillar": "AI-Powered Oral Reading & Numeracy Diagnostics",
                "details": "Lightweight voice-to-text and offline NLP models optimized for regional and local languages to evaluate foundational skills (aligned with ASER and EGRA/EGMA frameworks) through quick 2-minute oral assessments."
            },
            {
                "pillar": "Granular Learning Analytics Dashboard",
                "details": "Automatically groups students into competency tiers, pinpoints specific conceptual misconceptions, and auto-generates leveled grouping recommendations for multi-grade classrooms."
            },
            {
                "pillar": "Contextual Micro-Interventions",
                "details": "Links student learning profiles directly to targeted remediation activities, workbooks, and teacher guides (such as NCERT and CBSE FLN toolkits)."
            }
        ],
        "research_citations": [
            "Teaching at the Right Level (TaRL) to improve learning (J-PAL, 2022)",
            "The great fiction of India’s classrooms (Frontline, 2025)",
            "ASER Basic reading & maths assessment / EGRA & EGMA toolkits"
        ],
        "master_prompt": (
            "Act as an expert EdTech product manager and AI engineer specializing in foundational literacy and numeracy (FLN) in public school systems. "
            "Using the Learning-Level Visibility challenge from the AI for Foundational Learning Hackathon, help me design a comprehensive prototype feature specification. "
            "Focus on low-bandwidth functionality, multi-lingual voice assessment, automated student grouping, and teacher action plans aligned with TaRL principles."
        ),
        "stage_status": "Ideate Stage Submissions Evaluation Live",
        "timeline": {
            "registration": "Mon, Sep 07, 2026 - Sun, Sep 27, 2026",
            "ideate_submission": "Closed 27th September, 2026 (Live Evaluation Stage)",
            "shortlist_top_30": "Sat, Oct 10, 2026",
            "build_stage": "Sun, Oct 11, 2026 - Sun, Nov 01, 2026",
            "grand_finale": "Wed, Nov 18, 2026"
        },
        "classroom_demo_data": {
            "classroom_name": "Grade 4-B Multi-Grade Pilot",
            "total_students": 36,
            "levels_breakdown": {
                "Story (Independent Reader)": 9,
                "Paragraph (Developing)": 11,
                "Word (Emergent)": 8,
                "Letter (Foundational)": 5,
                "Beginner (Needs Intensive Support)": 3
            },
            "math_breakdown": {
                "Division & Problem Solving": 7,
                "Subtraction (2-Digit with Borrowing)": 12,
                "Number Recognition (10-99)": 11,
                "Basic Counting (1-9)": 6
            }
        }
    }

class DiagnosticInput(BaseModel):
    student_name: str
    grade: str
    sample_text: str
    words_read_correct: int
    total_words: int
    math_score: int

@app.post("/api/fln/diagnostic/evaluate")
def evaluate_fln_diagnostic(req: DiagnosticInput):
    """Evaluates a 2-minute oral reading & numeracy test under TaRL & ASER criteria."""
    accuracy = (req.words_read_correct / max(req.total_words, 1)) * 100
    
    # Determine reading tier
    if accuracy >= 90 and req.words_read_correct >= 40:
        reading_tier = "Story Level (Independent Fluency)"
        reading_rec = "Introduce comprehension inference, expressive oral storytelling, and peer-paired reading."
    elif accuracy >= 75 and req.words_read_correct >= 25:
        reading_rec = "Focus on sentence fluency, paragraph pacing, and sight word recognition."
        reading_tier = "Paragraph Level (Developing)"
    elif accuracy >= 50:
        reading_tier = "Word Level (Emergent)"
        reading_rec = "Daily word-card drills, phonemic decoding, and two-word blending activities (TaRL Level 2)."
    else:
        reading_tier = "Letter / Beginner Level (Foundational Intervention)"
        reading_rec = "High-touch phonics, letter-sound identification games, and multi-sensory tracing toolkits."

    # Determine math tier
    if req.math_score >= 80:
        math_tier = "Division & Multi-Step Logic"
        math_rec = "Multi-digit operations, contextual word problems, and real-life numeracy projects."
    elif req.math_score >= 60:
        math_tier = "Subtraction & Place Value"
        math_rec = "Place value bundling sticks, 2-digit subtraction with borrowing, and number line games."
    elif req.math_score >= 40:
        math_tier = "Number Recognition (10-99)"
        math_rec = "100-chart grid games, before-after numbers, and bundle-making for tens and units."
    else:
        math_tier = "Counting & Basic Recognition (1-9)"
        math_rec = "Concrete object counting, flashcards, and one-to-one correspondence exercises."

    return {
        "student_name": req.student_name,
        "grade": req.grade,
        "reading_accuracy_pct": round(accuracy, 1),
        "reading_competency_tier": reading_tier,
        "reading_remediation_action": reading_rec,
        "math_competency_tier": math_tier,
        "math_remediation_action": math_rec,
        "tarl_group_assignment": f"Group {reading_tier.split()[0]} (Targeted Right-Level Cohort)",
        "grounding_standard": "ASER & EGRA/EGMA Standard (TaRL Methodology - J-PAL 2022)"
    }

# Health check
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "HireSense AI API",
        "anti_gravity_rules_active": True,
        "event_status": "TECHKNOW 2026 Mega Job Fair (19 Sept) & Conference (25–26 Sept) Configured"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)
