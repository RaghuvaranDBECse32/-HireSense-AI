import React from 'react';
import { Compass, ShieldCheck, Award, ExternalLink, Calendar, MapPin } from 'lucide-react';

export const Footer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-auto">
      {/* Top Banner: Official Ecosystem & Positioning */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-800/50">
              <Compass className="w-3.5 h-3.5" />
              HIRESENSE AI — CORE POSITIONING
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-200 leading-relaxed font-['Outfit']">
              "LinkedIn helps you connect. Job portals help you apply. HireSense AI helps you understand your fit, close your gaps, and prepare for what comes next."
            </p>
            <p className="text-xs text-slate-400">
              The core product loop: <span className="text-slate-300 font-medium">Resume → Evidence → Job → AI Agents → Explainable Match → Skill Gaps → Learning → Interview → Application → Career Progress</span>
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Event Calendar Separation</span>
              <span className="text-emerald-400 font-mono">Anna University</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    TECHKNOW 2026 MEGA JOB FAIR
                  </span>
                  <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px]">19 Sept 2026</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> Vivekananda Auditorium, Anna University, Chennai
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    TECHKNOW 2026 Conference & Expo
                  </span>
                  <span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded font-mono text-[10px]">25–26 Sept 2026</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> Vivekananda Auditorium, Anna University, Guindy Campus, Chennai
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Compass className="w-4 h-4 text-sky-400" />
              </div>
              <span className="font-bold text-white text-base font-['Outfit']">HireSense AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An enterprise-grade, AI-native career platform grounded in verifiable resume evidence.
              Joint initiative engineered in collaboration with All India Manufacturers' Organization (AIMO)
              and Anna University for TECHKNOW 2026.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div><strong>Organization:</strong> All India Manufacturers' Organization (TNSB)</div>
              <div><strong>Trust:</strong> Industrial Research and Development Trust</div>
              <div><strong>Founded by:</strong> Bharat Ratna Dr. Sir M. Visvesvaraya</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('jobs')} className="hover:text-white transition">Discover Jobs</button></li>
              <li><button onClick={() => setActiveTab('copilot')} className="hover:text-white transition">AI Career Copilot</button></li>
              <li><button onClick={() => setActiveTab('resume')} className="hover:text-white transition">Resume Intelligence</button></li>
              <li><button onClick={() => setActiveTab('skills')} className="hover:text-white transition">Skill Gap Intelligence</button></li>
              <li><button onClick={() => setActiveTab('applications')} className="hover:text-white transition">Application Tracker</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Future Tech Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('ai-agents')} className="hover:text-white transition">AI & Agentic Systems (5 Levels)</button></li>
              <li><button onClick={() => setActiveTab('quantum')} className="hover:text-white transition">Quantum Career Explorer (7 Topics)</button></li>
              <li><button onClick={() => setActiveTab('learning')} className="hover:text-white transition">Personalized Roadmaps</button></li>
              <li><button onClick={() => setActiveTab('profile')} className="hover:text-white transition">Career Readiness Metrics</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              TECHKNOW 2026
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('techknow')} className="hover:text-white transition">Mega Job Fair (19 Sept)</button></li>
              <li><button onClick={() => setActiveTab('techknow')} className="hover:text-white transition">13 Company Directory</button></li>
              <li><button onClick={() => setActiveTab('techknow')} className="hover:text-white transition">Room Directory (GF-101...)</button></li>
              <li><button onClick={() => setActiveTab('techknow')} className="hover:text-white transition">Verified Opportunities</button></li>
              <li><button onClick={() => setActiveTab('techknow')} className="hover:text-white transition">Recruiter Directory (Vidhya V)</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Gravity Grounding Policy Enforced: Zero Hallucination • Calibrated Confidence</span>
          </div>
          <div>
            © 2026 HireSense AI • AIMO (Tamil Nadu State Board) & Anna University. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
