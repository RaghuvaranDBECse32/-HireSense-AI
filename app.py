"""HireSense AI - Streamlit Web Application.
Intelligent Career & Hiring Platform powered by Anti-Gravity Grounding.
"""

import os
import json
import streamlit as st
from dotenv import load_dotenv

from main import analyze_resume_and_jd
from parsers.resume_parser import extract_text_from_pdf
from llm.client import get_active_provider

load_dotenv()

AIMO_LINK = "https://aimotnsb.com/"
TECHKNOW_LINK = "https://techknow2026.in/#features"
HACKATHON_LINK = "https://theproductspace.in/events/agentic-ai-hackathons"
GRAPHICAL_LINK = "https://frontend-phi-rust-52.vercel.app/"
RESUME_DRIVE_LINK = "https://drive.google.com/drive/folders/1Ncs7e-f0qvJdOZrDEO6LBMC7UgryBPAo?usp=sharing"
AIMO_LOGO_PATH = os.path.join("frontend", "src", "assets", "media", "aimo-logo-badge.avif")

st.set_page_config(
    page_title="HireSense AI – Intelligent Resume & Job Matcher",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for rich aesthetics, glassmorphism, and clean recruiter dashboard
st.markdown("""
<style>
    /* Global & Typography */
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
        background: linear-gradient(90deg, #3B82F6, #10B981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #94A3B8;
        margin-bottom: 1.5rem;
    }
    
    /* Badges & Pills */
    .badge-pill {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-right: 6px;
        margin-bottom: 6px;
    }
    .badge-success {
        background-color: rgba(6, 78, 59, 0.6);
        color: #6EE7B7;
        border: 1px solid #059669;
    }
    .badge-danger {
        background-color: rgba(127, 29, 29, 0.6);
        color: #FCA5A5;
        border: 1px solid #DC2626;
    }
    .badge-warning {
        background-color: rgba(120, 53, 15, 0.6);
        color: #FCD34D;
        border: 1px solid #D97706;
    }
    
    /* Cards & Containers */
    .evidence-card {
        background: rgba(30, 41, 59, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .evidence-card:hover {
        border-color: rgba(59, 130, 246, 0.35);
    }
    .evidence-quote {
        font-style: italic;
        color: #93C5FD;
        border-left: 3px solid #3B82F6;
        padding-left: 10px;
        margin-top: 8px;
    }
    .metric-box {
        text-align: center;
        padding: 16px;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .collab-hero {
        border: 1px solid rgba(59, 130, 246, 0.28);
        border-radius: 18px;
        padding: 28px;
        margin: 8px 0 24px 0;
        background: 
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 40%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.88));
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .collab-title {
        font-size: 2.1rem;
        line-height: 1.15;
        font-weight: 800;
        color: #F8FAFC;
        margin-bottom: 10px;
    }
    .collab-copy {
        color: #CBD5E1;
        font-size: 1rem;
        max-width: 800px;
        line-height: 1.5;
    }
    .partner-card {
        border: 1px solid rgba(148, 163, 184, 0.15);
        border-radius: 14px;
        padding: 16px;
        background: rgba(15, 23, 42, 0.7);
        height: 100%;
    }
    .partner-card h4 {
        margin: 0 0 6px 0;
        color: #F8FAFC;
        font-size: 1rem;
    }
    .partner-card p {
        color: #94A3B8;
        font-size: 0.85rem;
        margin: 0 0 12px 0;
        line-height: 1.4;
    }
    .vault-card {
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 16px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(6, 78, 59, 0.35), rgba(15, 23, 42, 0.85));
    }
    .small-muted {
        color: #94A3B8;
        font-size: 0.82rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar: Controls & Grounding Status
with st.sidebar:
    if os.path.exists(AIMO_LOGO_PATH):
        st.image(AIMO_LOGO_PATH, width=92)
    else:
        st.image("https://img.icons8.com/isometric/100/compass.png", width=64)
    
    st.title("HireSense AI")
    st.caption("AIMO × TECHKNOW 2026 × Product Space collaboration layer")

    st.link_button("AIMO Tamil Nadu State Board", AIMO_LINK, use_container_width=True)
    st.link_button("TECHKNOW 2026", TECHKNOW_LINK, use_container_width=True)
    st.link_button("Agentic AI Hackathon", HACKATHON_LINK, use_container_width=True)
    st.link_button("Graphical Analysis", GRAPHICAL_LINK, use_container_width=True)
    
    st.markdown("---")
    st.subheader("⚙️ LLM Configuration")
    
    user_api_key = st.text_input(
        "API Key (Gemini, Groq, or OpenAI)",
        type="password",
        placeholder="Enter key or leave blank for Offline Safe Mode",
        help="Paste a Gemini (AIza...), Groq (gsk_...), or OpenAI (sk-...) key. If blank, HireSense uses its deterministic anti-gravity heuristic engine."
    )
    
    provider_name = get_active_provider(user_api_key)
    st.info(f"**Active Mode:**\n{provider_name}")
    
    st.markdown("---")
    st.subheader("📋 Sample Data")
    if st.button("Load Sample Resume & JD", use_container_width=True):
        try:
            with open("data/samples/sample_resume.txt", "r", encoding="utf-8") as f:
                st.session_state["resume_input"] = f.read()
            with open("data/samples/sample_jd.txt", "r", encoding="utf-8") as f:
                st.session_state["jd_input"] = f.read()
            st.success("Loaded sample Cloud/FastAPI engineer data!")
        except Exception as e:
            st.error(f"Could not load samples: {e}")

    st.markdown("---")
    st.subheader("🛡️ Grounding Rules")
    with st.expander("Anti-Gravity Principles", expanded=False):
        st.markdown("""
        1. **Source Boundaries**: Zero speculation outside text.
        2. **Evidence-Based**: Line citations for every claim.
        3. **Zero Hallucination**: No invented metrics or skills.
        4. **Calibrated Confidence**: Explicit uncertainty markers.
        5. **Realistic Roadmaps**: Grounded in current baseline.
        6. **Structured Audit**: Full explainability.
        """)

# Main Screen Header
st.markdown("""
<div class="collab-hero">
    <div>
        <span class="badge-pill badge-success">Admin-only resume vault</span>
        <span class="badge-pill" style="background:#1E3A8A;color:#BFDBFE;border:1px solid #2563EB;">AIMO × TECHKNOW 2026</span>
        <span class="badge-pill" style="background:#4C1D95;color:#DDD6FE;border:1px solid #7C3AED;">Product Space Hackathon</span>
    </div>
    <div class="collab-title" style="margin-top: 10px;">HireSense AI — Intelligent Resume & Job Matcher</div>
    <div class="collab-copy">
        A professional career-intelligence and resume-submission experience for TECHKNOW 2026 candidates,
        AIMO ecosystem employers, and Agentic AI Hackathon builders. Candidates can preview their resume before
        submission while storage remains restricted to authorized administrators.
    </div>
</div>
""", unsafe_allow_html=True)

# Partner Cards Section
partner_col1, partner_col2, partner_col3 = st.columns(3)
with partner_col1:
    st.markdown("""
    <div class="partner-card">
        <h4>AIMO Tamil Nadu State Board</h4>
        <p>Industry ecosystem partner for manufacturing, innovation, and employer connectivity.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open AIMO", AIMO_LINK, use_container_width=True)

with partner_col2:
    st.markdown("""
    <div class="partner-card">
        <h4>TECHKNOW 2026</h4>
        <p>Conference, exhibition, and mega job fair pathway for verified opportunities.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open TECHKNOW", TECHKNOW_LINK, use_container_width=True)

with partner_col3:
    st.markdown("""
    <div class="partner-card">
        <h4>Agentic AI Hackathon</h4>
        <p>Product Space builder event for proof of work, AI projects, and portfolio evidence.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open Hackathon", HACKATHON_LINK, use_container_width=True)

st.markdown("<br>", unsafe_allow_html=True)

# Vault Submission Flow Section
vault_col1, vault_col2 = st.columns([1.3, 1])
with vault_col1:
    st.markdown("""
    <div class="vault-card">
        <h3 style="margin-top:0;color:#ECFDF5;">Private Resume Submission Flow</h3>
        <p style="color:#D1FAE5;margin-bottom:8px;line-height: 1.4;">
            Users preview the resume inside HireSense AI before submitting. After submission, files are handled through
            the admin intake queue; candidates are not given access to browse the Drive folder.
        </p>
        <div class="small-muted">Restricted folder policy: ADMIN_ONLY / RESTRICTED / no public link browsing.</div>
    </div>
    """, unsafe_allow_html=True)

with vault_col2:
    st.info(
        "**Admin Note:** Keep the Google Drive folder restricted and use the app as the public submission surface. "
        "Do not grant viewer/editor access to candidates."
    )
    st.caption(f"Storage folder for admins only: {RESUME_DRIVE_LINK}")

st.markdown("---")

# Input Section: Two columns for Resume and JD
col_resume, col_jd = st.columns(2)

with col_resume:
    st.subheader("📄 Candidate Resume")
    resume_tab_text, resume_tab_pdf = st.tabs(["✍️ Paste Text", "📤 Upload PDF"])
    
    with resume_tab_text:
        resume_text_input = st.text_area(
            "Resume Content",
            value=st.session_state.get("resume_input", ""),
            height=300,
            placeholder="Paste raw resume text here...",
            key="resume_text_area"
        )
    
    with resume_tab_pdf:
        st.markdown("#### Preview before submitting")
        st.caption("Select a PDF resume, review the extracted preview, then run the analysis.")
        uploaded_pdf = st.file_uploader("Upload PDF Resume", type=["pdf"], key="pdf_uploader")
        if uploaded_pdf is not None:
            pdf_bytes = uploaded_pdf.read()
            extracted_pdf_text = extract_text_from_pdf(pdf_bytes)
            st.session_state["resume_input"] = extracted_pdf_text
            st.success(f"Ready for private intake review: {uploaded_pdf.name}")
            st.write(f"Extracted **{len(extracted_pdf_text)}** characters for preview and analysis.")
            st.text_area(
                "Candidate Preview",
                value=extracted_pdf_text[:1200] + ("..." if len(extracted_pdf_text) > 1200 else ""),
                height=200,
                disabled=True
            )

with col_jd:
    st.subheader("🎯 Job Description")
    st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True) # Spacer for visual alignment with tabs
    jd_text_input = st.text_area(
        "Job Description Requirements",
        value=st.session_state.get("jd_input", ""),
        height=300,
        placeholder="Paste role overview, responsibilities, and qualifications...",
        key="jd_text_area"
    )

effective_resume = resume_text_input.strip() or st.session_state.get("resume_input", "").strip()
effective_jd = jd_text_input.strip() or st.session_state.get("jd_input", "").strip()

st.markdown("<br>", unsafe_allow_html=True)
analyze_btn = st.button("🚀 Run Anti-Gravity Grounded Analysis", type="primary", use_container_width=True)

if analyze_btn:
    if not effective_resume or not effective_jd:
        st.warning("⚠️ Please provide both a Resume and a Job Description to proceed.")
    else:
        with st.spinner("Executing Anti-Gravity Multi-Agent Pipeline (Parsing → Matching → Gaps → Roadmap → Interview)..."):
            try:
                report = analyze_resume_and_jd(
                    resume_text=effective_resume,
                    jd_text=effective_jd,
                    api_key=user_api_key.strip() if user_api_key else None
                )
                st.session_state["analysis_report"] = report
                st.success("✅ Grounded Analysis Completed Successfully!")
            except Exception as e:
                st.error(f"Analysis pipeline error: {str(e)}")

# Display Results Dashboard
if "analysis_report" in st.session_state:
    report = st.session_state["analysis_report"]
    st.markdown("---")
    st.subheader("📊 Recruiter Assessment Dashboard")
    
    # Top KPI Metrics Row
    m_col1, m_col2, m_col3, m_col4 = st.columns(4)
    with m_col1:
        st.markdown(
            f'<div class="metric-box"><h2 style="margin:0; color:#3B82F6;">{report.get("match_score", 0)}%</h2><p style="color:#94A3B8;margin:4px 0 0 0;font-size:0.85rem;">Match Alignment</p></div>',
            unsafe_allow_html=True
        )
    with m_col2:
        conf = report.get("confidence_level", "Medium")
        color = "#10B981" if conf.lower() == "high" else ("#F59E0B" if conf.lower() == "medium" else "#EF4444")
        st.markdown(
            f'<div class="metric-box"><h2 style="margin:0; color:{color};">{conf}</h2><p style="color:#94A3B8;margin:4px 0 0 0;font-size:0.85rem;">Evidence Confidence</p></div>',
            unsafe_allow_html=True
        )
    with m_col3:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{report.get("candidate_name", "Candidate")}</h4><p style="color:#94A3B8;margin:4px 0 0 0;font-size:0.85rem;">Candidate Name</p></div>',
            unsafe_allow_html=True
        )
    with m_col4:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{report.get("job_title", "Position")}</h4><p style="color:#94A3B8;margin:4px 0 0 0;font-size:0.85rem;">Target Role</p></div>',
            unsafe_allow_html=True
        )

    st.markdown("<br>", unsafe_allow_html=True)
    
    # Detailed Result Tabs
    tab_overview, tab_skills, tab_career, tab_interview, tab_export = st.tabs([
        "🔍 Match & Evidence",
        "⚖️ Skills & Gaps Matrix",
        "📈 Actionable Career Plan",
        "🎯 Grounded Interview Questions",
        "💾 Export & Audit"
    ])

    with tab_overview:
        st.subheader("Executive Grounded Assessment")
        st.info(report.get("explanation", "Grounded analysis completed."))
        
        st.markdown("<br>", unsafe_allow_html=True)
        col_str, col_con = st.columns(2)
        
        with col_str:
            st.markdown("### ✅ Verified Strengths")
            strengths = report.get("strengths", [])
            if strengths:
                for s in strengths:
                    if isinstance(s, dict):
                        st.markdown(f"""
                        <div class="evidence-card">
                            <strong>{s.get('item', 'Strength')}</strong>
                            <div class="evidence-quote">"{s.get('evidence', 'Grounded in resume')}"</div>
                        </div>
                        """, unsafe_allow_html=True)
                    else:
                        st.markdown(f"- {s}")
            else:
                st.write("No specific strengths isolated.")

        with col_con:
            st.markdown("### ⚠️ Grounded Concerns & Gaps")
            concerns = report.get("concerns", [])
            if concerns:
                for c in concerns:
                    if isinstance(c, dict):
                        st.markdown(f"""
                        <div class="evidence-card" style="border-left: 3px solid #EF4444;">
                            <strong>{c.get('item', 'Concern')}</strong>
                            <div class="evidence-quote" style="color: #FCA5A5; border-left-color: #EF4444;">"{c.get('evidence', 'Absence verified against text')}"</div>
                        </div>
                        """, unsafe_allow_html=True)
                    else:
                        st.markdown(f"- {c}")
            else:
                st.write("No significant concerns identified.")

    with tab_skills:
        st.subheader("Competency Alignment Breakdown")
        
        st.markdown("#### 🟢 Verified Matched Skills")
        matched = report.get("skills_matched", [])
        if matched:
            pill_html = "".join([f'<span class="badge-pill badge-success">{s}</span>' for s in matched if s])
            st.markdown(pill_html, unsafe_allow_html=True)
        else:
            st.caption("No clear direct skill matches isolated.")

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("#### 🔴 Unmet / Missing Job Requirements")
        gaps = report.get("skill_gaps", [])
        if gaps:
            gap_html = "".join([f'<span class="badge-pill badge-danger">{g}</span>' for g in gaps if g])
            st.markdown(gap_html, unsafe_allow_html=True)
        else:
            st.caption("All primary stated skills appear matched.")

        det_gaps = report.get("detailed_gaps", {})
        ambiguous = det_gaps.get("ambiguous_skills", [])
        if ambiguous:
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown("#### 🟡 Ambiguous / Partially Described Skills")
            for amb in ambiguous:
                if isinstance(amb, dict):
                    st.markdown(f"""
                    <div class="evidence-card" style="border-left: 3px solid #F59E0B;">
                        <strong>{amb.get('skill', 'Skill')}</strong> — <em>{amb.get('status', 'Uncertain')}</em>
                        <p style="color:#CBD5E1; margin:6px 0 0 0; font-size:0.9rem;">{amb.get('note', '')}</p>
                    </div>
                    """, unsafe_allow_html=True)

    with tab_career:
        st.subheader("Realistic Career Progression Roadmap")
        c_plan = report.get("career_plan", {})
        
        st.markdown(f"**Candidate Baseline Assessment:** {c_plan.get('current_level_assessment', 'Determined from resume.')}")
        
        st.markdown("#### Key Growth Recommendations")
        for r in report.get("recommendations", []):
            st.markdown(f"- {r}")

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("#### Phased Action Plan")
        steps = c_plan.get("action_plan_steps", [])
        for step in steps:
            if isinstance(step, dict):
                st.markdown(f"""
                <div class="evidence-card">
                    <span class="badge-pill badge-warning">{step.get('phase', 'Phase')}</span>
                    <h4 style="margin:6px 0 4px 0; color:#F8FAFC;">{step.get('focus', 'Focus')}</h4>
                    <p style="color: #94A3B8; margin:0;"><strong>Milestone:</strong> {step.get('actionable_milestone', 'Actionable goal')}</p>
                </div>
                """, unsafe_allow_html=True)

    with tab_interview:
        st.subheader("Recruiter & Hiring Manager Question Set")
        st.caption("Designed to verify stated achievements and probe ambiguous requirements without speculation.")
        
        det_qs = report.get("detailed_interview_qs", {})
        v_qs = det_qs.get("verification_questions", [])
        g_qs = det_qs.get("gap_exploration_questions", [])

        if v_qs:
            st.markdown("#### 🔎 Claim Verification Questions")
            for item in v_qs:
                if isinstance(item, dict):
                    st.markdown(f"""
                    <div class="evidence-card">
                        <strong>Q: {item.get('question', '')}</strong>
                        <p style="color: #94A3B8; margin:6px 0 2px 0; font-size:0.9rem;">🎯 <em>Target: {item.get('target_competency', 'Competency')}</em></p>
                        <p style="color: #60A5FA; margin:0; font-size:0.85rem;">📌 <em>Purpose: {item.get('purpose', '')}</em></p>
                    </div>
                    """, unsafe_allow_html=True)

        if g_qs:
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown("#### ❓ Gap & Adjacent Skill Exploration Questions")
            for item in g_qs:
                if isinstance(item, dict):
                    st.markdown(f"""
                    <div class="evidence-card" style="border-left: 3px solid #8B5CF6;">
                        <strong>Q: {item.get('question', '')}</strong>
                        <p style="color: #94A3B8; margin:6px 0 2px 0; font-size:0.9rem;">🎯 <em>Target: {item.get('target_competency', 'Competency')}</em></p>
                        <p style="color: #C084FC; margin:0; font-size:0.85rem;">📌 <em>Purpose: {item.get('purpose', '')}</em></p>
                    </div>
                    """, unsafe_allow_html=True)

    with tab_export:
        st.subheader("Export & Compliance Audit")
        st.json(report.get("anti_gravity_compliance", {}))
        
        col_exp1, col_exp2 = st.columns(2)
        with col_exp1:
            json_data = json.dumps(report, indent=2)
            st.download_button(
                label="📥 Download Full JSON Report",
                data=json_data,
                file_name=f"hiresense_report_{report.get('candidate_name', 'candidate').replace(' ', '_')}.json",
                mime="application/json",
                use_container_width=True
            )
        with col_exp2:
            md_summary = f"""# HireSense AI Evaluation Report
Candidate: {report.get('candidate_name')}
Target Role: {report.get('job_title')}
Match Score: {report.get('match_score')}% (Confidence: {report.get('confidence_level')})

## Explanation
{report.get('explanation')}

## Skills Matched
{', '.join(report.get('skills_matched', []))}

## Skill Gaps
{', '.join(report.get('skill_gaps', []))}

## Recommendations
{chr(10).join(['- ' + str(r) for r in report.get('recommendations', [])])}
"""
            st.download_button(
                label="📄 Download Markdown Summary",
                data=md_summary,
                file_name=f"hiresense_summary_{report.get('candidate_name', 'candidate').replace(' ', '_')}.md",
                mime="text/markdown",
                use_container_width=True
            )