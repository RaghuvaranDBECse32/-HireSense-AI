"""HireSense AI Database Models and Connection Layer.
Supports PostgreSQL (via psycopg2/asyncpg or DATABASE_URL) with seamless local SQLite fallback.
Tables implement the complete specification with Foreign Keys and Indexes.
"""

import os
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, Boolean, Float,
    DateTime, ForeignKey, Index, JSON
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Default to local SQLite with absolute path inside data directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    db_path = os.path.join(data_dir, "hiresense.db")
    DATABASE_URL = f"sqlite:///{db_path}"

# SQLite specific connect_args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==============================================================================
# 1. CORE USER & PROFILE TABLES
# ==============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="job_seeker", index=True)  # job_seeker, recruiter, administrator
    is_demo = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    headline = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)
    career_interests = Column(Text, nullable=True)
    preferred_roles = Column(Text, nullable=True)
    preferred_technologies = Column(Text, nullable=True)
    ai_interests = Column(Text, nullable=True)
    agentic_ai_interests = Column(Text, nullable=True)
    quantum_interests = Column(Text, nullable=True)
    
    # Career Intelligence Profile Metrics
    evidence_strength_score = Column(Float, default=0.0) # 0.0 - 100.0
    interview_readiness_score = Column(Float, default=0.0)
    skill_alignment_score = Column(Float, default=0.0)
    learning_progress_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    experiences = relationship("Experience", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=False)
    is_primary = Column(Boolean, default=True)
    candidate_name = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(100), nullable=True)
    summary = Column(Text, nullable=True)
    parsed_json = Column(JSON, nullable=True)
    anti_gravity_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    sections = relationship("ResumeSection", back_populates="resume", cascade="all, delete-orphan")
    evidences = relationship("Evidence", back_populates="resume", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")


class ResumeSection(Base):
    __tablename__ = "resume_sections"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    section_name = Column(String(100), nullable=False) # Education, Experience, Skills, Projects, Certifications
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="sections")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=True) # Language, Framework, AI, Agentic, Quantum, Database, Cloud
    description = Column(Text, nullable=True)


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(150), nullable=False, index=True)
    verified = Column(Boolean, default=False)
    evidence_source = Column(String(255), nullable=True) # e.g. "Work Experience line 12", "TaskPulse Project"
    evidence_quote = Column(Text, nullable=True)
    proficiency = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced, Expert
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_skills")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    start_date = Column(String(100), nullable=True)
    end_date = Column(String(100), nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    evidence_grounding = Column(Text, nullable=True)

    profile = relationship("Profile", back_populates="experiences")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(Text, nullable=True)
    url = Column(String(255), nullable=True)
    evidence_quote = Column(Text, nullable=True)

    profile = relationship("Profile", back_populates="projects")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=True)
    issue_date = Column(String(100), nullable=True)
    credential_url = Column(String(255), nullable=True)

    profile = relationship("Profile", back_populates="certifications")


# ==============================================================================
# 2. JOBS & REQUIREMENTS
# ==============================================================================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    company_name = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=False, index=True)
    work_mode = Column(String(50), default="On-site") # On-site, Hybrid, Remote
    job_type = Column(String(50), default="Regular Job") # Regular Job, Internship, Apprenticeship-cum-Regular
    track = Column(String(100), default="Full Stack", index=True) # AI, Agentic AI, Quantum, Cloud, Frontend, Backend, etc.
    experience_required = Column(String(100), nullable=True)
    education_required = Column(String(100), nullable=True)
    salary_range = Column(String(100), nullable=True)
    stipend = Column(String(100), nullable=True)
    raw_jd_text = Column(Text, nullable=False)
    is_techknow_opportunity = Column(Boolean, default=False, index=True)
    techknow_room = Column(String(50), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    requirements = relationship("JobRequirement", back_populates="job", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class JobRequirement(Base):
    __tablename__ = "job_requirements"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    requirement_text = Column(Text, nullable=False)
    is_preferred = Column(Boolean, default=False)
    category = Column(String(100), nullable=True) # Technical Skill, Education, Experience, Soft Skill

    job = relationship("Job", back_populates="requirements")


# ==============================================================================
# 3. AI MATCHING, EVIDENCE & GAPS
# ==============================================================================

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_score = Column(Integer, nullable=False) # 0 - 100
    confidence_level = Column(String(50), default="High") # High, Medium, Low
    explanation = Column(Text, nullable=False)
    status = Column(String(50), default="Analyzed")
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="matches")
    job = relationship("Job", back_populates="matches")
    skill_gaps = relationship("SkillGap", back_populates="match", cascade="all, delete-orphan")
    evidences = relationship("Evidence", back_populates="match", cascade="all, delete-orphan")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("job_matches.id", ondelete="CASCADE"), nullable=False, index=True)
    requirement = Column(String(255), nullable=False)
    classification = Column(String(50), nullable=False, index=True) # MATCHED, MISSING, AMBIGUOUS
    candidate_evidence = Column(Text, nullable=False)
    evidence_source = Column(String(255), nullable=True)
    confidence = Column(String(50), default="High") # High, Medium, Low
    recommended_action = Column(Text, nullable=True)

    match = relationship("JobMatch", back_populates="skill_gaps")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    match_id = Column(Integer, ForeignKey("job_matches.id", ondelete="CASCADE"), nullable=True, index=True)
    claim_type = Column(String(100), nullable=False) # skill, experience, education, metric
    claim_text = Column(String(255), nullable=False)
    source_section = Column(String(100), nullable=False) # Experience, Education, Projects, Skills
    quote_text = Column(Text, nullable=False)
    confidence = Column(String(50), default="High")
    verified = Column(Boolean, default=True)

    resume = relationship("Resume", back_populates="evidences")
    match = relationship("JobMatch", back_populates="evidences")


class AiAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    analysis_type = Column(String(100), nullable=False) # copilot_chat, resume_audit, interview_prep
    query = Column(Text, nullable=True)
    response = Column(Text, nullable=False)
    grounded_evidence_citations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ==============================================================================
# 4. APPLICATIONS, INTERVIEWS & ROADMAPS
# ==============================================================================

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="Saved", index=True) # Saved, Analyzing, Applied, Assessment, Interview, Offer, Rejected
    notes = Column(Text, nullable=True)
    applied_date = Column(DateTime, nullable=True)
    follow_up_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    interview_date = Column(DateTime, nullable=True)
    round_name = Column(String(100), default="Technical Round 1")
    feedback = Column(Text, nullable=True)
    readiness_rating = Column(Float, default=0.0)

    application = relationship("Application", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="interview", cascade="all, delete-orphan")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), nullable=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True, index=True)
    category = Column(String(100), nullable=False) # Technical, Behavioral, Project, Role-specific, Claim-verification, Gap-exploration
    question_text = Column(Text, nullable=False)
    grounded_context = Column(Text, nullable=True) # Why this question is asked based on resume/JD
    suggested_answer_points = Column(Text, nullable=True)
    candidate_answer_draft = Column(Text, nullable=True)

    interview = relationship("Interview", back_populates="questions")


class CareerTrack(Base):
    __tablename__ = "career_tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), unique=True, nullable=False) # Frontend, Backend, Full Stack, AI Engineering, Agentic AI, DevOps, Cloud, Quantum Technology, Smart Manufacturing
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    total_levels = Column(Integer, default=5)

    learning_items = relationship("LearningItem", back_populates="career_track", cascade="all, delete-orphan")


