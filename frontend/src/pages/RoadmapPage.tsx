import React, { useState } from 'react';
import { 
  Layers, ArrowDown, CheckCircle2, Circle, Clock, 
  Sparkles, ShieldCheck, Target, ChevronRight, BookOpen, AlertCircle
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState('Full Stack & Cloud');

  const tracks = [
    'Full Stack & Cloud', 'Backend Engineering', 'AI Engineering', 
    'Agentic AI', 'Quantum Technology', 'Smart Manufacturing'
  ];

  const steps = [
    {
      num: 1,
      title: "Current Profile Baseline",
      desc: "3 years experience as Full-Stack Engineer with Python, FastAPI, and React.",
      status: "COMPLETED",
      verified: true
    },
    {
      num: 2,
      title: "Verified Skills Inventory",
      desc: "Python (Advanced), FastAPI (Advanced), PostgreSQL (Advanced), Docker (Intermediate), React (Intermediate).",
      status: "COMPLETED",
      verified: true
    },
    {
      num: 3,
      title: "Target Role Specification",
      desc: "Senior Backend / AI Systems Engineer (TECHKNOW 2026 Employers & Enterprise SaaS).",
      status: "ACTIVE",
      verified: true
    },
    {
      num: 4,
      title: "Identified Skill Gaps",
      desc: "Gaps identified: AWS ECS/EKS deployment, Kafka event-driven streaming, and Autonomous Agent harnesses.",
      status: "IN PROGRESS",
      verified: true
    },
    {
      num: 5,
      title: "Targeted Learning & Projects",
      desc: "Build a fault-tolerant containerized microservice with Docker Compose and Redis task queues.",
      status: "IN PROGRESS",
      verified: false
    },
    {
      num: 6,
      title: "Interview Claim Verification Prep",
      desc: "Practice answering deep architectural questions about your 35% query optimization claim.",
      status: "SCHEDULED",
      verified: false
    },
    {
      num: 7,
      title: "Strategic Application Submission",
      desc: "Submit grounded applications to matched employers with tailored evidence checklists.",
      status: "UPCOMING",
      verified: false
    },
    {
      num: 8,
      title: "Career Progress & Promotion",
      desc: "Achieve measurable career elevation and verified compensation advancement.",
      status: "UPCOMING",
      verified: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-800 mb-2">
          <Layers className="w-3.5 h-3.5" /> End-to-End Progression Loop
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          My Career Roadmap
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          The core journey: Current Profile ↓ Verified Skills ↓ Target Role ↓ Skill Gaps ↓ Learning ↓ Projects ↓ Interview ↓ Application ↓ Progress.
        </p>
      </div>

      {/* Transparent Career Readiness Dimension Cards */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-400" />
            Transparent Career Readiness Scorecard
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Every metric is mathematically grounded — no black-box scores.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Skill Alignment</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">88%</div>
            <p className="text-[10px] text-slate-400">
              Matches 5 of 6 core required skills for Senior Backend roles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Evidence Strength</div>
            <div className="text-2xl font-bold text-sky-400 font-mono">92%</div>
            <p className="text-[10px] text-slate-400">
              Direct resume line citations for all claimed engineering tools.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Resume Alignment</div>
            <div className="text-2xl font-bold text-purple-400 font-mono">85%</div>
            <p className="text-[10px] text-slate-400">
              Full-Stack summary matches target job titles accurately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Interview Readiness</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">85%</div>
            <p className="text-[10px] text-slate-400">
              Prepared for technical & claim-verification questions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Learning Progress</div>
            <div className="text-2xl font-bold text-teal-400 font-mono">60%</div>
            <p className="text-[10px] text-slate-400">
              Level 1 AI completed; cloud orchestration in progress.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Roadmap Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-['Outfit']">
          Step-by-Step Progression Trajectory
        </h2>

        <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 ml-2"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 z-10 ${
                step.status === 'COMPLETED'
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                  : step.status === 'IN PROGRESS'
                  ? 'bg-sky-500 text-white ring-4 ring-sky-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {step.num}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-['Outfit']">
                    {step.title}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    step.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : step.status === 'IN PROGRESS'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {step.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>

                {step.verified && (
                  <div className="text-[10px] text-emerald-400 font-mono pt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Grounded in Verified Candidate Evidence
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
