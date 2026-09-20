import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, ArrowRight, Sparkles, FileText, ChevronDown, 
  HelpCircle as QuestionIcon, ListCheck, BookOpen, Layers
} from 'lucide-react';
import { MatchAnalysisResult, JobItem } from '../types';

interface MatchEnginePageProps {
  selectedJob: JobItem | null;
  onGoToCopilot: () => void;
  onGoToApplications: () => void;
}

export const MatchEnginePage: React.FC<MatchEnginePageProps> = ({ 
  selectedJob,
  onGoToCopilot,
  onGoToApplications
}) => {
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'MATCHED' | 'MISSING' | 'AMBIGUOUS'>('ALL');
  const [activeTab, setActiveTab] = useState<'gaps' | 'interview' | 'tailoring' | 'strategy'>('gaps');

  useEffect(() => {
    runAnalysis();
  }, [selectedJob]);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/match/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: selectedJob?.id || 1,
          jd_text: selectedJob?.raw_jd_text
        })
      });
      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error('Failed to run match analysis', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mx-auto"></div>
        <div className="text-sm font-bold text-white font-['Outfit']">
          Executing Anti-Gravity Grounded Matching Engine...
        </div>
        <p className="text-xs text-slate-400">
          Comparing candidate verified resume claims against job description requirements without hallucination.
        </p>
      </div>
    );
  }

  if (!matchResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Could not load match results. Please try again.
      </div>
    );
  }

  const filteredGaps = matchResult.skill_gaps.filter((g) => {
    if (filterType === 'ALL') return true;
    return g.classification === filterType;
  });

  const matchedCount = matchResult.skill_gaps.filter(g => g.classification === 'MATCHED').length;
  const missingCount = matchResult.skill_gaps.filter(g => g.classification === 'MISSING').length;
  const ambiguousCount = matchResult.skill_gaps.filter(g => g.classification === 'AMBIGUOUS').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Target Job Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-800 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            Explainable Job Match Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {selectedJob ? selectedJob.title : 'Senior Backend Engineer (Python / Cloud)'}
          </h1>
          <div className="text-xs text-slate-300 mt-1">
            Target Company: <strong>{selectedJob ? selectedJob.company_name : 'CloudScale Systems'}</strong> • Candidate: <strong>Alex Rivera</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToCopilot}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            Ask Copilot About Fit
          </button>
          <button
            onClick={onGoToApplications}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white transition shadow"
          >
            Track in Applications
          </button>
        </div>
      </div>

      {/* Primary Scorecard: Transparent & Explainable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Ring & Confidence */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Overall Match Calibration</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                matchResult.confidence_level === 'High' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {matchResult.confidence_level} Confidence
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {matchResult.match_score}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Grounded Fit Score</span>
            </div>

            {/* Visual progress bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mt-4 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${matchResult.match_score}%` }}
              ></div>
            </div>
          </div>

          {/* Breakdown summary pills */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
              <div className="text-lg font-bold text-emerald-400 font-mono">{matchedCount}</div>
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Matched</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/60">
              <div className="text-lg font-bold text-rose-400 font-mono">{missingCount}</div>
              <div className="text-[10px] text-rose-300 uppercase font-semibold">Missing</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-900/60">
              <div className="text-lg font-bold text-amber-400 font-mono">{ambiguousCount}</div>
              <div className="text-[10px] text-amber-300 uppercase font-semibold">Ambiguous</div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Anti-Gravity Check: Grounded in candidate resume & active JD only.</span>
          </div>
        </div>

        {/* Concrete Explanation & Strengths/Concerns */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Match Explanation with Direct Evidence
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              {matchResult.explanation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Strengths */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Verified Strengths
              </div>
              <div className="space-y-1.5">
                {matchResult.strengths.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5">
                    <div className="font-bold text-slate-200">{s.item}</div>
                    <div className="text-[11px] text-slate-400 italic">"{s.evidence}"</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Grounded Gaps / Concerns
              </div>
              <div className="space-y-1.5">
                {matchResult.concerns.map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5">
                    <div className="font-bold text-slate-200">{c.item}</div>
                    <div className="text-[11px] text-rose-300">{c.evidence}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Detailed Insights */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'gaps' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Skill Gap Breakdown ({matchResult.skill_gaps.length})
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'interview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Interview Questions (6 Types)
          </button>
          <button
            onClick={() => setActiveTab('tailoring')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'tailoring' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Resume Tailoring Advice
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'strategy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Application Strategy & Checklist
          </button>
        </div>

        {/* TAB 1: SKILL GAP BREAKDOWN */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase">Filter:</span>
              {(['ALL', 'MATCHED', 'MISSING', 'AMBIGUOUS'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    filterType === t
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2.5 ${
                    gap.classification === 'MATCHED'
                      ? 'bg-emerald-950/15 border-emerald-800/40'
                      : gap.classification === 'MISSING'
                      ? 'bg-rose-950/15 border-rose-800/40'
                      : 'bg-amber-950/15 border-amber-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">
                      {gap.requirement}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      gap.classification === 'MATCHED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : gap.classification === 'MISSING'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {gap.classification}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="text-slate-300 font-medium">Candidate Evidence:</div>
                    <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                      "{gap.candidate_evidence}"
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Action:</strong> {gap.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INTERVIEW QUESTIONS (6 TYPES) */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200">
              Questions drafted by the <strong>Interview Agent</strong> based strictly on candidate project claims and target JD requirements.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchResult.interview_questions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                      {q.category} Question
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                  </div>

                  <div className="text-sm font-semibold text-white leading-snug">
                    "{q.question}"
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div><strong className="text-slate-300">Grounded Context:</strong> {q.grounded_context}</div>
                    {q.evaluation_criteria && (
                      <div><strong className="text-purple-400">Evaluates:</strong> {q.evaluation_criteria}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESUME TAILORING */}
        {activeTab === 'tailoring' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200">
              Anti-Gravity Tailoring Policy: Recommendations emphasize your existing verifiable experience. <strong>Never fabricate unearned accomplishments or senior titles.</strong>
            </div>

            <div className="space-y-3">
              {matchResult.resume_tailoring.tailoring_recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-sky-400 font-mono uppercase">
                    {rec.section}
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    {rec.suggestion}
                  </div>
                  <div className="text-[11px] text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-900/50 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Anti-Gravity Rule:</strong> {rec.anti_gravity_warning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATION STRATEGY */}
        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Recommended Strategy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {matchResult.application_strategy.submission_strategy}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListCheck className="w-4 h-4 text-emerald-400" /> Pre-Submission Checklist
              </h3>
              <div className="space-y-2">
                {matchResult.application_strategy.pre_submission_checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-slate-200">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
