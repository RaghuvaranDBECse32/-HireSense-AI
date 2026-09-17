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

st.set_page_config(
    page_title="HireSense AI – Intelligent Resume & Job Matcher",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for rich aesthetics and clean recruiter dashboard
st.markdown("""
<style>
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
        background-color: #064E3B;
        color: #6EE7B7;
        border: 1px solid #059669;
    }
    .badge-danger {
        background-color: #7F1D1D;
        color: #FCA5A5;
        border: 1px solid #DC2626;
    }
    .badge-warning {
        background-color: #78350F;
        color: #FCD34D;
        border: 1px solid #D97706;
    }
    .evidence-card {
        background-color: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .evidence-quote {
        font-style: italic;
        color: #93C5FD;
        border-left: 3px solid #3B82F6;
        padding-left: 10px;
        margin-top: 6px;
    }
    .metric-box {
        text-align: center;
        padding: 14px;
        background: rgba(15, 23, 42, 0.6);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
</style>
""", unsafe_allow_html=True)

# Sidebar: Controls & Grounding Status
with st.sidebar:
    st.image("https://img.icons8.com/isometric/100/compass.png", width=64)
    st.title("HireSense AI")
    st.caption("Anti-Gravity Reasoning Engine v1.0")
    
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
st.markdown('<div class="main-title">🧭 HireSense AI — Intelligent Resume & Job Matcher</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-title">Recruiter-grade candidate qualification, gap analysis, and interview planning firmly grounded in reality.</div>',
    unsafe_allow_html=True
)

# Input Section: Two columns
col_resume, col_jd = st.columns(2)

with col_resume:
    st.subheader("📄 Candidate Resume")
    resume_tab_text, resume_tab_pdf = st.tabs(["✍️ Paste Text", "📤 Upload PDF"])
    
    with resume_tab_text:
        resume_text_input = st.text_area(
            "Resume Content",
            value=st.session_state.get("resume_input", ""),
            height=280,
            placeholder="Paste raw resume text here...",
            key="resume_text_area"
        )
    
    with resume_tab_pdf:
        uploaded_pdf = st.file_uploader("Upload PDF Resume", type=["pdf"], key="pdf_uploader")
        if uploaded_pdf is not None:
            extracted_pdf_text = extract_text_from_pdf(uploaded_pdf.read())
            st.session_state["resume_input"] = extracted_pdf_text
            st.success(f"Extracted {len(extracted_pdf_text)} characters from {uploaded_pdf.name}")
            st.text_area("Extracted Preview", value=extracted_pdf_text[:500] + "...", height=150, disabled=True)

with col_jd:
    st.subheader("🎯 Job Description")
    jd_text_input = st.text_area(
        "Job Description Requirements",
        value=st.session_state.get("jd_input", ""),
        height=280,
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

# Display Results
if "analysis_report" in st.session_state:
    report = st.session_state["analysis_report"]
    st.markdown("---")
    
    # Top KPI Metrics Row
    m_col1, m_col2, m_col3, m_col4 = st.columns(4)
    with m_col1:
        st.markdown(
            f'<div class="metric-box"><h3>{report.get("match_score", 0)}%</h3><p style="color:#94A3B8;margin:0;">Match Alignment</p></div>',
            unsafe_allow_html=True
        )
    with m_col2:
        conf = report.get("confidence_level", "Medium")
        color = "#10B981" if conf.lower() == "high" else ("#F59E0B" if conf.lower() == "medium" else "#EF4444")
        st.markdown(
            f'<div class="metric-box"><h3 style="color:{color};">{conf}</h3><p style="color:#94A3B8;margin:0;">Evidence Confidence</p></div>',
            unsafe_allow_html=True
        )
    with m_col3:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:4px 0;">{report.get("candidate_name", "Candidate")[:22]}</h4><p style="color:#94A3B8;margin:0;">Candidate</p></div>',
            unsafe_allow_html=True
        )
    with m_col4:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:4px 0;">{report.get("job_title", "Position")[:22]}</h4><p style="color:#94A3B8;margin:0;">Target Role</p></div>',
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
            st.markdown("### ✅ Verified Strengths (with Citations)")
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
        
        # Matched Skills Pills
        st.markdown("#### 🟢 Verified Matched Skills")
        matched = report.get("skills_matched", [])
        if matched:
            pill_html = "".join([f'<span class="badge-pill badge-success">{s}</span>' for s in matched if s])
            st.markdown(pill_html, unsafe_allow_html=True)
        else:
            st.caption("No clear direct skill matches isolated.")

        st.markdown("<br>", unsafe_allow_html=True)
        # Missing Skills Pills
        st.markdown("#### 🔴 Unmet / Missing Job Requirements")
        gaps = report.get("skill_gaps", [])
        if gaps:
            gap_html = "".join([f'<span class="badge-pill badge-danger">{g}</span>' for g in gaps if g])
            st.markdown(gap_html, unsafe_allow_html=True)
        else:
            st.caption("All primary stated skills appear matched.")

        # Detailed breakdown table
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
                        <p style="color:#CBD5E1; margin:4px 0 0 0; font-size:0.9rem;">{amb.get('note', '')}</p>
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
                    <h4 style="margin:6px 0 2px 0;">{step.get('focus', 'Focus')}</h4>
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
                        <p style="color: #94A3B8; margin:4px 0 0 0; font-size:0.9rem;">🎯 <em>Target: {item.get('target_competency', 'Competency')}</em></p>
                        <p style="color: #60A5FA; margin:2px 0 0 0; font-size:0.85rem;">📌 <em>Purpose: {item.get('purpose', '')}</em></p>
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
                        <p style="color: #94A3B8; margin:4px 0 0 0; font-size:0.9rem;">🎯 <em>Target: {item.get('target_competency', 'Competency')}</em></p>
                        <p style="color: #C084FC; margin:2px 0 0 0; font-size:0.85rem;">📌 <em>Purpose: {item.get('purpose', '')}</em></p>
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
