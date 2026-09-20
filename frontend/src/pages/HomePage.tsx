import React from 'react';
import { 
  Compass, ArrowRight, ShieldCheck, Cpu, Sparkles, Building2, 
  Layers, CheckCircle2, TrendingUp, Calendar, MapPin, Search, Users, ExternalLink, Award
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectJobForMatch?: (jobId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/20 to-purple-600/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          {/* Organization & Partnership Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-200">
              AIMO Tamil Nadu State Board & Anna University
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-sky-400 font-medium">
              TECHKNOW 2026 Confluence
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto font-['Outfit']">
            Your Career, Powered by <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Intelligence.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand your job fit, prove your skills, close your gaps, and prepare for the future of AI, agentic systems, quantum technology and industry.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Build My Career Intelligence Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('techknow')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Explore TECHKNOW 2026 Jobs</span>
            </button>
          </div>

          {/* Event Separation Banner Cards */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            <div 
              onClick={() => setActiveTab('techknow')}
              className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 cursor-pointer hover:border-amber-500/60 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  RECRUITMENT MEGA-DRIVE
                </span>
                <span className="text-xs font-bold text-amber-300">19 Sept 2026</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300 transition">
                TECHKNOW 2026 MEGA JOB FAIR
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Vivekananda Auditorium, Anna University, Chennai
              </p>
              <div className="text-[11px] text-amber-400/90 font-medium mt-2 flex items-center gap-1">
                Browse 13 Companies, Rooms & Vacancies <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('techknow')}
              className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900 border border-sky-800/40 cursor-pointer hover:border-sky-500/60 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/50">
                  INTERNATIONAL CONFLUENCE
                </span>
                <span className="text-xs font-bold text-sky-300">25–26 Sept 2026</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-2 group-hover:text-sky-300 transition">
                TECHKNOW 2026 Conference & Expo
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Vivekananda Auditorium, Guindy Campus, Chennai – 600025
              </p>
              <div className="text-[11px] text-sky-400/90 font-medium mt-2 flex items-center gap-1">
                AI Industrial Transformation & Semiconductor Expo <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT DIFFERENTIATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/70 px-3 py-1 rounded-full border border-sky-800/50">
            <Compass className="w-3.5 h-3.5" />
            Product Differentiation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Not Just Another Job Portal
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional portals focus on mass resumes. LinkedIn focuses on social networking. 
            HireSense AI provides rigorous, evidence-grounded career intelligence.
          </p>
        </div>

        {/* 3-Way Journey Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Traditional */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Traditional Job Portal</div>
            <div className="text-sm font-semibold text-slate-300">Search → Apply → Wait</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Black-box resume drops into ATS databases with no feedback, no gap explanations, and opaque keyword rejection filters.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Outcome: High anxiety & low feedback
            </div>
          </div>

          {/* LinkedIn */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">LinkedIn</div>
            <div className="text-sm font-semibold text-slate-300">Connect → Network → Apply</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized for social engagement, algorithmic feeds, and broad networking rather than precise, verifiable technical skill match analysis.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Outcome: Social networking first
            </div>
          </div>

          {/* HireSense AI */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-sky-950/60 to-slate-900 border-2 border-sky-500/50 space-y-3 shadow-lg shadow-sky-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> HireSense AI
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">ANTI-GRAVITY</span>
            </div>
            <div className="text-xs font-bold text-sky-300 leading-tight">
              Upload Resume → Understand Fit → Verify Evidence → Identify Gaps → Improve → Prepare → Apply → Track Progress
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every match is grounded in verifiable evidence quotes. Explains exactly what's matched, missing, and ambiguous with targeted roadmaps.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-mono font-medium">
              Outcome: Explainable fit & proven readiness
            </div>
          </div>
        </div>

        {/* Six Differentiation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center mb-4 text-sky-400 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">1. Evidence, Not Guesswork</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces strict Anti-Gravity rules. Never hallucinates jobs, tools, or metrics. Every skill claim is traceable to direct resume quotes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-105 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">2. AI Career Agents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              10 specialized agents coordinate your evaluation—from Resume Parsing and Evidence Verification to Interview Simulation and Roadmaps.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">3. Explainable Job Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never just a blind percentage score. Clear classification into MATCHED (green), MISSING (red), and AMBIGUOUS (amber) with confidence ratings.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-105 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">4. Skill Gap Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies concrete missing requirements and maps them to actionable, realistic project milestones instead of generic buzzword advice.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">5. Future Technology Tracks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated exploration of 5-Level AI & Agentic Systems and 7-Topic Quantum Technology. Clearly separates current verified skills from future milestones.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition group">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center mb-4 text-sky-400 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">6. TECHKNOW Industry Connect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct access to the 13 TECHKNOW employers, room directory (GF-101... ), interview contacts (e.g. Vidhya V at Flipped.ai), and verified vacancies.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK INTERACTIVE TEASER: Alex Rivera Sample Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Demo Profile Loaded: Alex Rivera
              </div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Experience Career Intelligence in Action
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alex's resume has been audited by the Anti-Gravity parser. Verified production experience in <strong>Python, FastAPI, PostgreSQL, and Docker</strong> serving 100k daily requests at CloudScale Systems.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] bg-slate-800 text-sky-300 px-2.5 py-1 rounded-md font-mono border border-slate-700">
                  Evidence Strength: 92%
                </span>
                <span className="text-[11px] bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-md font-mono border border-slate-700">
                  Readiness: 85%
                </span>
                <span className="text-[11px] bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md font-mono border border-slate-700">
                  Skill Alignment: 88%
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Run Match on TECHKNOW Jobs
              </button>
              <button
                onClick={() => setActiveTab('copilot')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4 text-purple-400" /> Ask AI Career Copilot
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
