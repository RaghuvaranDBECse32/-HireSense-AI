import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, TrendingUp, 
  Layers, AlertTriangle, ArrowRight, BookOpen, Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

export const SkillIntelPage: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading verified skill intelligence matrix...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800 mb-2">
          <Award className="w-3.5 h-3.5" /> Verifiable Competency Graph
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Skill Gap & Evidence Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Every competency below is substantiated by direct resume evidence quotes. 
          Unsubstantiated claims are never converted into verified badges.
        </p>
      </div>

      {/* Top 4 Transparency Meters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
            Evidence Strength
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {profile.profile.readiness.evidence_strength}%
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {profile.skills.filter(s => s.verified).length} of {profile.skills.length} listed skills backed by explicit project/work quotes.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
            Skill Alignment
          </div>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">
            {profile.profile.readiness.skill_alignment}%
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Strong alignment with modern Backend, Microservices & FastAPI roles.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
            Interview Readiness
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">
            {profile.profile.readiness.interview_readiness}%
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            High readiness for technical architecture and claim-verification rounds.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
            Learning Progress
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {profile.profile.readiness.learning_progress}%
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Level 1 AI Foundations completed; active upskilling in Cloud Orchestration.
          </p>
        </div>
      </div>

      {/* Verified Skills Grid */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Outfit']">
            Verified Skill Portfolio ({profile.skills.length})
          </h2>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Claims Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.skills.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{s.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    {s.proficiency}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                </span>
              </div>

              {s.evidence_quote && (
                <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 italic">
                  "{s.evidence_quote}"
                </div>
              )}

              {s.evidence_source && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Evidence Source: {s.evidence_source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
