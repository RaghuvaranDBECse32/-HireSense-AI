import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Building2, Briefcase, DollarSign, 
  Sparkles, CheckCircle2, ChevronRight, ArrowUpDown, DoorOpen, ShieldCheck 
} from 'lucide-react';
import { JobItem } from '../types';

interface DiscoverJobsPageProps {
  onAnalyzeJob: (job: JobItem) => void;
}

export const DiscoverJobsPage: React.FC<DiscoverJobsPageProps> = ({ onAnalyzeJob }) => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [techknowOnly, setTechknowOnly] = useState(false);
  const [sortByRelevance, setSortByRelevance] = useState(false);

  const tracks = [
    'All', 'AI Engineering', 'Agentic AI', 'Quantum', 'Cloud', 
    'Backend', 'Full Stack', 'Smart Manufacturing', 'Engineering'
  ];

  const jobTypes = ['All', 'Regular Job', 'Internship', 'Apprenticeship'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.techknow_room && job.techknow_room.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTrack = selectedTrack === 'All' || job.track.toLowerCase().includes(selectedTrack.toLowerCase());
    const matchesType = selectedType === 'All' || job.job_type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesTechknow = !techknowOnly || job.is_techknow_opportunity;

    return matchesSearch && matchesTrack && matchesType && matchesTechknow;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-800 mb-2">
            <Briefcase className="w-3 h-3" /> Job Discovery & Matching
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Explore Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover roles across TECHKNOW 2026 employers, high-growth startups, and future technology tracks.
          </p>
        </div>

        {/* Action: Find Jobs Relevant to Me */}
        <button
          onClick={() => {
            setSortByRelevance(true);
            setTechknowOnly(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Find Jobs Relevant to Me (Anti-Gravity Fit)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, company name, skill, location, or TECHKNOW room (e.g., GF-101)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        {/* Track Filter Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3 h-3" /> Technology Track
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedTrack === track
                    ? 'bg-sky-500 text-white font-semibold shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Opportunity Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={techknowOnly}
                onChange={(e) => setTechknowOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500/20"
              />
              <span className="font-semibold text-amber-300">TECHKNOW 2026 Mega Job Fair Only</span>
            </label>
          </div>

          <div className="text-slate-400 text-[11px]">
            Showing <strong className="text-white">{filteredJobs.length}</strong> opportunities
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading vetted opportunities...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
          <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No jobs match the selected filters</p>
          <p className="text-xs text-slate-500">Try clearing your search term or selecting 'All' technology tracks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company_name}</span>
                    </div>
                  </div>

                  {job.is_techknow_opportunity && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded">
                      TECHKNOW 2026
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.work_mode}</span>
                  <span>•</span>
                  <span>{job.job_type}</span>
                </div>

                {job.techknow_room && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
                    <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Job Fair Room: <strong>{job.techknow_room}</strong> (Vivekananda Auditorium)</span>
                  </div>
                )}

                {job.education_required && (
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Eligibility / Branches:</strong> {job.education_required}
                  </div>
                )}

                {job.salary_range && (
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  Track: {job.track}
                </div>

                <button
                  onClick={() => onAnalyzeJob(job)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-semibold transition group-hover:border-sky-500"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Analyze My Fit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
