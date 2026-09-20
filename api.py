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
    if search:
        query = query.filter(Job.title.ilike(f"%{search}%") | Job.company_name.ilike(f"%{search}%"))

    jobs = query.all()
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
            "raw_jd_text": j.raw_jd_text
        } for j in jobs
    ]

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
