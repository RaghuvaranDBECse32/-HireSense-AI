"""HireSense AI - Streamlit Web Application.
Super Mario Retro Arcade Edition powered by Anti-Gravity Grounding.
"""

import os
import json
import streamlit as st
import streamlit.components.v1 as components
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
    page_title="HireSense AI – Super Mario Retro Arcade Edition",
    page_icon="🍄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Super Mario Retro Arcade UI Theme
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;600;700&display=swap');

    /* Global Mario Theme Overrides */
    .stApp {
        background-color: #5C94FC;
        background-image: linear-gradient(to bottom, #5C94FC 0%, #201560 100%);
        font-family: 'Inter', sans-serif;
        color: #FFFFFF;
    }
    
    /* Headers & Retro Font Accents */
    .mario-header-title {
        font-family: 'Press Start 2P', monospace;
        font-size: 1.6rem;
        color: #F8D000;
        text-shadow: 3px 3px #000000;
        margin-bottom: 10px;
        line-height: 1.4;
    }
    .mario-header-sub {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.75rem;
        color: #50CC50;
        text-shadow: 2px 2px #000000;
        margin-bottom: 20px;
    }

    /* Badges & Pills */
    .badge-pill {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        font-family: 'Press Start 2P', monospace;
        margin-right: 6px;
        margin-bottom: 6px;
        box-shadow: 2px 2px #000;
    }
    .badge-success { background-color: #00A800; color: #FFFFFF; border: 2px solid #000; }
    .badge-danger { background-color: #E83800; color: #FFFFFF; border: 2px solid #000; }
    .badge-warning { background-color: #F8D000; color: #000000; border: 2px solid #000; }

    /* Cards & Containers (Retro Game Box Style) */
    .collab-hero {
        border: 4px solid #000000;
        border-radius: 12px;
        padding: 24px;
        margin: 8px 0 20px 0;
        background: #000000;
        box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    }
    .partner-card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 14px;
        background: #D88000;
        box-shadow: 4px 4px 0px #000;
        height: 100%;
        color: #FFF;
    }
    .partner-card h4 {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.75rem;
        margin: 0 0 8px 0;
        color: #F8D000;
        text-shadow: 1px 1px #000;
    }
    .partner-card p {
        font-size: 0.85rem;
        margin: 0 0 10px 0;
        color: #FFF;
    }
    .vault-card {
        border: 3px solid #000;
        border-radius: 10px;
        padding: 16px;
        background: #00A800;
        box-shadow: 5px 5px 0px #000;
        color: #FFF;
    }
    .evidence-card {
        background: #202060;
        border: 3px solid #F8D000;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
        box-shadow: 3px 3px 0px #000;
    }
    .metric-box {
        text-align: center;
        padding: 14px;
        background: #000000;
        border: 3px solid #F8D000;
        border-radius: 8px;
        box-shadow: 4px 4px 0px #000;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar: Controls & Grounding Status
with st.sidebar:
    if os.path.exists(AIMO_LOGO_PATH):
        st.image(AIMO_LOGO_PATH, width=92)
    else:
        st.image("https://img.icons8.com/isometric/100/compass.png", width=64)
    
    st.markdown("### 🍄 HIRE-SENSE BROS")
    st.caption("AIMO × TECHKNOW 2026 × Product Space")

    st.link_button("AIMO Tamil Nadu State Board", AIMO_LINK, use_container_width=True)
    st.link_button("TECHKNOW 2026", TECHKNOW_LINK, use_container_width=True)
    st.link_button("Agentic AI Hackathon", HACKATHON_LINK, use_container_width=True)
    st.link_button("🚀 Advanced Vercel Prototype", GRAPHICAL_LINK, use_container_width=True)
    
    st.markdown("---")
    st.markdown("### ⚙️ POWER-UP CONFIG")
    
    user_api_key = st.text_input(
        "API Key (Gemini/Groq/OpenAI)",
        type="password",
        placeholder="Enter key or leave blank for Arcade Mode",
        help="Paste a Gemini (AIza...), Groq (gsk_...), or OpenAI (sk-...) key."
    )
    
    provider_name = get_active_provider(user_api_key)
    st.info(f"**Active Mode:**\n{provider_name}")
    
    st.markdown("---")
    st.markdown("### 🪙 COIN SAMPLES")
    if st.button("Load Mushroom Sample Data", use_container_width=True):
        try:
            with open("data/samples/sample_resume.txt", "r", encoding="utf-8") as f:
                st.session_state["resume_input"] = f.read()
            with open("data/samples/sample_jd.txt", "r", encoding="utf-8") as f:
                st.session_state["jd_input"] = f.read()
            st.success("Loaded Level 1 Cloud Engineer data!")
        except Exception as e:
            st.error(f"Could not load samples: {e}")

# Main Screen Header
st.markdown("""
<div class="collab-hero">
    <div>
        <span class="badge-pill badge-success">WORLD 1-1</span>
        <span class="badge-pill badge-warning">ADMIN VAULT</span>
        <span class="badge-pill badge-danger">SUPER COIN</span>
    </div>
    <div class="mario-header-title" style="margin-top: 14px;">HIRESENSE AI: SUPER MARIO EDITION</div>
    <div class="mario-header-sub">INTELLIGENT CAREER PLATFORM & LEVEL SELECTOR</div>
    <p style="color:#E2E8F0; font-size: 0.95rem; margin:0;">
        Welcome to the arcade workspace for TECHKNOW 2026 candidates, AIMO ecosystem employers, and Agentic AI Hackathon builders. 
        Evaluate resumes, dodge skill gaps, collect power-ups, and play the embedded mini-game!
    </p>
</div>
""", unsafe_allow_html=True)

# Partner & Advanced Prototype Cards Section
partner_col1, partner_col2, partner_col3, partner_col4 = st.columns(4)
with partner_col1:
    st.markdown("""
    <div class="partner-card">
        <h4>AIMO Board</h4>
        <p>Industry ecosystem partner for manufacturing and employer connectivity.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open AIMO", AIMO_LINK, use_container_width=True)

with partner_col2:
    st.markdown("""
    <div class="partner-card" style="background:#C84000;">
        <h4>TECHKNOW 2026</h4>
        <p>Conference, exhibition, and mega job fair pathway for opportunities.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open TECHKNOW", TECHKNOW_LINK, use_container_width=True)

with partner_col3:
    st.markdown("""
    <div class="partner-card" style="background:#008080;">
        <h4>Agentic Hackathon</h4>
        <p>Product Space builder event for proof of work and AI projects.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Open Hackathon", HACKATHON_LINK, use_container_width=True)

with partner_col4:
    st.markdown("""
    <div class="partner-card" style="background:#502080;">
        <h4>Vercel Prototype</h4>
        <p>Next-gen graphical interface deployed live on Vercel.</p>
    </div>
    """, unsafe_allow_html=True)
    st.link_button("Launch Prototype", GRAPHICAL_LINK, use_container_width=True)

st.markdown("<br>", unsafe_allow_html=True)

# Vault Submission Flow Section
vault_col1, vault_col2 = st.columns([1.3, 1])
with vault_col1:
    st.markdown("""
    <div class="vault-card">
        <h3 style="margin-top:0;color:#F8D000;font-family:'Press Start 2P';font-size:0.85rem;">🍄 PRIVATE SUBMISSION PIPE</h3>
        <p style="color:#FFF;margin-bottom:8px;font-size:0.9rem;line-height: 1.4;">
            Users preview the resume inside HireSense AI before entering the intake pipe. Files are handled through
            the secure admin queue; candidates do not browse the raw Drive repository.
        </p>
        <div style="font-size:0.75rem; color:#E2E8F0;">Restriction Level: ADMIN_ONLY / SECURE_VAULT</div>
    </div>
    """, unsafe_allow_html=True)

with vault_col2:
    st.info(
        "**Admin Note:** Keep the Google Drive folder restricted and use the app as the public submission interface."
    )
    st.caption(f"Admin storage link: {RESUME_DRIVE_LINK}")

st.markdown("---")

# Input Section: Two columns for Resume and JD
col_resume, col_jd = st.columns(2)

with col_resume:
    st.subheader("📄 Candidate Resume Pipe")
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
        st.caption("Select a PDF resume, review extracted text, then run analysis.")
        uploaded_pdf = st.file_uploader("Upload PDF Resume", type=["pdf"], key="pdf_uploader")
        if uploaded_pdf is not None:
            pdf_bytes = uploaded_pdf.read()
            extracted_pdf_text = extract_text_from_pdf(pdf_bytes)
            st.session_state["resume_input"] = extracted_pdf_text
            st.success(f"Ready for intake review: {uploaded_pdf.name}")
            st.write(f"Extracted **{len(extracted_pdf_text)}** characters for preview.")
            st.text_area(
                "Candidate Preview",
                value=extracted_pdf_text[:1200] + ("..." if len(extracted_pdf_text) > 1200 else ""),
                height=200,
                disabled=True
            )

with col_jd:
    st.subheader("🎯 Job Description Quest")
    st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
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
analyze_btn = st.button("🚀 START LEVEL: Run Grounded Analysis", type="primary", use_container_width=True)

if analyze_btn:
    if not effective_resume or not effective_jd:
        st.warning("⚠️ Please provide both a Resume and a Job Description to start the level!")
    else:
        with st.spinner("🍄 Powering Up Multi-Agent Pipeline (Parsing → Matching → Gaps → Roadmap → Interview)..."):
            try:
                report = analyze_resume_and_jd(
                    resume_text=effective_resume,
                    jd_text=effective_jd,
                    api_key=user_api_key.strip() if user_api_key else None
                )
                st.session_state["analysis_report"] = report
                st.success("🎉 STAGE CLEARED: Grounded Analysis Complete!")
            except Exception as e:
                st.error(f"Level error: {str(e)}")

# Display Results Dashboard & Embedded Mario Game Tab
if "analysis_report" in st.session_state:
    report = st.session_state["analysis_report"]
    st.markdown("---")
    st.subheader("📊 Mario Arcade Recruiter Dashboard")
    
    # Top KPI Metrics Row
    m_col1, m_col2, m_col3, m_col4 = st.columns(4)
    with m_col1:
        st.markdown(
            f'<div class="metric-box"><h2 style="margin:0; color:#F8D000; font-family:\'Press Start 2P\'; font-size:1.2rem;">{report.get("match_score", 0)}%</h2><p style="color:#94A3B8;margin:6px 0 0 0;font-size:0.75rem;">SCORE ALIGNMENT</p></div>',
            unsafe_allow_html=True
        )
    with m_col2:
        conf = report.get("confidence_level", "Medium")
        color = "#50CC50" if conf.lower() == "high" else ("#F8D000" if conf.lower() == "medium" else "#E83800")
        st.markdown(
            f'<div class="metric-box"><h2 style="margin:0; color:{color}; font-family:\'Press Start 2P\'; font-size:1.1rem;">{conf}</h2><p style="color:#94A3B8;margin:6px 0 0 0;font-size:0.75rem;">CONFIDENCE LVL</p></div>',
            unsafe_allow_html=True
        )
    with m_col3:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:0; color:#FFF; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.9rem;">{report.get("candidate_name", "Candidate")}</h4><p style="color:#94A3B8;margin:6px 0 0 0;font-size:0.75rem;">PLAYER 1</p></div>',
            unsafe_allow_html=True
        )
    with m_col4:
        st.markdown(
            f'<div class="metric-box"><h4 style="margin:0; color:#FFF; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:0.9rem;">{report.get("job_title", "Position")}</h4><p style="color:#94A3B8;margin:6px 0 0 0;font-size:0.75rem;">TARGET WORLD</p></div>',
            unsafe_allow_html=True
        )

    st.markdown("<br>", unsafe_allow_html=True)
    
    # Detailed Result Tabs including the Mini-Game & Vercel Prototype
    tab_overview, tab_skills, tab_career, tab_interview, tab_export, tab_game, tab_prototype = st.tabs([
        "🔍 Match & Evidence",
        "⚖️ Skills & Gaps Matrix",
        "📈 Actionable Career Plan",
        "🎯 Grounded Interview",
        "💾 Export Audit",
        "🎮 Play Mario Coin Game",
        "🌐 Advanced Prototype"
    ])

    with tab_overview:
        st.subheader("Executive Grounded Assessment")
        st.info(report.get("explanation", "Grounded analysis completed."))
        
        st.markdown("<br>", unsafe_allow_html=True)
        col_str, col_con = st.columns(2)
        
        with col_str:
            st.markdown("### ✅ Verified Power-Ups")
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
            st.markdown("### ⚠️ Hazards & Gaps")
            concerns = report.get("concerns", [])
            if concerns:
                for c in concerns:
                    if isinstance(c, dict):
                        st.markdown(f"""
                        <div class="evidence-card" style="border-color: #E83800;">
                            <strong>{c.get('item', 'Concern')}</strong>
                            <div class="evidence-quote" style="color: #FFA5A5; border-left-color: #E83800;">"{c.get('evidence', 'Absence verified against text')}"</div>
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
        st.markdown("#### 🔴 Missing Job Requirements")
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
            st.markdown("#### 🟡 Mystery Box Skills")
            for amb in ambiguous:
                if isinstance(amb, dict):
                    st.markdown(f"""
                    <div class="evidence-card" style="border-color: #F8D000;">
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
                <div class="evidence-card" style="border-color: #50CC50;">
                    <span class="badge-pill badge-warning">{step.get('phase', 'Phase')}</span>
                    <h4 style="margin:6px 0 4px 0; color:#F8D000;">{step.get('focus', 'Focus')}</h4>
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
            st.markdown("#### ❓ Gap Exploration Questions")
            for item in g_qs:
                if isinstance(item, dict):
                    st.markdown(f"""
                    <div class="evidence-card" style="border-color: #A855F7;">
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
                label="📥 Download JSON Report",
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

    with tab_game:
        st.subheader("🎮 Play Mario Coin Collector Mini-Game")
        st.markdown("Collect as many coins as you can before time runs out! Use the buttons to move Mario.")
        
        # Embedded HTML/JS playable Super Mario Mini-Game
        mario_game_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background: #5C94FC; margin: 0; font-family: 'Courier New', monospace; text-align: center; color: white; }
                canvas { background: #5C94FC; border: 4px solid #000; box-shadow: 4px 4px 0px #000; display: block; margin: 0 auto; }
                .ui { font-size: 16px; font-weight: bold; margin-bottom: 8px; text-shadow: 2px 2px #000; }
                button { background: #F8D000; border: 2px solid #000; padding: 8px 16px; font-weight: bold; cursor: pointer; box-shadow: 2px 2px #000; }
                button:active { transform: translate(2px, 2px); box-shadow: none; }
            </style>
        </head>
        <body>
            <div class="ui">SCORE: <span id="score">0</span> | TIME: <span id="timer">30</span></div>
            <canvas id="gameCanvas" width="600" height="250"></canvas>
            <div style="margin-top: 10px;">
                <button onclick="moveLeft()">◀ LEFT</button>
                <button onclick="jump()">▲ JUMP</button>
                <button onclick="moveRight()">RIGHT ▶</button>
                <button onclick="resetGame()">RESET</button>
            </div>
            <script>
                const canvas = document.getElementById("gameCanvas");
                const ctx = canvas.getContext("2d");
                
                let score = 0;
                let timeLeft = 30;
                let gameInterval, timerInterval;
                
                let mario = { x: 50, y: 170, width: 24, height: 32, vx: 0, vy: 0, speed: 5, grounded: true };
                let coin = { x: Math.random() * 500 + 50, y: 120, radius: 10, collected: false };
                
                function startGame() {
                    score = 0;
                    timeLeft = 30;
                    document.getElementById("score").innerText = score;
                    document.getElementById("timer").innerText = timeLeft;
                    
                    clearInterval(gameInterval);
                    clearInterval(timerInterval);
                    
                    gameInterval = setInterval(update, 1000 / 60);
                    timerInterval = setInterval(() => {
                        timeLeft--;
                        document.getElementById("timer").innerText = timeLeft;
                        if (timeLeft <= 0) {
                            clearInterval(gameInterval);
                            clearInterval(timerInterval);
                            alert("Time's Up! Final Score: " + score);
                        }
                    }, 1000);
                }
                
                function update() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw Ground
                    ctx.fillStyle = "#C84000";
                    ctx.fillRect(0, 210, canvas.width, 40);
                    ctx.fillStyle = "#00A800";
                    ctx.fillRect(0, 210, canvas.width, 10);
                    
                    // Mario Physics
                    mario.x += mario.vx;
                    if (mario.x < 0) mario.x = 0;
                    if (mario.x > canvas.width - mario.width) mario.x = canvas.width - mario.width;
                    
                    if (!mario.grounded) {
                        mario.vy += 0.6; // gravity
                        mario.y += mario.vy;
                        if (mario.y >= 178) {
                            mario.y = 178;
                            mario.grounded = true;
                            mario.vy = 0;
                        }
                    }
                    
                    // Draw Mario (Retro Red Block style)
                    ctx.fillStyle = "#E83800";
                    ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
                    ctx.fillStyle = "#FAD090"; // face
                    ctx.fillRect(mario.x + 12, mario.y + 4, 10, 10);
                    
                    // Draw Coin
                    if (!coin.collected) {
                        ctx.fillStyle = "#F8D000";
                        ctx.beginPath();
                        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#000";
                        ctx.stroke();
                        
                        // Collision check
                        let dx = (mario.x + mario.width/2) - coin.x;
                        let dy = (mario.y + mario.height/2) - coin.y;
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 20) {
                            score += 10;
                            document.getElementById("score").innerText = score;
                            coin.x = Math.random() * 500 + 50;
                            coin.y = Math.random() * 80 + 90;
                        }
                    }
                }
                
                function moveLeft() { mario.x -= 15; }
                function moveRight() { mario.x += 15; }
                function jump() {
                    if (mario.grounded) {
                        mario.vy = -11;
                        mario.grounded = false;
                    }
                }
                function resetGame() { startGame(); }
                
                startGame();
            </script>
        </body>
        </html>
        """
        components.html(mario_game_html, height=340)

    with tab_prototype:
        st.subheader("🌐 Advanced Graphical Prototype Viewer")
        st.markdown("Interact directly with your live Vercel prototype below, or launch it in a new window.")
        st.link_button("🚀 Open Prototype in New Window", GRAPHICAL_LINK, use_container_width=True)
        st.markdown("<br>", unsafe_allow_html=True)
        components.iframe(GRAPHICAL_LINK, height=750, scrolling=True)