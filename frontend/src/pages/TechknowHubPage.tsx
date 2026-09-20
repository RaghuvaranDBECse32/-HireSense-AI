import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, MapPin, DoorOpen, ShieldCheck, 
  ExternalLink, Phone, Mail, Award, CheckCircle2, AlertCircle, 
  Search, Filter, ChevronRight, Sparkles, User
} from 'lucide-react';
import { TechknowCompanyItem, JobItem } from '../types';

interface TechknowHubProps {
  onAnalyzeJob: (job: JobItem) => void;
}

export const TechknowHubPage: React.FC<TechknowHubProps> = ({ onAnalyzeJob }) => {
  const [activeSubTab, setActiveSubTab] = useState<'job_fair' | 'conference' | 'rooms'>('job_fair');
  const [companies, setCompanies] = useState<TechknowCompanyItem[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [events, setEvents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedVerification, setSelectedVerification] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compRes, roomRes, eventRes] = await Promise.all([
        fetch('/api/techknow/companies'),
        fetch('/api/techknow/rooms'),
        fetch('/api/techknow/events')
      ]);
      const compData = await compRes.json();
      const roomData = await roomRes.json();
      const eventData = await eventRes.json();
      setCompanies(compData);
      setRooms(roomData);
      setEvents(eventData);
    } catch (err) {
      console.error('Failed to load TECHKNOW data', err);
    } finally {
      setLoading(false);
    }
  };

  const branches = [
    'All', 'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 
    'Automobile', 'Mechatronics', 'AI', 'MBA'
  ];

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.event_information.eligible_branches.toLowerCase().includes(search.toLowerCase()) ||
      c.event_information.room.toLowerCase().includes(search.toLowerCase());

    const matchesBranch = selectedBranch === 'All' || c.event_information.eligible_branches.toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesVerif = selectedVerification === 'All' || c.verification_status === selectedVerification;

    return matchesSearch && matchesBranch && matchesVerif;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-700/60">
            <Calendar className="w-3.5 h-3.5" />
            Official Recruitment & Confluence Hub
          </div>
          <span className="text-xs text-slate-300 font-mono">
            Host: Anna University, Guindy Campus, Chennai
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            TECHKNOW 2026 Intelligence Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            All India Manufacturers' Organization (Tamil Nadu State Board) in collaboration with Anna University. 
            Industrial Research and Development Trust, Founded by Bharat Ratna Dr. Sir M. Visvesvaraya.
          </p>
        </div>

        {/* Date Separation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-800/40">
            <div className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
              MEGA JOB FAIR RECRUITMENT DRIVE
            </div>
            <div className="text-base font-bold text-white mt-1">19 September 2026</div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Vivekananda Auditorium, Anna University, Chennai
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-800/40">
            <div className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider">
              INTERNATIONAL CONFERENCE & EXPO
            </div>
            <div className="text-base font-bold text-white mt-1">25–26 September 2026</div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Vivekananda Auditorium, Guindy Campus, Chennai – 600025
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('job_fair')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeSubTab === 'job_fair'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Mega Job Fair Directory (13 Companies)
          </button>
          <button
            onClick={() => setActiveSubTab('rooms')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeSubTab === 'rooms'
                ? 'bg-sky-500 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Auditorium Room Directory (GF-101...)
          </button>
          <button
            onClick={() => setActiveSubTab('conference')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeSubTab === 'conference'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Conference Strategic Areas (25–26 Sept)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MEGA JOB FAIR DIRECTORY */}
      {activeSubTab === 'job_fair' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search company, industry, or room (e.g. Flipped.ai, Ashok Leyland, GF-102)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Verification:</span>
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="EVENT SHEET">EVENT SHEET</option>
                </select>
              </div>
            </div>

            {/* Branch Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">Branch:</span>
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                    selectedBranch === b
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompanies.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                {/* Header with verification pill */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                        Sheet Entry #{c.sheet_num}
                      </div>
                      <h3 className="text-lg font-bold text-white font-['Outfit']">
                        {c.name}
                      </h3>
                      <div className="text-xs text-slate-300 font-medium">
                        {c.industry}
                      </div>
                    </div>

                    {/* Verification Status Badge */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      c.verification_status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {c.verification_status === 'VERIFIED' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      {c.verification_status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.location}</span>
                  </div>
                </div>

                {/* 2 DISTINCT CONTAINERS: EVENT-SHEET vs INDEPENDENTLY VERIFIED */}
                <div className="space-y-3">
                  {/* Container 1: Event-Sheet Information */}
                  <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs space-y-1.5">
                    <div className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider flex items-center justify-between">
                      <span>Event-Sheet Information</span>
                      <span className="text-slate-400 font-normal">TECHKNOW Mega Job Fair</span>
                    </div>
                    <div>
                      <strong className="text-slate-200">Opportunity:</strong>{' '}
                      <span className="text-amber-200">{c.event_information.opportunity}</span>
                    </div>
                    <div>
                      <strong className="text-slate-200">Eligible Branches:</strong>{' '}
                      <span className="text-slate-300">{c.event_information.eligible_branches}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div>
                        <strong className="text-slate-200">Compensation:</strong>{' '}
                        <span className="text-emerald-400 font-semibold">{c.event_information.salary_stipend}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono border border-slate-800 font-bold">
                        <DoorOpen className="w-3 h-3 text-amber-400" />
                        Room: {c.event_information.room}
                      </div>
                    </div>
                  </div>

                  {/* Container 2: Independently Verified Company Information */}
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider flex items-center justify-between">
                      <span>Independently Verified Context</span>
                      <span className="text-slate-500 font-normal">Third-Party & Official Corporate Records</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {c.about_company}
                    </p>
                    {c.verified_information.notes && (
                      <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-900">
                        Audit Note: {c.verified_information.notes}
                      </div>
                    )}
                    {c.official_website && (
                      <div className="pt-1">
                        <a
                          href={c.official_website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                        >
                          Official Source <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Recruiter Contact if specified (e.g. Vidhya V at Flipped.ai) */}
                  {c.contact && (
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-1">
                      <div className="text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3" /> Job-Fair Employer Contact
                      </div>
                      <div className="font-semibold text-white">{c.contact.name} — {c.contact.designation}</div>
                      <div className="flex flex-wrap gap-4 text-slate-300 text-[11px] pt-0.5">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3 text-emerald-400" /> {c.contact.phone}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Mail className="w-3 h-3 text-sky-400" /> {c.contact.email}
                        </span>
                      </div>
                      {c.contact.note && (
                        <div className="text-[10px] text-indigo-300/80 italic">{c.contact.note}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action: Analyze My Fit */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Auditorium Room: {c.event_information.room}
                  </span>

                  <button
                    onClick={() => {
                      onAnalyzeJob({
                        id: c.id,
                        title: `${c.name} Graduate & Trainee Roles`,
                        company_name: c.name,
                        location: c.location,
                        work_mode: 'On-site',
                        job_type: c.event_information.opportunity.split('/')[0].trim(),
                        track: c.industry.includes('AI') ? 'AI Engineering' : 'Smart Manufacturing',
                        salary_range: c.event_information.salary_stipend,
                        education_required: c.event_information.eligible_branches,
                        is_techknow_opportunity: true,
                        techknow_room: c.event_information.room,
                        raw_jd_text: `Opportunity at ${c.name} for TECHKNOW 2026 Mega Job Fair. Eligible: ${c.event_information.eligible_branches}. Opportunity: ${c.event_information.opportunity}.`
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze My Fit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ROOM DIRECTORY */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Auditorium Room Assignments</h2>
              <p className="text-xs text-slate-400">
                Companies located across Ground Floor, First Floor, and Second Floor in Vivekananda Auditorium.
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              Never invent room assignments — strictly mapped to event sheet.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-amber-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {r.room_number}
                  </span>
                  <span className="text-[10px] text-slate-500">{r.floor}</span>
                </div>
                <div className="text-xs font-bold text-white">
                  {r.assigned_company || 'Unassigned / Overflow'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {r.building} • Cap: {r.capacity} candidates
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONFERENCE STRATEGIC AREAS */}
      {activeSubTab === 'conference' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-sky-400">
              TECHKNOW 2026 International Conference & Exhibition
            </div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              25–26 September 2026 • Guindy Campus
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Fostering industrial transformation, high-impact academia-industry research, and advanced technology transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Industrial Transformation",
                desc: "Autonomous factory workflows, predictive quality control, machine vision inspection, and agentic workflows in heavy manufacturing."
              },
              {
                title: "Semiconductor Ecosystem",
                desc: "Fabless design, advanced packaging, silicon verification, and workforce talent creation for South India's chip hub."
              },
              {
                title: "Skill Development & Curriculum",
                desc: "Bridging University engineering curricula with hands-on enterprise technology tracks and certified apprenticeships."
              },
              {
                title: "Industry-Institution Collaboration",
                desc: "Joint laboratories between Anna University engineering departments and premier Tamil Nadu industrial corporations."
              },
              {
                title: "Technology Transfer & Commercialization",
                desc: "Converting cutting-edge academic research and patents into commercially viable manufacturing technology."
              },
              {
                title: "Smart Manufacturing & Industrial Growth",
                desc: "Industry 4.0 adoption, robotic automation, digital twins, and sustainable green manufacturing standards."
              }
            ].map((area, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white">{area.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
