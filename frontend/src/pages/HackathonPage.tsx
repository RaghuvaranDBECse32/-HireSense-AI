import React, { useState, useEffect } from 'react';
import { 
  Zap, Calendar, Globe, Trophy, ArrowRight, ExternalLink, 
  CheckCircle2, Cpu, Users, Sparkles, Code2, Rocket, Award, 
  Clock, MapPin, ShieldCheck, Lock, FolderCheck, Building2
} from 'lucide-react';
import aimoLogoBadge from '../assets/media/aimo-logo-badge.avif';
import aimoLogoMark from '../assets/media/aimo-logo-mark.svg';

export const HackathonPage: React.FC = () => {
  const [hackathonInfo, setHackathonInfo] = useState<any>(null);

  useEffect(() => {
    fetch('/api/hackathon/info')
      .then(r => r.json())
      .then(setHackathonInfo)
      .catch(console.error);
  }, []);

  const benefits = [
    { icon: Code2, title: 'Build an AI Product', desc: 'Turn your idea into a working product in just 2 days', color: 'sky' },
    { icon: Award, title: 'Portfolio-Worthy Project', desc: 'Showcase your skills with a real-world project for resumes & interviews', color: 'emerald' },
    { icon: Trophy, title: 'Compete for Cash Prizes', desc: 'Showcase your innovation and win recognition', color: 'amber' },
    { icon: Cpu, title: 'Hands-on AI Experience', desc: 'Solve real-world challenges with cutting-edge AI tools', color: 'purple' },
    { icon: Users, title: 'Network & Collaborate', desc: 'Connect with AI practitioners, product leaders, and fellow builders', color: 'indigo' },
    { icon: Rocket, title: 'Career Boost via HireSense AI', desc: 'Projects automatically map to your AI & Agentic skill tracks', color: 'rose' },
  ];

  const timeline = [
    { time: 'Day 1 — 19 Sept 2026', event: 'Kickoff & Ideation', desc: 'Form teams, choose your challenge, and start building.' },
    { time: 'Day 1 — Evening', event: 'Mentorship Sessions', desc: 'Get guidance from AI experts and product leaders.' },
    { time: 'Day 2 — 20 Sept 2026', event: 'Build & Demo', desc: 'Complete your project and present to judges.' },
    { time: 'Day 2 — Closing', event: 'Awards & Recognition', desc: 'Winners announced, prizes distributed, portfolio review.' },
  ];

  const collaborationLinks = [
    {
      label: 'AIMO Tamil Nadu State Board',
      href: 'https://aimotnsb.com/',
      display: 'aimotnsb.com',
      icon: Building2,
      tone: 'blue',
      desc: "Industry ecosystem partner for manufacturing, innovation, and employer connectivity."
    },
    {
      label: 'TECHKNOW 2026',
      href: 'https://techknow2026.in/#features',
      display: 'techknow2026.in',
      icon: Calendar,
      tone: 'amber',
      desc: 'Conference, exhibition, and mega job fair pathway for verified opportunities.'
    },
    {
      label: 'Agentic AI Hackathon',
      href: 'https://theproductspace.in/events/agentic-ai-hackathons',
      display: 'theproductspace.in',
      icon: Zap,
      tone: 'violet',
      desc: 'Product Space builder event for real AI product proof of work and portfolio evidence.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Hero Section */}
	      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 border border-violet-800/40 p-8 sm:p-12">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 blur-[100px] pointer-events-none rounded-full"></div>
        
	        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
	        <div className="space-y-6 lg:col-span-8">
          {/* Badges */}
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
            Agentic AI{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Hackathon
            </span>
          </h1>

	          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
	            Build AI products from scratch in 2 days. Product Space runs the builder sprint while HireSense AI connects the proof of work to AIMO, TECHKNOW 2026, and recruiter-ready career intelligence.
	          </p>

          {/* Event Quick Facts */}
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

          {/* CTAs */}
	          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://theproductspace.in/events/agentic-ai-hackathons"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-600 to-blue-600 hover:from-violet-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-violet-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              <span>Register Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
            <a
              href="https://theproductspace.in/events/agentic-ai-hackathons"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 shadow-md transition-all"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </a>
	          </div>
	        </div>
	        <div className="lg:col-span-4">
	          <div className="rounded-2xl bg-white/95 border border-white/80 p-5 shadow-2xl shadow-violet-950/40">
	            <img src={aimoLogoBadge} alt="AIMO Tamil Nadu State Board logo" className="w-32 h-32 object-contain mx-auto" />
	            <div className="mt-4 text-center">
	              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Collaboration Layer</div>
	              <div className="text-sm font-extrabold text-slate-950 font-['Outfit']">AIMO × TECHKNOW × Product Space</div>
	              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
	                A professional intake and portfolio-validation experience for hackathon builders and job-fair candidates.
	              </p>
	            </div>
	          </div>
	        </div>
	        </div>
	      </section>

      {/* HireSense × Hackathon Synergy */}
	      <section className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/70 px-3 py-1 rounded-full border border-violet-800/50">
            <Sparkles className="w-3.5 h-3.5" />
            HireSense AI × Product Space
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Build. Verify. Accelerate Your Career.
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            The Agentic AI Hackathon is officially integrated with HireSense AI. Your hackathon projects become verified portfolio evidence in your Career Intelligence Profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-violet-950/40 to-slate-900 border border-violet-800/40 space-y-3 group hover:border-violet-500/60 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Portfolio Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Projects you build during the hackathon are automatically imported as verified portfolio artifacts in your HireSense AI profile. Anti-Gravity rules ensure only real work is showcased.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-sky-950/40 to-slate-900 border border-sky-800/40 space-y-3 group hover:border-sky-500/60 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Skill Track Mapping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hackathon deliverables are mapped to the 5-Level AI & Agentic Systems track. Build a RAG pipeline? That's Level 3 evidence. Create a multi-agent system? Level 4–5 progress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-800/40 space-y-3 group hover:border-emerald-500/60 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Career Acceleration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TECHKNOW 2026 recruiters see hackathon projects in your Match Engine results. Demonstrable AI project experience increases your match score against agentic AI roles.
            </p>
          </div>
        </div>
	      </section>

	      {/* Private Resume Vault */}
	      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
	        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
	          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-full">
	            <Lock className="w-3.5 h-3.5" />
	            Admin-Only Resume Vault
	          </div>
	          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
	            Professional Private Submission Flow
	          </h2>
	          <p className="text-sm text-slate-400 leading-relaxed">
	            Candidates preview their resume inside HireSense AI before submission. After they submit, the file enters the restricted admin intake queue; candidates are not given Drive-folder access or a public file link.
	          </p>
	          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
	            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
	              <div className="text-emerald-300 font-bold">Restricted Storage</div>
	              <div className="text-slate-500 mt-1">Drive sharing remains admin-only.</div>
	            </div>
	            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
	              <div className="text-sky-300 font-bold">Candidate Preview</div>
	              <div className="text-slate-500 mt-1">View before submit, no folder browsing.</div>
	            </div>
	          </div>
	        </div>

	        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 p-6">
	          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
	            {[
	              { step: '01', title: 'Upload', desc: 'Candidate selects PDF and checks the local preview.' },
	              { step: '02', title: 'Submit', desc: 'HireSense AI receives the file through a controlled endpoint.' },
	              { step: '03', title: 'Review', desc: 'Admin reviews submissions from the protected intake queue.' },
	            ].map((item) => (
	              <div key={item.step} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
	                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold">
	                  {item.step}
	                </div>
	                <div>
	                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
	                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{item.desc}</p>
	                </div>
	              </div>
	            ))}
	          </div>
	        </div>
	      </section>

      {/* Benefits Grid */}
      <section className="space-y-6">
        <h2 className="text-center text-2xl font-extrabold text-white font-['Outfit']">
          Why Join the Hackathon?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            const colorMap: Record<string, string> = {
              sky: 'bg-sky-500/20 border-sky-500/30 text-sky-400',
              emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
              amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
              purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
              indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400',
              rose: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
            };
            return (
              <div key={i} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorMap[b.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <h2 className="text-center text-2xl font-extrabold text-white font-['Outfit']">
          Hackathon Timeline
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 border-2 border-violet-500/50 flex items-center justify-center text-violet-300 text-xs font-bold">
                  {i + 1}
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-violet-500/40 to-transparent mt-1"></div>
                )}
              </div>
              <div className="pb-6">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 mb-1">
                  {step.time}
                </div>
                <h3 className="text-sm font-bold text-white">{step.event}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Partners */}
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-xl font-extrabold text-white font-['Outfit']">
            Ecosystem Partners
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            HireSense AI bridges the AIMO-Anna University TECHKNOW 2026 ecosystem with the Product Space Agentic AI Hackathon.
          </p>
        </div>

	        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
	          {collaborationLinks.map((link, idx) => {
	            const Icon = link.icon;
	            const toneMap: Record<string, string> = {
	              blue: 'hover:border-blue-500/50 text-blue-300 border-blue-700/50 bg-blue-900/40 group-hover:text-blue-300',
	              amber: 'hover:border-amber-500/50 text-amber-300 border-amber-700/50 bg-amber-900/40 group-hover:text-amber-300',
	              violet: 'hover:border-violet-500/50 text-violet-300 border-violet-700/50 bg-violet-900/40 group-hover:text-violet-300',
	            };
	            return (
	              <a
	                key={link.label}
	                href={link.href}
	                target="_blank"
	                rel="noopener noreferrer"
	                className={`p-5 rounded-xl bg-slate-950/80 border border-slate-800 ${toneMap[link.tone].split(' ')[0]} transition group text-center space-y-2`}
	              >
	                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border ${toneMap[link.tone]} group-hover:scale-105 transition mx-auto overflow-hidden`}>
	                  {idx === 0 ? (
	                    <img src={aimoLogoBadge} alt="AIMO logo" className="w-full h-full object-contain bg-white" />
	                  ) : idx === 2 ? (
	                    <img src={aimoLogoMark} alt="" className="w-10 h-10 object-contain opacity-80" />
	                  ) : (
	                    <Icon className="w-6 h-6" />
	                  )}
	                </div>
	                <h3 className={`text-sm font-bold text-white ${toneMap[link.tone].split(' ').at(-1)} transition`}>{link.label}</h3>
	                <p className="text-[11px] text-slate-400 leading-relaxed">{link.desc}</p>
	                <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 font-medium">
	                  {link.display} <ExternalLink className="w-3 h-3" />
	                </span>
	              </a>
	            );
	          })}
	        </div>
	      </section>

      {/* Bottom CTA */}
      <section className="text-center space-y-4 pb-8">
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Ready to build? Join the Agentic AI Hackathon and let HireSense AI validate your skills in real-time.
        </p>
        <a
          href="https://theproductspace.in/events/agentic-ai-hackathons"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-600 to-blue-600 hover:from-violet-400 hover:to-blue-500 text-white font-bold text-sm shadow-2xl shadow-violet-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Zap className="w-5 h-5" />
          Register for Agentic AI Hackathon
          <ExternalLink className="w-4 h-4 opacity-60" />
        </a>
      </section>
    </div>
  );
};