class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(Integer, primary_key=True, index=True)
    career_track_id = Column(Integer, ForeignKey("career_tracks.id", ondelete="CASCADE"), nullable=False, index=True)
    level = Column(Integer, default=1) # Level 1 to 5
    title = Column(String(255), nullable=False)
    topic = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    estimated_hours = Column(Integer, default=10)
    prerequisites = Column(Text, nullable=True)
    project_idea = Column(Text, nullable=True)

    career_track = relationship("CareerTrack", back_populates="learning_items")
    user_progress = relationship("UserProgress", back_populates="learning_item", cascade="all, delete-orphan")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    learning_item_id = Column(Integer, ForeignKey("learning_items.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="Not Started") # Not Started, In Progress, Completed
    verified_by_evidence = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress_records")
    learning_item = relationship("LearningItem", back_populates="user_progress")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")


# ==============================================================================
# 5. TECHKNOW 2026 & RECRUITMENT ECOSYSTEM TABLES
# ==============================================================================

class TechknowEvent(Base):
    __tablename__ = "techknow_events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False) # e.g. "TECHKNOW 2026 International Conference & Exhibition"
    dates = Column(String(100), nullable=False) # "25–26 September 2026"
    venue = Column(String(255), nullable=False) # "Vivekananda Auditorium, Anna University, Guindy Campus, Chennai – 600025"
    organizer = Column(String(255), default="All India Manufacturers' Organization (Tamil Nadu State Board)")
    in_collaboration_with = Column(String(255), default="Anna University")
    founded_by = Column(String(255), default="Bharat Ratna Dr. Sir M. Visvesvaraya")
    description = Column(Text, nullable=False)
    strategic_areas = Column(JSON, nullable=True)


class TechknowJobFair(Base):
    __tablename__ = "techknow_job_fairs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False) # "TECHKNOW 2026 MEGA JOB FAIR"
    date = Column(String(100), nullable=False) # "19 September 2026"
    venue = Column(String(255), nullable=False) # "Vivekananda Auditorium, Anna University, Chennai"
    description = Column(Text, nullable=False)


class TechknowCompany(Base):
    __tablename__ = "techknow_companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    event_sheet_number = Column(Integer, nullable=True) # 1 to 13
    industry = Column(String(150), nullable=False)
    location = Column(String(255), nullable=False)
    about_company = Column(Text, nullable=True)
    official_website = Column(String(255), nullable=True)
    verification_status = Column(String(50), default="EVENT SHEET", index=True) # EVENT SHEET, VERIFIED, NOT VERIFIED, CONFLICT
    logo_url = Column(String(255), nullable=True)
    
    # Event-Sheet Information (Distinct from Independently Verified Company Information)
    event_sheet_opportunity = Column(Text, nullable=True)
    eligible_branches = Column(String(255), nullable=True)
    vacancies_count = Column(String(50), default="Multiple")
    salary_or_stipend_range = Column(String(150), nullable=True)
    room_number = Column(String(50), nullable=True, index=True)
    notes = Column(Text, nullable=True)

    contacts = relationship("JobFairContact", back_populates="company", cascade="all, delete-orphan")
    verifications = relationship("CompanyVerification", back_populates="company", cascade="all, delete-orphan")
    sources = relationship("CompanySource", back_populates="company", cascade="all, delete-orphan")


class JobFairEmployer(Base):
    __tablename__ = "job_fair_employers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    booth_number = Column(String(50), nullable=True)
    registration_status = Column(String(50), default="Confirmed")


class JobFairRole(Base):
    __tablename__ = "job_fair_roles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    role_title = Column(String(255), nullable=False)
    opportunity_type = Column(String(100), nullable=False) # Regular Job, Internship, Apprenticeship-cum-Regular
    branches = Column(String(255), nullable=False)
    salary_stipend = Column(String(150), nullable=True)
    eligibility_criteria = Column(Text, nullable=True)
    room_number = Column(String(50), nullable=True)


class JobFairRequirement(Base):
    __tablename__ = "job_fair_requirements"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("job_fair_roles.id", ondelete="CASCADE"), nullable=False, index=True)
    requirement_text = Column(Text, nullable=False)


class JobFairVacancy(Base):
    __tablename__ = "job_fair_vacancies"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    count = Column(Integer, default=1)
    status = Column(String(50), default="Open")


class JobFairContact(Base):
    __tablename__ = "job_fair_contacts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=True)
    phone = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    context_note = Column(Text, nullable=True)

    company = relationship("TechknowCompany", back_populates="contacts")


class JobFairRoom(Base):
    __tablename__ = "job_fair_rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(50), unique=True, index=True, nullable=False) # GF-101, F1-203, F2-301...
    floor = Column(String(50), nullable=False) # Ground Floor, First Floor, Second Floor
    building = Column(String(255), default="Vivekananda Auditorium Complex")
    assigned_company_name = Column(String(255), nullable=True)
    capacity = Column(Integer, default=40)


class CompanyVerification(Base):
    __tablename__ = "company_verifications"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    verified_field = Column(String(100), nullable=False) # Location, Incorporation, Plants, R&D
    source_type = Column(String(100), nullable=False) # Official Site, ROC Filing, Public Directory
    source_url = Column(String(500), nullable=True)
    verification_notes = Column(Text, nullable=False)
    verified_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("TechknowCompany", back_populates="verifications")


class CompanySource(Base):
    __tablename__ = "company_sources"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("techknow_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    is_official_company_source = Column(Boolean, default=False)
    retrieved_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("TechknowCompany", back_populates="sources")


class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    target_entity = Column(String(100), nullable=False) # company, room, job, vacancy
    target_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")

def get_db():
    """Dependency helper for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
