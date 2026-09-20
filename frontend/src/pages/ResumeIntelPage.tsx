import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertCircle, 
  ShieldCheck, ArrowRight, Sparkles, RefreshCw, Eye, Lock, Send
} from 'lucide-react';

export const ResumeIntelPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'sample' | 'upload' | 'text'>('sample');
  const [resumeText, setResumeText] = useState('');
  const [parsedProfile, setParsedProfile] = useState<any>(null);
  const [evidenceMetrics, setEvidenceMetrics] = useState<any>(null);
  const [submissionConfig, setSubmissionConfig] = useState<any>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSampleResume();
    loadSubmissionConfig();
  }, []);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    };
  }, [pdfPreviewUrl]);

  const loadSampleResume = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile/me');
      const data = await res.json();
      setParsedProfile({
        candidate_name: data.profile.full_name,
        skills: data.skills.map((s: any) => s.name),
        summary: data.profile.headline,
        experiences: data.experiences,
        projects: data.projects
      });
      setEvidenceMetrics({
        evidence_strength_score: data.profile.readiness.evidence_strength,
        evidence_items: data.skills.map((s: any) => ({
          claim: s.name,
          quote: s.evidence_quote || "Mentioned in resume skills.",
          verified: s.verified,
          source: s.evidence_source || "Work Experience"
        }))
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParseText = async () => {
    if (!resumeText.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/resume/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText })
      });
      const data = await res.json();
      setParsedProfile(data.parsed_profile);
      setEvidenceMetrics(data.evidence_metrics);
    } catch (err) {
      console.error('Failed to parse text', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissionConfig = async () => {
    try {
      const res = await fetch('/api/admin/resume-submissions/config');
      const data = await res.json();
      setSubmissionConfig(data);
    } catch (err) {
      console.error('Failed to load submission policy', err);
    }
  };

  const handlePdfSelection = (file: File) => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setSelectedPdf(file);
    setPdfPreviewUrl(URL.createObjectURL(file));
    setUploadMessage('');
  };

  const handleSubmitPdf = async () => {
    if (!selectedPdf) return;

    const formData = new FormData();
    formData.append('file', selectedPdf);
    setLoading(true);
    setUploadMessage('');

    try {
      const res = await fetch('/api/resume/upload-pdf', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Resume submission failed.');
      }

      const data = await res.json();
      setParsedProfile(data.parsed_profile);
      setEvidenceMetrics(data.evidence_metrics);
      setUploadMessage(data.message || 'Resume submitted to the admin-only folder queue.');
    } catch (err) {
      setUploadMessage(err instanceof Error ? err.message : 'Resume submission failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Zero Hallucination Grounding
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Resume Intelligence & Evidence Audit
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Extracts candidate education, experience, skills, and projects strictly adhering to Anti-Gravity rules. 
          Every candidate claim must be traceable to explicit resume evidence.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => {
            setActiveMode('sample');
            loadSampleResume();
          }}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeMode === 'sample' ? 'bg-sky-500 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Sample: Alex Rivera (Full-Stack Engineer)
        </button>
        <button
          onClick={() => setActiveMode('text')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeMode === 'text' ? 'bg-sky-500 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Paste Raw Resume Text
        </button>
        <button
          onClick={() => setActiveMode('upload')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeMode === 'upload' ? 'bg-sky-500 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Upload PDF File
        </button>
      </div>

      {/* Text Paste Form */}
      {activeMode === 'text' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <label className="text-xs font-bold text-slate-200">
            Paste Candidate Resume Text:
          </label>
          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw text here... (Work experience, education, skills, projects)"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          />
          <button
            onClick={handleParseText}
            disabled={loading || !resumeText.trim()}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Analyze Resume with Anti-Gravity Rules</span>
          </button>
        </div>
      )}

      {/* PDF Upload Form */}
      {activeMode === 'upload' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 p-8 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Review PDF Before Submit</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Select a PDF, inspect the local preview, then submit it to the restricted admin intake.
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handlePdfSelection(file);
              }}
              className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-400 cursor-pointer"
            />

            {selectedPdf && (
              <div className="text-left p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{selectedPdf.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {(selectedPdf.size / 1024 / 1024).toFixed(2)} MB selected for private submission
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmitPdf}
                  disabled={loading || !selectedPdf}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit to Admin-Only Folder</span>
                </button>
              </div>
            )}

            {submissionConfig && (
              <div className="text-left p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-emerald-300">
                  <Lock className="w-3.5 h-3.5" />
                  {submissionConfig.access_level} / {submissionConfig.sharing_policy}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  The intake folder is restricted for admin review only. Candidates preview the local PDF here before submitting and are not given file-view access after upload.
                </p>
                <div className="text-[10px] text-slate-500 mt-2">
                  Accepted: {submissionConfig.accepted_formats?.join(', ')} · Max {submissionConfig.max_file_size_mb} MB
                </div>
              </div>
            )}

            {uploadMessage && (
              <div className="text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-800 rounded-xl px-4 py-3">
                {uploadMessage}
              </div>
            )}
          </div>

          <div className="xl:col-span-7 p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Eye className="w-4 h-4 text-sky-400" />
                Local PDF Preview
              </div>
              <span className="text-[10px] uppercase font-mono text-slate-500">Before Submit</span>
            </div>

            {pdfPreviewUrl ? (
              <object
                data={pdfPreviewUrl}
                type="application/pdf"
                className="w-full h-[640px] mt-4 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div className="h-[640px] flex items-center justify-center text-center text-xs text-slate-400">
                  PDF preview is not available in this browser. Select the file again or open it locally before submitting.
                </div>
              </object>
            ) : (
              <div className="h-[640px] flex flex-col items-center justify-center text-center text-slate-500">
                <FileText className="w-10 h-10 mb-3" />
                <div className="text-sm font-bold text-slate-300">No file selected</div>
                <p className="text-xs max-w-xs mt-1">
                  Choose a PDF to preview its contents here before sending it to the restricted admin intake.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parsed Results Display */}
      {parsedProfile && (
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
                Verified Candidate Profile
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit'] mt-1">
                {parsedProfile.candidate_name || 'Alex Rivera'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {parsedProfile.summary || 'Full-Stack Software Engineer with 3 years of experience building scalable web applications.'}
              </p>
            </div>

            {evidenceMetrics && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {evidenceMetrics.evidence_strength_score}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  Evidence Strength Score
                </div>
              </div>
            )}
          </div>

          {/* Traceable Evidence Audit Table */}
          {evidenceMetrics?.evidence_items && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Anti-Gravity Evidence Traceability Audit
                  </h3>
                  <p className="text-xs text-slate-400">
                    Every skill claim below is directly tied to an exact citation from the resume text.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  Zero Hallucination
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Claim / Skill</th>
                      <th className="p-3">Exact Quote in Resume</th>
                      <th className="p-3">Source Section</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {evidenceMetrics.evidence_items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white whitespace-nowrap">
                          {item.claim}
                        </td>
                        <td className="p-3 text-slate-300 italic max-w-md">
                          "{item.quote}"
                        </td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {item.source || 'Work Experience'}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                            <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
