import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Globe, ExternalLink, Briefcase, 
  Award, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Layers, Edit3
} from 'lucide-react';
import { UserProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile/me');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading Professional & Career Intelligence Profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-white font-['Outfit']">
                AR
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  {profile.profile.full_name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Grounded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-400 font-medium mt-0.5">
                {profile.profile.headline}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.profile.location}
                </span>
                <span>•</span>
                <span className="text-slate-300 font-mono">{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile.profile.github && (
              <a href={profile.profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition">
                <span>GitHub</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.profile.linkedin && (
              <a href={profile.profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition">
                <span>LinkedIn</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.profile.portfolio && (
              <a href={profile.profile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition">
                <span>Portfolio</span> <Globe className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Career Intelligence Profile Callout Box */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-['Outfit']">
              <Sparkles className="w-3.5 h-3.5" /> Career Intelligence Profile
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Zero Guesswork
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Verified Skills</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                {profile.skills.filter(s => s.verified).length}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Evidence Strength</div>
              <div className="text-xl font-bold text-sky-400 font-mono mt-1">
                {profile.profile.readiness.evidence_strength}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Target Role Fit</div>
              <div className="text-xl font-bold text-purple-400 font-mono mt-1">
                {profile.profile.readiness.skill_alignment}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Interview Readiness</div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                {profile.profile.readiness.interview_readiness}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-sky-400" /> Work Experience
        </h2>

        <div className="space-y-4">
          {profile.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                <span className="text-xs text-slate-400 font-mono">{exp.dates}</span>
              </div>
              <div className="text-xs font-semibold text-sky-400">{exp.company}</div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {exp.description}
              </p>
              {exp.evidence_grounding && (
                <div className="text-[10px] text-emerald-400 font-mono pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {exp.evidence_grounding}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> Key Projects
        </h2>

        <div className="space-y-3">
          {profile.projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h3 className="text-sm font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {proj.description}
              </p>
              <div className="text-[11px] text-sky-400 font-mono pt-1">
                Technologies: {proj.technologies}
              </div>
              {proj.evidence_quote && (
                <div className="text-[10px] text-emerald-400 font-mono pt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded in resume project excerpt
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Future Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            AI & Agentic Systems Interests
          </h3>
          <p className="text-xs text-slate-300">
            {profile.profile.agentic_ai_interests || "Autonomous verification agents, anti-gravity reasoning engines."}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Quantum Technology Interests
          </h3>
          <p className="text-xs text-slate-300">
            {profile.profile.quantum_interests || "Foundational exploration of Qiskit and Quantum Machine Learning."}
          </p>
        </div>
      </div>
    </div>
  );
};
