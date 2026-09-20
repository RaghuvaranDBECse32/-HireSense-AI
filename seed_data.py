"""Seed data for HireSense AI.
Populates initial records for TECHKNOW 2026, the 13 company dataset,
job fair rooms, recruiter contacts, AI/Agentic tracks, Quantum career tracks,
and the demo candidate profile (Alex Rivera).
"""

import os
import json
from datetime import datetime
from database import (
    SessionLocal, init_db, User, Profile, Resume, ResumeSection,
    Skill, UserSkill, Experience, Project, Certification, Job, JobRequirement,
    CareerTrack, LearningItem, TechknowEvent, TechknowJobFair, TechknowCompany,
    JobFairContact, JobFairRoom, CompanyVerification, CompanySource, Application
)

def hash_password(password: str) -> str:
    # Simple deterministic hash for demo/dev mode
    import hashlib
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def seed_all():
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(TechknowCompany).count() > 0:
            print("Database already contains TECHKNOW company data. Skipping duplicate seed.")
            return

        print("Seeding TECHKNOW 2026 events...")
        # 1. TECHKNOW 2026 International Conference & Exhibition
        conference_event = TechknowEvent(
            name="TECHKNOW 2026 International Conference & Exhibition",
            dates="25–26 September 2026",
            venue="Vivekananda Auditorium, Anna University, Guindy Campus, Chennai – 600025",
            organizer="All India Manufacturers' Organization (Tamil Nadu State Board)",
            in_collaboration_with="Anna University",
            founded_by="Bharat Ratna Dr. Sir M. Visvesvaraya",
            description=(
                "Premier industry-academia confluence organized by AIMO (TNSB) in collaboration "
                "with Anna University. Fosters AI-powered industrial transformation, semiconductor ecosystem "
                "development, talent identification, and high-impact technology transfer."
            ),
            strategic_areas=[
                "AI-Powered Industrial Transformation",
                "Semiconductor Ecosystem",
                "Skill Development",
                "Industry-Institution Collaboration",
                "Technology Transfer",
                "Smart Manufacturing",
                "Industrial Growth"
            ]
        )
        db.add(conference_event)

        # 2. TECHKNOW 2026 MEGA JOB FAIR (Strictly Separate Date: 19 September 2026)
        job_fair_event = TechknowJobFair(
            name="TECHKNOW 2026 MEGA JOB FAIR",
            date="19 September 2026",
            venue="Vivekananda Auditorium, Anna University, Chennai",
            description=(
                "Dedicated recruitment mega-drive bringing together leading manufacturing, "
                "engineering, IT, and deep-tech enterprises with graduates, apprentices, and interns."
            )
        )
        db.add(job_fair_event)
        db.commit()

        # 3. Rooms Directory
        rooms_data = [
            ("GF-101", "Ground Floor", "Vivekananda Auditorium Complex", 50),
            ("GF-102", "Ground Floor", "Vivekananda Auditorium Complex", 45),
            ("GF-103", "Ground Floor", "Vivekananda Auditorium Complex", 40),
            ("GF-104", "Ground Floor", "Vivekananda Auditorium Complex", 40),
            ("GF-105", "Ground Floor", "Vivekananda Auditorium Complex", 35),
            ("F1-201", "First Floor", "Vivekananda Auditorium Complex", 50),
            ("F1-202", "First Floor", "Vivekananda Auditorium Complex", 45),
            ("F1-203", "First Floor", "Vivekananda Auditorium Complex", 40),
            ("F1-204", "First Floor", "Vivekananda Auditorium Complex", 40),
            ("F2-301", "Second Floor", "Vivekananda Auditorium Complex", 60),
            ("F2-302", "Second Floor", "Vivekananda Auditorium Complex", 60),
            ("F2-303", "Second Floor", "Vivekananda Auditorium Complex", 50),
            ("F2-304", "Second Floor", "Vivekananda Auditorium Complex", 45)
        ]
        for r_num, floor, bld, cap in rooms_data:
            db.add(JobFairRoom(room_number=r_num, floor=floor, building=bld, capacity=cap))
        db.commit()

        # 4. TECHKNOW 13 Company Dataset (Strict separation between Event Sheet vs Independently Verified)
        companies_seed = [
            {
                "event_sheet_number": 1,
                "name": "IGO Solutions Private Limited",
                "location": "Chennai",
                "industry": "IT Services & Consulting",
                "about_company": "Chennai-based IT services and consulting company providing enterprise software, digital transformation, and modern engineering solutions.",
                "official_website": "https://igosolutions.com",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "CSE / IT / ECE / MCA",
                "vacancies_count": "15+",
                "salary_or_stipend_range": "INR 3.5 - 6.0 LPA | Stipend: 15,000/mo",
                "room_number": "GF-101",
                "verification_notes": "Public company profile independently identifies it with IT services and consulting headquartered in Chennai.",
                "source_title": "Public Corporate Directory & Services Profile",
                "source_url": "https://igosolutions.com",
                "is_official": True
            },
            {
                "event_sheet_number": 2,
                "name": "Ashok Leyland Ltd – Foundry Division",
                "location": "Tiruvallur / Sriperumbudur",
                "industry": "Automotive & Heavy Castings Foundry",
                "about_company": "Flagship commercial vehicle manufacturer's specialized foundry division delivering precision cylinder blocks, heads, and automotive castings.",
                "official_website": "https://www.ashokleyland.com/foundry/contactus",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / Metallurgy / Automobile / Production Engineering",
                "vacancies_count": "25+",
                "salary_or_stipend_range": "INR 3.0 - 5.5 LPA | Stipend: 14,000/mo",
                "room_number": "GF-102",
                "verification_notes": "Official site lists Foundry Plant 1 at SIPCOT Industrial Estate, Arneri Village, Mambakkam, Sriperumbudur, Kanchipuram, and Foundry Plant 2 at Ennore, Chennai.",
                "source_title": "Ashok Leyland Official Foundry Contact Page",
                "source_url": "https://www.ashokleyland.com/foundry/contactus",
                "is_official": True
            },
            {
                "event_sheet_number": 3,
                "name": "KALS Group of Companies",
                "location": "Pudukkottai",
                "industry": "Diversified Manufacturing & Beverages",
                "about_company": "Leading industrial conglomerate with operations spanning beverages, packaging, and agro-manufacturing.",
                "official_website": None,
                "verification_status": "EVENT SHEET",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / EEE / Chemical / Management",
                "vacancies_count": "12",
                "salary_or_stipend_range": "INR 2.8 - 4.2 LPA | Stipend: 12,000/mo",
                "room_number": "GF-103",
                "verification_notes": "Job-fair sheet identifies KALS in Pudukkottai; keep its specific job-fair vacancy data as event-sheet data unless separately verified.",
                "source_title": "TECHKNOW 2026 Mega Job Fair Master Sheet",
                "source_url": "internal://techknow-2026/sheet/kals",
                "is_official": False
            },
            {
                "event_sheet_number": 4,
                "name": "Prime Vector",
                "location": "Electronic City, Karnataka",
                "industry": "IT Services & Technology Consulting",
                "about_company": "Technology consulting and software engineering firm specializing in cloud infrastructure, embedded systems, and enterprise solutions.",
                "official_website": "https://in.linkedin.com/company/prime-vector-private-limited",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "CSE / IT / ECE / Data Science",
                "vacancies_count": "10",
                "salary_or_stipend_range": "INR 4.0 - 7.0 LPA | Stipend: 18,000/mo",
                "room_number": "GF-104",
                "verification_notes": "Public company information describes Prime Vector as an IT services and consulting organization, with locations listed in Hosur and Electronic City, Bengaluru.",
                "source_title": "LinkedIn Verified Company Profile",
                "source_url": "https://in.linkedin.com/company/prime-vector-private-limited",
                "is_official": True
            },
            {
                "event_sheet_number": 5,
                "name": "Yuzhan Technology India Pvt. Ltd. – Foxconn Group",
                "location": "Kanchipuram / Sriperumbudur",
                "industry": "High-Tech Electronics & Precision Component Manufacturing",
                "about_company": "Active Foxconn Group enterprise registered with RoC-Chennai producing high-precision components and electronic enclosures for international OEMs.",
                "official_website": "https://cin.iadv.io/YUZHAN-TECHNOLOGY-INDIA-PRIVATE-LIMITED-U26309TN2023PTC166066/",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / ECE / EEE / Mechatronics / Industrial Engineering",
                "vacancies_count": "30+",
                "salary_or_stipend_range": "INR 3.2 - 5.0 LPA | Stipend: 16,000/mo",
                "room_number": "GF-105",
                "verification_notes": "Public corporate-registration information identifies Yuzhan Technology (India) Private Limited as an active company registered with RoC-Chennai, registered address in Oragadam/Sriperumbudur-Kanchipuram.",
                "source_title": "India Corporate Registry CIN Verification",
                "source_url": "https://cin.iadv.io/YUZHAN-TECHNOLOGY-INDIA-PRIVATE-LIMITED-U26309TN2023PTC166066/",
                "is_official": True
            },
            {
                "event_sheet_number": 6,
                "name": "Schaeffler India Limited",
                "location": "Krishnagiri / Hosur",
                "industry": "Automotive & Industrial Bearings / Precision Motion",
                "about_company": "Global motion technology company manufacturing high-precision components and systems for automotive powertrains and industrial applications.",
                "official_website": "https://www.schaeffler-engineering.com",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / Automobile / Production / Mechatronics",
                "vacancies_count": "20",
                "salary_or_stipend_range": "INR 3.8 - 6.5 LPA | Stipend: 16,500/mo",
                "room_number": "F1-201",
                "verification_notes": "Official location page lists the Hosur facility at Royakottah Road, Krishnagiri District; Schaeffler also identifies its Shoolagiri facility in Tamil Nadu.",
                "source_title": "Schaeffler Engineering Global Facilities Directory",
                "source_url": "https://www.schaeffler-engineering.com",
                "is_official": True
            },
            {
                "event_sheet_number": 7,
                "name": "TAFE (Tractors and Farm Equipment Limited)",
                "location": "Chennai",
                "industry": "Agricultural Machinery & Heavy Engineering",
                "about_company": "World's third-largest tractor manufacturer by volumes, incorporated in Chennai in 1960 under the Amalgamations Group.",
                "official_website": "https://www.tafe.com/corporate/",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / Agriculture / Automobile / EEE",
                "vacancies_count": "18",
                "salary_or_stipend_range": "INR 3.6 - 5.8 LPA | Stipend: 15,000/mo",
                "room_number": "F1-202",
                "verification_notes": "Official profile confirms incorporation in Chennai in 1960; tractor/agri-equipment manufacturer within Amalgamations Group with corporate office at Nungambakkam High Road, Chennai.",
                "source_title": "TAFE Corporate Heritage & About Us",
                "source_url": "https://www.tafe.com/corporate/",
                "is_official": True
            },
            {
                "event_sheet_number": 8,
                "name": "Thejo Engineering Limited",
                "location": "Chennai",
                "industry": "Industrial Bulk-Material Handling & Conveyor Solutions",
                "about_company": "Chennai-headquartered engineering solutions pioneer specializing in conveyor care, transfer point solutions, corrosion protection, and filtration.",
                "official_website": "https://www.thejo-engg.com/investors/Aboutus",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Regular Job / Internship / Apprenticeship-cum-Regular",
                "eligible_branches": "Mechanical / Metallurgy / Industrial Engineering",
                "vacancies_count": "15",
                "salary_or_stipend_range": "INR 3.2 - 5.0 LPA | Stipend: 13,500/mo",
                "room_number": "F1-203",
                "verification_notes": "Official corporate records describe Chennai-headquartered industrial solutions provider focused on conveyor/bulk-material-handling, with manufacturing plants and an R&D centre.",
                "source_title": "Thejo Engineering Official Corporate Site",
                "source_url": "https://www.thejo-engg.com/investors/Aboutus",
                "is_official": True
            },
            {
                "event_sheet_number": 9,
                "name": "Flipped.ai",
                "location": "Chennai",
                "industry": "AI Hiring & Talent Intelligence Platform",
                "about_company": "AI-powered hiring platform with AI-assisted job creation, semantic matching, assessments, and candidate upskilling. India engineering and research centre located at IIT Madras Research Park, Chennai.",
                "official_website": "https://flipped.ai/about",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "CSE / MBA / AI; internship opportunity listed",
                "eligible_branches": "CSE / IT / AI & Data Science / MBA",
                "vacancies_count": "8",
                "salary_or_stipend_range": "INR 5.0 - 9.0 LPA | Stipend: 25,000/mo",
                "room_number": "F1-204",
                "verification_notes": "Official site describes AI-powered hiring platform with semantic matching; India engineering & research centre at IIT Madras Research Park, Chennai.",
                "source_title": "Flipped.ai Official About Page",
                "source_url": "https://flipped.ai/about",
                "is_official": True,
                "contact": {
                    "name": "Vidhya V",
                    "designation": "Talent Acquisition & Business Development Executive",
                    "phone": "+91 730 549 6227",
                    "email": "vidhya@flipped.ai",
                    "context_note": "Stored specifically under TECHKNOW Job Fair contact sheet, not generic directory data."
                }
            },
            {
                "event_sheet_number": 10,
                "name": "Tasktel Technologies Pvt. Ltd.",
                "location": "Chennai",
                "industry": "Telecommunications & Embedded Systems",
                "about_company": "Chennai-based technology provider operating in telecommunications, network infrastructure, and electronic hardware engineering.",
                "official_website": None,
                "verification_status": "EVENT SHEET",
                "event_sheet_opportunity": "ECE / EEE Regular & Internship",
                "eligible_branches": "ECE / EEE",
                "vacancies_count": "10",
                "salary_or_stipend_range": "INR 3.0 - 4.5 LPA | Stipend: 12,000/mo",
                "room_number": "F2-301",
                "verification_notes": "Public listing places company in Chennai; marked third-party sourced until official company records are cataloged.",
                "source_title": "TECHKNOW 2026 Mega Job Fair Sheet",
                "source_url": "internal://techknow-2026/sheet/tasktel",
                "is_official": False
            },
            {
                "event_sheet_number": 11,
                "name": "Next Generation 3D Printers",
                "location": "Chennai",
                "industry": "Additive Manufacturing & 3D CAD Engineering",
                "about_company": "Additive manufacturing solutions provider delivering rapid prototyping, 3D printing equipment, and CAD product design services.",
                "official_website": None,
                "verification_status": "EVENT SHEET",
                "event_sheet_opportunity": "Any Degree; Apprenticeship / Trainee",
                "eligible_branches": "Any Degree / Mechanical / Design / CSE",
                "vacancies_count": "12",
                "salary_or_stipend_range": "INR 2.5 - 4.0 LPA | Stipend: 11,000/mo",
                "room_number": "F2-302",
                "verification_notes": "Public information associates company with 3D-printing/CAD-related services in Chennai; marked third-party sourced until official corporate registration is confirmed.",
                "source_title": "TECHKNOW 2026 Mega Job Fair Sheet",
                "source_url": "internal://techknow-2026/sheet/nextgen3d",
                "is_official": False
            },
            {
                "event_sheet_number": 12,
                "name": "Shree Polymer Products",
                "location": "Tiruvallur",
                "industry": "Polymer Engineering & Precision Sealing Solutions",
                "about_company": "Leading manufacturer of precision rubber, elastomeric components, and sealing solutions for automotive and industrial fluid containment.",
                "official_website": "https://sppindia.com",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Mechanical / EEE / IT Regular & Apprenticeship",
                "eligible_branches": "Mechanical / EEE / IT",
                "vacancies_count": "16",
                "salary_or_stipend_range": "INR 2.8 - 4.8 LPA | Stipend: 13,000/mo",
                "room_number": "F2-303",
                "verification_notes": "Official site lists Factory 1 at Aranvoyal Village, Tiruvallur and Factory 2 at Kottivakkam, Chennai; describes precision polymer/sealing solutions.",
                "source_title": "SPP India Official Manufacturing Footprint",
                "source_url": "https://sppindia.com",
                "is_official": True
            },
            {
                "event_sheet_number": 13,
                "name": "Transenergy Private Limited",
                "location": "Chennai",
                "industry": "Automotive Braking & Clutch Systems Manufacturing",
                "about_company": "Specialized automotive engineering component manufacturer delivering high-reliability brake, clutch, and hydraulic components in Chennai ecosystem.",
                "official_website": "https://www.brakesindia.com",
                "verification_status": "VERIFIED",
                "event_sheet_opportunity": "Mechanical / EEE / ECE / Automobile / Mechatronics / Industrial Engineering / Manufacturing Technology",
                "eligible_branches": "Mechanical / EEE / ECE / Automobile / Mechatronics / IE / Mfg Tech",
                "vacancies_count": "22",
                "salary_or_stipend_range": "INR 3.2 - 5.2 LPA | Stipend: 14,500/mo",
                "room_number": "F2-304",
                "verification_notes": "Public site describes automotive brake/clutch-component manufacturing in Chennai; associated Brakes India official site confirms Chennai corporate/registered offices.",
                "source_title": "Brakes India & Transenergy Operations Portal",
                "source_url": "https://www.brakesindia.com",
                "is_official": True
            }
        ]

        print("Seeding 13 TECHKNOW companies and verification records...")
        for comp_data in companies_seed:
            c = TechknowCompany(
                event_sheet_number=comp_data["event_sheet_number"],
                name=comp_data["name"],
                industry=comp_data["industry"],
                location=comp_data["location"],
                about_company=comp_data["about_company"],
                official_website=comp_data["official_website"],
                verification_status=comp_data["verification_status"],
                event_sheet_opportunity=comp_data["event_sheet_opportunity"],
                eligible_branches=comp_data["eligible_branches"],
                vacancies_count=comp_data["vacancies_count"],
                salary_or_stipend_range=comp_data["salary_or_stipend_range"],
                room_number=comp_data["room_number"],
                notes=comp_data["verification_notes"]
            )
            db.add(c)
            db.flush()

            # Room update
            room = db.query(JobFairRoom).filter_by(room_number=comp_data["room_number"]).first()
            if room:
                room.assigned_company_name = comp_data["name"]

            # Verification entry
            v = CompanyVerification(
                company_id=c.id,
                verified_field="Corporate Identity & Manufacturing Footprint",
                source_type="Official Site" if comp_data["is_official"] else "Event Sheet",
                source_url=comp_data["source_url"],
                verification_notes=comp_data["verification_notes"]
            )
            db.add(v)

            # Source entry
            s = CompanySource(
                company_id=c.id,
                title=comp_data["source_title"],
                url=comp_data["source_url"],
                is_official_company_source=comp_data["is_official"]
            )
            db.add(s)

            # Recruiter contact if present
            if "contact" in comp_data:
                cnt = comp_data["contact"]
                contact_entry = JobFairContact(
                    company_id=c.id,
                    name=cnt["name"],
                    designation=cnt["designation"],
                    phone=cnt["phone"],
                    email=cnt["email"],
                    context_note=cnt["context_note"]
                )
                db.add(contact_entry)

            # Also create corresponding searchable Job in the main catalog
            job_entry = Job(
                title=f"{c.name} Graduate & Trainee Roles",
                company_name=c.name,
                location=c.location,
                work_mode="On-site",
                job_type=c.event_sheet_opportunity.split("/")[0].strip() if "/" in c.event_sheet_opportunity else c.event_sheet_opportunity,
                track="Smart Manufacturing" if "Manufacturing" in c.industry or "Foundry" in c.industry else ("AI Engineering" if "AI" in c.industry else "Engineering"),
                experience_required="0 - 2 Years (Freshers & Recent Graduates)",
                education_required=c.eligible_branches,
                salary_range=c.salary_or_stipend_range,
                raw_jd_text=(
                    f"Job Opportunity at {c.name} for TECHKNOW 2026 Mega Job Fair.\n"
                    f"Location: {c.location} | Room: {c.room_number}\n"
                    f"Eligible Branches: {c.eligible_branches}\n"
                    f"Opportunity Type: {c.event_sheet_opportunity}\n"
                    f"Compensation / Stipend: {c.salary_or_stipend_range}\n"
                    f"About: {c.about_company}\n"
                    f"Requirements: Degree or Diploma in {c.eligible_branches}, strong analytical aptitude, "
                    f"hands-on project experience, commitment to professional engineering standards."
                ),
                is_techknow_opportunity=True,
                techknow_room=c.room_number
            )
            db.add(job_entry)

        db.commit()

        # 5. Core Platform Jobs (e.g., sample Cloud/FastAPI Senior Engineer)
        sample_jd_path = os.path.join(os.path.dirname(__file__), "data", "samples", "sample_jd.txt")
        if os.path.exists(sample_jd_path):
            with open(sample_jd_path, "r", encoding="utf-8") as f:
                sample_jd_text = f.read()
            backend_job = Job(
                title="Senior Backend Engineer (Python / Cloud)",
                company_name="CloudScale Systems",
                location="Chennai / Bangalore (Hybrid)",
                work_mode="Hybrid",
                job_type="Regular Job",
                track="Backend",
                experience_required="3+ years",
                education_required="Bachelor's degree in Computer Science or related discipline",
                salary_range="INR 16.0 - 24.0 LPA",
                raw_jd_text=sample_jd_text,
                is_techknow_opportunity=False
            )
            db.add(backend_job)
            db.flush()

            requirements = [
                ("3+ years of professional backend software development experience", False, "Experience"),
                ("Strong proficiency in Python with FastAPI or asyncio", False, "Technical Skill"),
                ("Production experience with PostgreSQL and database query optimization", False, "Technical Skill"),
                ("Solid understanding of containerization (Docker) and CI/CD pipelines", False, "Technical Skill"),
                ("Experience building RESTful APIs and microservice architectures", False, "Technical Skill"),
                ("Experience deploying and managing workloads on AWS (ECS, EKS, Lambda, S3)", True, "Technical Skill"),
                ("Hands-on knowledge of Kubernetes cluster management and Helm charts", True, "Technical Skill"),
                ("Familiarity with event-driven architectures using Apache Kafka or RabbitMQ", True, "Technical Skill")
            ]
            for req_text, pref, cat in requirements:
                db.add(JobRequirement(job_id=backend_job.id, requirement_text=req_text, is_preferred=pref, category=cat))
            db.commit()

        # 6. Career Tracks: AI & Agentic Systems (5 Levels) and Quantum Career Explorer (7 Topics)
        print("Seeding AI & Agentic and Quantum Technology career tracks...")
        
        # Track 1: AI & Agentic Systems
        ai_track = CareerTrack(
            title="AI & Agentic Systems",
            slug="ai-agentic-systems",
            description=(
                "Mastery path from modern generative AI fundamentals to autonomous multi-agent systems, "
                "context management, and production-grade agent harnesses."
            ),
            total_levels=5
        )
        db.add(ai_track)
        db.flush()

        ai_items = [
            (1, "Level 1 — Foundations", "Generative AI & LLM Fundamentals", "Core transformer architectures, tokens, attention mechanisms, embeddings, and API invocation.", 15, "Python Basics", "Build a semantic search script over technical documentation."),
            (1, "Level 1 — Foundations", "Prompt Engineering & Calibrated Output", "Zero-shot, few-shot, chain-of-thought, structured JSON outputs, and anti-hallucination prompting.", 10, "LLM Fundamentals", "Prompt harness that enforces deterministic JSON schema validation."),
            (2, "Level 2 — Applied AI", "RAG & Vector Databases", "Chunking strategies, hybrid keyword-vector retrieval, Pinecone/Chroma/Qdrant, and re-ranking.", 25, "Level 1 Completion", "Grounded document QA system with source citation badges."),
            (2, "Level 2 — Applied AI", "Tool Calling & Structured Actions", "Function declaration, tool execution loops, API parameter schemas, and error recovery.", 20, "FastAPI & RAG", "Build an autonomous SQL database querying assistant."),
            (3, "Level 3 — RAG & Agents", "Autonomous AI Agents", "ReAct loop, goal planning, memory management, reflexions, and sub-task delegation.", 30, "Tool Calling", "Autonomous research agent that scrapes, summarizes, and produces markdown reports."),
            (3, "Level 3 — RAG & Agents", "Multi-Agent Systems & Coordination", "Supervisor-worker patterns, debate consensus, handoffs, message passing, and specialized agent personas.", 35, "Single Agent Loops", "Multi-agent code review pipeline with security, style, and testing agents."),
            (4, "Level 4 — Production AI", "Agent Harnesses & Context Management", "State checkpointing, long-term memory, compaction, dynamic system prompt assembly, and token budget management.", 40, "Multi-Agent Systems", "Resilient stateful workflow engine that can pause, resume, and recover from failures."),
            (4, "Level 4 — Production AI", "Guardrails, Safety & AI Evaluation", "NeMo guardrails, LLM-as-a-judge, benchmark datasets, anti-gravity grounding self-checks, and latency optimization.", 30, "Production Harnesses", "Automated evaluation suite testing for hallucinations and bias."),
            (5, "Level 5 — Advanced Agentic Systems", "Enterprise Observability & Production Orchestration", "OpenTelemetry for LLMs, Phoenix/Langfuse tracing, cost anomaly detection, and enterprise governance.", 45, "Level 4 Mastery", "Full production multi-agent deployment with observability telemetry and SLA alerting.")
        ]
        for lvl, title, topic, desc, hrs, prereq, proj in ai_items:
            db.add(LearningItem(
                career_track_id=ai_track.id,
                level=lvl,
                title=title,
                topic=topic,
                description=desc,
                estimated_hours=hrs,
                prerequisites=prereq,
                project_idea=proj
            ))

        # Track 2: Quantum Career Explorer (7 Topics)
        quantum_track = CareerTrack(
            title="Quantum Career Explorer",
            slug="quantum-career-explorer",
            description=(
                "Exploration of quantum computing, quantum algorithms, QML, and quantum cryptography. "
                "Strictly separates verified candidate skills from recommended future milestones."
            ),
            total_levels=5
        )
        db.add(quantum_track)
        db.flush()

        quantum_items = [
            (1, "Topic 1 — Quantum Computing Foundations", "Qubits, Superposition & Entanglement", "Linear algebra foundations, Hilbert spaces, Dirac notation, Bloch sphere representations, and quantum measurement.", 20, "Linear Algebra & Complex Numbers", "Simulate a Bell state and test quantum entanglement violation locally using Qiskit."),
            (2, "Topic 2 — Quantum Algorithms", "Shor's & Grover's Algorithms", "Quantum Fourier Transform (QFT), quantum phase estimation, amplitude amplification, and algorithmic complexity.", 30, "Quantum Gates & Circuits", "Implement Grover's search algorithm for a 3-qubit database."),
            (3, "Topic 3 — Quantum Machine Learning", "Variational Quantum Classifiers (VQC)", "Parameterized quantum circuits (PQC), quantum kernels, barren plateaus, and hybrid quantum-classical neural networks.", 35, "Classical ML & Quantum Circuits", "Hybrid Qiskit-PyTorch classifier for binary pattern recognition."),
            (4, "Topic 4 — Quantum Cryptography", "Post-Quantum Cryptography (PQC) & QKD", "BB84 protocol, quantum key distribution, lattice-based cryptography, and NIST post-quantum migration.", 25, "Information Security Basics", "Simulate the BB84 protocol with eavesdropping detection."),
            (5, "Topic 5 — Quantum Software & Frameworks", "Qiskit, Cirq & PennyLane", "Quantum circuit optimization, transpilation, noise models, and pulse-level control.", 30, "Python & Quantum Circuits", "Quantum circuit optimization benchmark comparing circuit depths across simulators."),
            (5, "Topic 6 — Quantum Hardware Architectures", "Superconducting, Trapped-Ion & Photonics", "Physical qubit implementations, coherence times (T1, T2), quantum error correction, and surface codes.", 25, "Physics Fundamentals", "Comprehensive analysis report comparing superconducting vs trapped-ion fidelity metrics."),
            (5, "Topic 7 — Quantum + AI Convergence", "Quantum Agent Architectures", "Quantum reinforcement learning, quantum decision trees, and speedup potentials for agentic search spaces.", 40, "Level 4 AI & Quantum Software", "Proof-of-concept quantum walk policy generator for reinforcement learning.")
        ]
        for lvl, title, topic, desc, hrs, prereq, proj in quantum_items:
            db.add(LearningItem(
                career_track_id=quantum_track.id,
                level=lvl,
                title=title,
                topic=topic,
                description=desc,
                estimated_hours=hrs,
                prerequisites=prereq,
                project_idea=proj
            ))

        # Track 3: Full Stack & Cloud Engineering
        fullstack_track = CareerTrack(
            title="Full Stack & Cloud Engineering",
            slug="full-stack-cloud",
            description="Modern end-to-end software engineering using React, TypeScript, FastAPI, PostgreSQL, Docker, and Kubernetes.",
            total_levels=4
        )
        db.add(fullstack_track)
        db.flush()

        fullstack_items = [
            (1, "Modern Frontend Foundations", "React 18 & TypeScript", "Components, hooks, state management, and responsive styling.", 20, "HTML/CSS/JS", "Responsive SaaS dashboard with theme toggling."),
            (2, "Asynchronous Backend Services", "FastAPI & SQLAlchemy", "Async I/O, dependency injection, Pydantic validation, and relational database modeling.", 25, "Python Basics", "High-throughput REST API with JWT authentication."),
            (3, "Containerization & CI/CD", "Docker & GitHub Actions", "Multi-stage Dockerfiles, Docker Compose, automated testing, and CI/CD pipelines.", 20, "Linux & Git", "Automated deployment pipeline running PyTest and linting on push."),
            (4, "Cloud Infrastructure", "Kubernetes & AWS/GCP Deployment", "Pods, Services, Ingress, Helm charts, cloud databases, and horizontal pod autoscaling.", 35, "Docker & Networking", "Deploy microservices architecture to a local k3s/Minikube cluster.")
        ]
        for lvl, title, topic, desc, hrs, prereq, proj in fullstack_items:
            db.add(LearningItem(
                career_track_id=fullstack_track.id,
                level=lvl,
                title=title,
                topic=topic,
                description=desc,
                estimated_hours=hrs,
                prerequisites=prereq,
                project_idea=proj
            ))

        db.commit()

        # 7. Demo Candidate Profile: Alex Rivera
        print("Seeding demo candidate (Alex Rivera)...")
        demo_user = User(
            email="alex.rivera@example.com",
            hashed_password=hash_password("DemoPassword2026!"),
            role="job_seeker",
            is_demo=True
        )
        db.add(demo_user)
        db.flush()

        demo_profile = Profile(
            user_id=demo_user.id,
            full_name="Alex Rivera",
            headline="Full-Stack Software Engineer | FastAPI, Python, React & PostgreSQL",
            location="Chennai, Tamil Nadu, India",
            github="https://github.com/alexrivera-dev",
            linkedin="https://linkedin.com/in/alexrivera",
            portfolio="https://alexrivera.dev",
            career_interests="Backend Microservices, Enterprise SaaS, Agentic AI Tooling, Cloud-Native Systems",
            preferred_roles="Senior Backend Engineer, Full-Stack Engineer, AI Platform Engineer",
            preferred_technologies="Python, FastAPI, React, TypeScript, PostgreSQL, Docker",
            ai_interests="RAG Pipelines, Vector Retrieval, Agentic Tool Calling",
            agentic_ai_interests="Autonomous verification agents, anti-gravity reasoning engines",
            quantum_interests="Foundational interest in Qiskit and Quantum Machine Learning",
            evidence_strength_score=92.0,
            interview_readiness_score=85.0,
            skill_alignment_score=88.0,
            learning_progress_score=60.0
        )
        db.add(demo_profile)
        db.flush()

        # Read sample resume text
        sample_resume_path = os.path.join(os.path.dirname(__file__), "data", "samples", "sample_resume.txt")
        resume_raw = ""
        if os.path.exists(sample_resume_path):
            with open(sample_resume_path, "r", encoding="utf-8") as f:
                resume_raw = f.read()

        demo_resume = Resume(
            user_id=demo_user.id,
            filename="Alex_Rivera_Resume.pdf",
            raw_text=resume_raw,
            is_primary=True,
            candidate_name="Alex Rivera",
            contact_email="alex.rivera@example.com",
            contact_phone="(555) 234-5678",
            summary=(
                "Full-Stack Software Engineer with 3 years of professional experience building scalable "
                "web applications and REST APIs using Python, FastAPI, React, and PostgreSQL. "
                "Experienced with Docker containerization and CI/CD pipelines."
            ),
            parsed_json={
                "name": "Alex Rivera",
                "email": "alex.rivera@example.com",
                "phone": "(555) 234-5678",
                "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "TypeScript", "SQLAlchemy", "Git", "GitHub Actions", "Linux"],
                "experience_years": 3,
                "education": "Bachelor of Science in Computer Science, State University of Technology (2017 - 2021)"
            },
            anti_gravity_verified=True
        )
        db.add(demo_resume)
        db.flush()

        # Verified Skills with Evidence Quotes
        skills_evidence = [
            ("Python", "Work Experience line: 'Built and maintained 12+ RESTful microservices using Python and FastAPI'", "3 years professional experience building REST microservices"),
            ("FastAPI", "Work Experience line: 'Built and maintained 12+ RESTful microservices using Python and FastAPI serving 100k daily requests.'", "Primary framework for 12+ production microservices"),
            ("PostgreSQL", "Work Experience line: 'Integrated PostgreSQL database with SQLAlchemy ORM, optimizing slow query performance by 35%.'", "Database design & query optimization in production"),
            ("React", "Work Experience line: 'Developed responsive front-end dashboard components using React and TypeScript.'", "Component engineering at ByteCraft Solutions"),
            ("TypeScript", "Work Experience line: 'Developed responsive front-end dashboard components using React and TypeScript.'", "Frontend type-safe UI engineering"),
            ("Docker", "Work Experience line: 'Containerized applications using Docker and configured automated GitHub Actions CI/CD workflows.'", "Containerization & local Compose environments"),
            ("SQLAlchemy", "Work Experience line: 'Integrated PostgreSQL database with SQLAlchemy ORM'", "ORM mapping & query tuning"),
            ("CI/CD (GitHub Actions)", "Work Experience line: 'configured automated GitHub Actions CI/CD workflows.'", "Automated deployment & test execution pipelines")
        ]
        for s_name, quote, src in skills_evidence:
            db.add(UserSkill(
                user_id=demo_user.id,
                skill_name=s_name,
                verified=True,
                evidence_source=src,
                evidence_quote=quote,
                proficiency="Advanced" if s_name in ["Python", "FastAPI", "PostgreSQL"] else "Intermediate"
            ))

        # Experiences
        db.add(Experience(
            profile_id=demo_profile.id,
            title="Software Engineer",
            company="CloudScale Systems",
            location="Remote / Chennai",
            start_date="June 2022",
            end_date="Present",
            is_current=True,
            description="Built and maintained 12+ RESTful microservices using Python and FastAPI serving 100k daily requests. Integrated PostgreSQL database with SQLAlchemy ORM, optimizing slow query performance by 35%. Implemented JWT authentication and RBAC.",
            evidence_grounding="Explicitly listed in Resume under Work Experience at CloudScale Systems."
        ))
        db.add(Experience(
            profile_id=demo_profile.id,
            title="Junior Developer",
            company="ByteCraft Solutions",
            location="Chennai",
            start_date="August 2021",
            end_date="May 2022",
            is_current=False,
            description="Developed responsive front-end dashboard components using React and TypeScript. Collaborated with QA team to write unit and integration tests with PyTest, achieving 85% test coverage.",
            evidence_grounding="Explicitly listed in Resume under Work Experience at ByteCraft Solutions."
        ))

        # Projects
        db.add(Project(
            profile_id=demo_profile.id,
            title="TaskPulse - Collaborative Project Management Tool",
            description="Designed a real-time Kanban board using React, FastAPI, and WebSockets. Implemented Docker Compose deployment with Redis caching for active task queues.",
            technologies="React, FastAPI, WebSockets, Docker, Redis",
            evidence_quote="Explicitly cited in Projects section: 'Designed a real-time Kanban board using React, FastAPI, and WebSockets.'"
        ))

        # Demo Recruiter & Admin accounts
        db.add(User(
            email="recruiter@techknow2026.org",
            hashed_password=hash_password("Recruiter2026!"),
            role="recruiter",
            is_demo=True
        ))
        db.add(User(
            email="admin@aimo-hiresense.gov.in",
            hashed_password=hash_password("AdminSecure2026!"),
            role="administrator",
            is_demo=True
        ))

        # Demo Applications
        if 'backend_job' in locals():
            db.add(Application(
                user_id=demo_user.id,
                job_id=backend_job.id,
                status="Interview",
                notes="Technical Round 1 scheduled. Grounded match score 88%. Need to review Kubernetes and AWS ECS concepts.",
                applied_date=datetime(2026, 9, 10),
                follow_up_date=datetime(2026, 9, 22)
            ))

        db.commit()
        print("Database seeded successfully with all required datasets!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_all()
