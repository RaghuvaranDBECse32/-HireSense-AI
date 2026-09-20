import React from 'react';
import { 
  Compass, ShieldCheck, Briefcase, Bot, FileText, Cpu, 
  Sparkles, Award, User, Layers, Calendar, CheckCircle2, ChevronDown, ExternalLink
} from 'lucide-react';
import aimoLogoBadge from '../assets/media/aimo-logo-badge.avif';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
}) => {
  const [demoMenuOpen, setDemoMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'jobs', label: 'Discover Jobs', icon: Briefcase },
    { id: 'copilot', label: 'AI Career Copilot', icon: Bot, badge: 'AI' },
    { id: 'resume', label: 'Resume Intel', icon: FileText },
    { id: 'skills', label: 'Skill Intelligence', icon: Award },
    { id: 'learning', label: 'Learning & Roadmap', icon: Layers },
    { id: 'ai-agents', label: 'AI & Agents', icon: Cpu, badge: '5 Lvl' },
    { id: 'quantum', label: 'Quantum Track', icon: Sparkles, badge: 'Future' },
    { id: 'techknow', label: 'TECHKNOW 2026', icon: Calendar, highlight: true },
    { id: 'applications', label: 'Applications', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Organization Branding Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 text-[11px] py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a
              href="https://aimotnsb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-900/60 text-blue-300 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase border border-blue-700/50 hover:border-blue-400 transition"
            >
              AIMO (TNSB)
              <ExternalLink className="w-2.5 h-2.5 ml-1" />
            </a>
            <span className="font-medium text-slate-200">
              All India Manufacturers' Organization (Tamil Nadu State Board)
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-400 hidden lg:inline">
              Industrial Research & Development Trust (Founded by Bharat Ratna Dr. Sir M. Visvesvaraya)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              In collaboration with Anna University
            </span>
            <a
              href="https://techknow2026.in/#features"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-950/80 text-sky-300 border border-sky-700/60 px-2 py-0.5 rounded font-mono text-[10px] hover:border-sky-400 transition inline-flex items-center gap-1"
            >
              TECHKNOW 2026
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all duration-300">
              <div className="w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src={aimoLogoBadge} alt="AIMO TNSB logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white font-['Outfit']">
                  HIRESENSE <span className="text-sky-400">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-mono">
                  <ShieldCheck className="w-2.5 h-2.5" /> Grounded
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide -mt-0.5 font-medium">
                Don't Just Apply. Understand Your Fit.
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold'
                      : item.highlight
                      ? 'bg-indigo-950/60 text-indigo-200 border border-indigo-700/50 hover:bg-indigo-900/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action / Demo Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-sm transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-semibold">
                  Demo: {userRole === 'job_seeker' ? 'Alex Rivera (Job Seeker)' : userRole === 'recruiter' ? 'Recruiter' : 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 z-50 text-xs">
                  <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      setUserRole('job_seeker');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Alex Rivera</div>
                      <div className="text-[10px] text-slate-400">Job Seeker (3 Yrs Full-Stack)</div>
                    </div>
                    {userRole === 'job_seeker' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('recruiter');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">TECHKNOW Recruiter</div>
                      <div className="text-[10px] text-slate-400">Candidate Evaluation & Booth</div>
                    </div>
                    {userRole === 'recruiter' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('administrator');
                      setActiveTab('admin');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">Platform Administrator</div>
                      <div className="text-[10px] text-slate-400">Company Verification & Audit</div>
                    </div>
                    {userRole === 'administrator' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('jobs')}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-lg shadow-sky-500/25 transition-all"
            >
              Analyze Fit
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Scrollable Nav */}
      <div className="xl:hidden flex items-center gap-1 px-3 py-2 overflow-x-auto border-t border-slate-800/80 bg-slate-900/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
