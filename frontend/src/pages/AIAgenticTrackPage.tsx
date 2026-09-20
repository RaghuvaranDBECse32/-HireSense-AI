import React, { useState } from 'react';
import { 
  Cpu, Award, CheckCircle2, Circle, ArrowRight, 
  ShieldAlert, BookOpen, Sparkles, Terminal, Code2, Layers
} from 'lucide-react';

export const AIAgenticTrackPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const levels = [
    {
      level: 1,
      title: "Level 1 — Foundations",
      subtitle: "Generative AI, LLMs & Prompt Engineering",
      status: "In Progress (Foundations Verified)",
      completed: false,
      topics: [
        {
          name: "Generative AI & Transformer Architectures",
          description: "Attention mechanisms, tokens, temperature, context windows, and foundational inference.",
          project: "Semantic Search Engine with Python"
        },
        {
          name: "Prompt Engineering & Calibrated Output",
          description: "Few-shot prompting, JSON schema constraints, and anti-hallucination prompting techniques.",
          project: "Deterministic Schema Validator Harness"
        }
      ]
    },
    {
      level: 2,
      title: "Level 2 — Applied AI",
      subtitle: "RAG, Vector DBs & Tool Calling",
      status: "Recommended Next Step",
      completed: false,
      topics: [
        {
          name: "RAG & Vector Retrieval",
          description: "Chunking strategies, cosine similarity, hybrid sparse/dense search, and Pinecone/Qdrant indexing.",
          project: "Grounded Document Q&A with Citation Badges"
        },
        {
          name: "Function Calling & Tool Execution",
          description: "Structured function declarations, argument validation, and tool invocation loops.",
          project: "Autonomous SQL Database Querying Assistant"
        }
      ]
    },
    {
      level: 3,
      title: "Level 3 — RAG & Agents",
      subtitle: "Autonomous Agents & Multi-Agent Systems",
      status: "Future Milestone",
      completed: false,
      topics: [
        {
          name: "Autonomous ReAct Agent Loops",
          description: "Planning, reflexions, step memory, sub-goal generation, and task completion verification.",
          project: "Autonomous Market Research Subagent"
        },
        {
          name: "Multi-Agent System Architecture",
          description: "Supervisor-worker coordination, consensus debates, specialized agent personas, and message routing.",
          project: "Multi-Agent Pull Request Reviewer"
        }
      ]
    },
    {
      level: 4,
      title: "Level 4 — Production AI",
      subtitle: "Harnesses, Context Management & Safety",
      status: "Future Milestone",
      completed: false,
      topics: [
        {
          name: "Agent Harnesses & Context Management",
          description: "Compaction, state checkpointing, long-term memory, dynamic system prompt assembly, and token budget management.",
          project: "Fault-Tolerant Pause/Resume Workflow Engine"
        },
        {
          name: "Guardrails, AI Safety & Evaluation",
          description: "NeMo guardrails, LLM-as-a-judge benchmarking, latency optimization, and anti-gravity grounding self-checks.",
          project: "Automated Hallucination Evaluation Suite"
        }
      ]
    },
    {
      level: 5,
      title: "Level 5 — Advanced Agentic Systems",
      subtitle: "Production Observability & Enterprise Scale",
      status: "Future Milestone",
      completed: false,
      topics: [
        {
          name: "Enterprise Observability & OpenTelemetry",
          description: "Langfuse/Phoenix tracing, latency profiling, cost anomaly alerting, and distributed agent logging.",
          project: "Production Multi-Agent Deployment with SLA Monitoring"
        }
      ]
    }
  ];

  const activeLevelData = levels.find(l => l.level === selectedLevel) || levels[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-800 mb-2">
          <Cpu className="w-3.5 h-3.5" /> 5-Level Progressive Mastery
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          AI & Agentic Career Track
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          From modern LLM foundations to autonomous agent harnesses and production multi-agent systems.
        </p>
      </div>

      {/* Strict Anti-Gravity Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="text-slate-300">
          <strong className="text-amber-300 font-semibold">Anti-Gravity Grounding Policy:</strong> We never claim a candidate has completed a career level without verifiable repository or production evidence. Levels below represent structured future milestones.
        </div>
      </div>

      {/* 5-Level Progress Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {levels.map((l) => (
          <button
            key={l.level}
            onClick={() => setSelectedLevel(l.level)}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-3 ${
              selectedLevel === l.level
                ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                Level 0{l.level}
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {l.title.split('—')[1]}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-medium">
              {l.status}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Level Curriculum Details */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">
              Curriculum Specifications
            </span>
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              {activeLevelData.title}: {activeLevelData.subtitle}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            Status: {activeLevelData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeLevelData.topics.map((t, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-950 text-purple-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white">{t.name}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.description}
              </p>
              <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span><strong>Recommended Capstone:</strong> {t.project}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
