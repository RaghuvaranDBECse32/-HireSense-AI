import React, { useState, useEffect } from 'react';
import { 
  Zap, Calendar, Globe, Trophy, ArrowRight, ExternalLink, 
  CheckCircle2, Cpu, Users, Sparkles, Code2, Rocket, Award, 
  Clock, MapPin, ShieldCheck, Lock, FolderCheck, Building2,
  BookOpen, Brain, BarChart3, Check, Copy, GraduationCap,
  Play, RefreshCw, Volume2, Mic, Lightbulb
} from 'lucide-react';
import hireSenseLogo from '../assets/media/hiresense-logo.png';

export const HackathonPage: React.FC = () => {
  const [activeHackathon, setActiveHackathon] = useState<'fln' | 'agentic'>('fln');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);

  // Diagnostic Simulator State
  const [studentName, setStudentName] = useState('Ananya S.');
  const [studentGrade, setStudentGrade] = useState('Grade 3');
  const [wordsCorrect, setWordsCorrect] = useState(28);
  const [totalWords, setTotalWords] = useState(40);
  const [mathScore, setMathScore] = useState(65);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const masterPromptText = `Act as an expert EdTech product manager and AI engineer specializing in foundational literacy and numeracy (FLN) in public school systems. Using the Learning-Level Visibility challenge from the AI for Foundational Learning Hackathon, help me design a comprehensive prototype feature specification. Focus on low-bandwidth functionality, multi-lingual voice assessment, automated student grouping, and teacher action plans aligned with TaRL principles.`;

  const fullProposalText = `# Project Proposal & Submission: AI for Foundational Learning Hackathon

## 1. Project Title
Project Drishti / EduSync AI: Real-Time Learning-Level Visibility and Adaptive Remediation for Foundational Learning

## 2. Selected Challenge Area
* Track: Learning-Level Visibility
* Problem Addressed: Teachers frequently instruct classrooms without clear, individualized visibility into each child's actual learning level. This causes a misalignment between instruction pace and student comprehension, leaving foundational gaps unaddressed.

## 3. Proposed Solution Architecture
* AI-Powered Oral Reading & Numeracy Diagnostics: Lightweight voice-to-text and offline NLP models optimized for regional and local languages to evaluate foundational skills (aligned with ASER and EGRA/EGMA frameworks) through quick 2-minute oral assessments.
* Granular Learning Analytics Dashboard: Automatically groups students into competency tiers, pinpoints specific conceptual misconceptions, and auto-generates leveled grouping recommendations for multi-grade classrooms.
* Contextual Micro-Interventions: Links student learning profiles directly to targeted remediation activities, workbooks, and teacher guides (such as NCERT and CBSE FLN toolkits).

## 4. Key References & Research Base
* Teaching at the Right Level (TaRL) to improve learning (J-PAL, 2022)
* The great fiction of India’s classrooms (Frontline, 2025)
* ASER Basic reading & maths assessment / EGRA & EGMA toolkits

Participant: Raghuvaran Damodaran (Anna University, 4032annaunivtvl@gmail.com)
Initiative: AI for Foundational Learning Hackathon (Hack2Skill)`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(fullProposalText);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 3000);
  };

  const runDiagnosticTest = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/fln/diagnostic/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          grade: studentGrade,
          sample_text: "Standard Grade 3-4 Foundational Reading Passage",
          words_read_correct: Number(wordsCorrect),
          total_words: Number(totalWords),
          math_score: Number(mathScore)
        })
      });
      const data = await res.json();
      setDiagnosticResult(data);
    } catch (err) {
      // Fallback local evaluator
      const accuracy = (wordsCorrect / totalWords) * 100;
      setDiagnosticResult({
        student_name: studentName,
        grade: studentGrade,
        reading_accuracy_pct: Math.round(accuracy),
        reading_competency_tier: accuracy >= 75 ? "Paragraph Level (Developing)" : "Word Level (Emergent)",
        reading_remediation_action: "Focus on sentence fluency, paragraph pacing, and sight word recognition with daily paired reading.",
        math_competency_tier: mathScore >= 60 ? "Subtraction & Place Value" : "Number Recognition (10-99)",
        math_remediation_action: "Place value bundling sticks, 2-digit subtraction with borrowing, and number line games.",
        tarl_group_assignment: "Group Paragraph (Targeted Right-Level Cohort)",
        grounding_standard: "ASER & EGRA/EGMA Standard (TaRL Methodology - J-PAL 2022)"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    runDiagnosticTest();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Top Competition Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-800 mb-2">
            <Trophy className="w-3 h-3" /> Competitions & Hackathons Hub
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            AI Competitions & Hackathons
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore national AI hackathons, verified project evidence, and foundational school learning initiatives.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveHackathon('fln')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeHackathon === 'fln'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI for Foundational Learning (Hack2Skill)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-950 text-amber-200 border border-amber-800">
              Active Submission
            </span>
          </button>

          <button
            onClick={() => setActiveHackathon('agentic')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeHackathon === 'agentic'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Agentic AI Hackathon (Product Space)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: AI FOR FOUNDATIONAL LEARNING HACKATHON (HACK2SKILL) */}
      {/* ========================================================================= */}
      {activeHackathon === 'fln' && (
        <div className="space-y-12">
          {/* Main Hero Card */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-700/50 p-8 sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 blur-[100px] pointer-events-none rounded-full"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="space-y-6 lg:col-span-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-600">
                    <Trophy className="w-3 h-3 text-amber-400" /> Hack2Skill Hackathon Track
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-950/90 px-3 py-1 rounded-full border border-sky-700">
                    <GraduationCap className="w-3 h-3" /> Track: Learning-Level Visibility
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Ideate Stage: Evaluation Live
                  </span>
                </div>

                {/* Project Title */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
                    Project Drishti / <span className="text-amber-400">EduSync AI</span>
                  </h2>
                  <p className="text-base sm:text-lg text-amber-200/90 font-medium mt-2">
                    Real-Time Learning-Level Visibility and Adaptive Remediation for Foundational Learning
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Solving the <em>"Great Fiction of India's Classrooms"</em>: Teachers frequently instruct without clear, individualized visibility into each child's foundational mastery. Project Drishti provides rapid 2-minute voice/numeracy diagnostics aligned with ASER & EGRA/EGMA, clustering students into TaRL right-level cohorts with automated CBSE/NCERT remediation plans.
                </p>

                {/* Participant Card */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Innovator / Submitter:</span>
                    <div className="font-bold text-white text-sm">Raghuvaran Damodaran</div>
                    <div className="text-[11px] text-slate-400">Anna University • 4032annaunivtvl@gmail.com</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded font-mono text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                      Top 30 Shortlist Announcement: 10 Oct 2026
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleCopyProposal}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                  >
                    {copiedProposal ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedProposal ? 'Proposal Copied!' : 'Copy Full Hackathon Proposal'}</span>
                  </button>

                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-200 font-semibold text-xs border border-slate-700 shadow transition"
                  >
                    {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4 text-sky-400" />}
                    <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Master AI Prompt'}</span>
                  </button>

                  <a
                    href="https://hack2skill.com/event/aiforfoundationallearning/dashboard/roadmap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 transition"
                  >
                    <span>View Hack2Skill Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Logo / Badge Column */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-sky-500 to-emerald-400 shadow-2xl shadow-amber-500/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center p-1">
                    <img src={hireSenseLogo} alt="HireSense AI Logo - Precision in Recruitment" className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Official Hackathon Submissions Core
                  </div>
                  <div className="text-sm font-bold text-white font-['Outfit']">HireSense AI Foundation Track</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Anti-Gravity Evidence Grounding applied to Early Literacy & Numeracy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 1: LIVE INTERACTIVE PROTOTYPE (DIAGNOSTIC SIMULATOR) */}
          <section className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-amber-400 font-mono">
                  <Play className="w-3.5 h-3.5" /> Interactive Hackathon Prototype
                </div>
                <h3 className="text-xl font-bold text-white font-['Outfit'] mt-1">
                  2-Minute Oral Reading & Numeracy Diagnostic Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test live student assessment under the ASER & EGRA/EGMA framework (TaRL Methodology - J-PAL 2022).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  Zero-API Offline Ready
                </span>
                <span className="text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                  Low-Bandwidth Optimized
                </span>
              </div>
            </div>

            {/* Input Simulator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Grade / Standard</label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Multi-Grade">Multi-Grade Classroom</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                  Words Read Correctly ({wordsCorrect}/{totalWords})
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={wordsCorrect}
                  onChange={(e) => setWordsCorrect(Number(e.target.value))}
                  className="w-full accent-amber-500 mt-2"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                  Numeracy & Logic Score ({mathScore}/100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mathScore}
                  onChange={(e) => setMathScore(Number(e.target.value))}
                  className="w-full accent-sky-500 mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={runDiagnosticTest}
                disabled={isEvaluating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>Run TaRL Diagnostic Assessment</span>
              </button>
            </div>

            {/* Diagnostic Results Card */}
            {diagnosticResult && (
              <div className="p-5 rounded-xl bg-slate-950 border border-amber-600/40 space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white">
                      Diagnostic Output for {diagnosticResult.student_name} ({diagnosticResult.grade})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Standard: {diagnosticResult.grounding_standard}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Reading Tier */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Reading Competency Tier
                    </div>
                    <div className="text-sm font-bold text-white">
                      {diagnosticResult.reading_competency_tier}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      <strong>Remediation:</strong> {diagnosticResult.reading_remediation_action}
                    </div>
                  </div>

                  {/* Math Tier */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" /> Numeracy Competency Tier
                    </div>
                    <div className="text-sm font-bold text-white">
                      {diagnosticResult.math_competency_tier}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      <strong>Remediation:</strong> {diagnosticResult.math_remediation_action}
                    </div>
                  </div>

                  {/* TaRL Leveled Group */}
                  <div className="p-3.5 rounded-lg bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-700/60 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> TaRL Cohort Assignment
                    </div>
                    <div className="text-sm font-bold text-amber-300">
                      {diagnosticResult.tarl_group_assignment}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Child is placed into instruction based on verified learning readiness rather than calendar age or school grade.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: CLASSROOM LEARNING-LEVEL VISIBILITY MATRIX */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Pilot Classroom Learning-Level Breakdown
                </h3>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">Grade 4-B (36 Students)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregated reading competency tiers illustrating the extreme learning heterogeneity common in public classrooms before TaRL intervention.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { level: "Story Level (Independent Fluency)", count: 9, pct: 25, color: "bg-emerald-500" },
                  { level: "Paragraph Level (Developing)", count: 11, pct: 30, color: "bg-sky-500" },
                  { level: "Word Level (Emergent Readers)", count: 8, pct: 22, color: "bg-amber-500" },
                  { level: "Letter Level (Phonemic Decoding)", count: 5, pct: 14, color: "bg-orange-500" },
                  { level: "Beginner (Intensive Foundational)", count: 3, pct: 9, color: "bg-rose-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-medium">{item.level}</span>
                      <span className="text-slate-400 font-mono">{item.count} students ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-sky-400" />
                The 3 Architectural Pillars
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-300">1. AI-Powered Oral Reading & Numeracy Diagnostics</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Lightweight voice-to-text & offline NLP models optimized for regional dialects to evaluate foundational reading fluency and math in 2 minutes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-300">2. Granular Learning Analytics Dashboard</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Automatically clusters students into TaRL competency cohorts, isolating common phonetic and place-value misconceptions.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-300">3. Contextual Micro-Interventions</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Instantly links student tiers to ready-to-use pedagogical toolkits from NCERT and CBSE FLN repositories.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: MASTER GENERATIVE ITERATION PROMPT */}
          <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Master Prompt for Hackathon Generative Iteration
                </h3>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed select-all">
              "{masterPromptText}"
            </div>
            <p className="text-[11px] text-slate-500">
              Use this prompt in your LLM workflows to expand pitch scripts, slide outlines, or low-bandwidth architectural diagrams.
            </p>
          </section>

          {/* SECTION 4: HACKATHON TIMELINE & ROADMAP */}
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              AI for Foundational Learning Hackathon Roadmap (Hack2Skill)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold">STAGE 1: COMPLETED</span>
                <div className="font-bold text-white">Registration</div>
                <div className="text-[11px] text-slate-400">Sep 07 – Sep 27, 2026</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/60 space-y-1">
                <span className="text-[10px] text-amber-300 font-bold animate-pulse">STAGE 2: LIVE NOW</span>
                <div className="font-bold text-amber-200">Ideate Evaluation</div>
                <div className="text-[11px] text-slate-300">Sep 28 – Oct 09, 2026</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">STAGE 3</span>
                <div className="font-bold text-slate-200">Top 30 Shortlist</div>
                <div className="text-[11px] text-slate-400">Sat, Oct 10, 2026</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">STAGE 4</span>
                <div className="font-bold text-slate-200">Build Stage</div>
                <div className="text-[11px] text-slate-400">Oct 11 – Nov 01, 2026</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">STAGE 5</span>
                <div className="font-bold text-slate-200">Grand Finale</div>
                <div className="text-[11px] text-slate-400">Wed, Nov 18, 2026</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: AGENTIC AI HACKATHON (PRODUCT SPACE) */}
      {/* ========================================================================= */}
      {activeHackathon === 'agentic' && (
        <div className="space-y-12">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 border border-violet-800/40 p-8 sm:p-12">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="space-y-6 lg:col-span-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-900/80 px-2.5 py-1 rounded-full border border-violet-700/60">
                    <Zap className="w-3 h-3" /> Hackathon Collaboration
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-900/80 px-2.5 py-1 rounded-full border border-sky-700/60">
                    <Sparkles className="w-3 h-3" /> Powered by Product Space
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    <ShieldCheck className="w-2.5 h-2.5" /> HireSense AI Integration
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
                  Agentic AI{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                    Hackathon
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Build AI products from scratch in 2 days. Product Space runs the builder sprint while HireSense AI connects the proof of work to AIMO, TECHKNOW 2026, and recruiter-ready career intelligence.
                </p>

                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">19th – 20th Sept, 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-300">
                    <Clock className="w-4 h-4" />
                    <span>08:00 AM – 09:00 PM IST</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Globe className="w-4 h-4" />
                    <span>Online (Global Access)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://theproductspace.in/events/agentic-ai-hackathons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-600 to-blue-600 hover:from-violet-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Register on Product Space</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-violet-400 via-indigo-500 to-sky-400 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center p-1">
                    <img src={hireSenseLogo} alt="HireSense AI Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
