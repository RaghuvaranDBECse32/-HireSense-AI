import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Atom, BookOpen, Layers, Target, ShieldAlert, Cpu
} from 'lucide-react';

export const QuantumTrackPage: React.FC = () => {
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);

  const topics = [
    {
      id: "qc",
      title: "Quantum Computing Foundations",
      badge: "Topic 1",
      prerequisites: "Linear Algebra (Matrices, Eigenvalues), Complex Numbers, Basic Python",
      beginner_concepts: "Qubits, Superposition, Entanglement, Bloch Sphere, Quantum Logic Gates (H, X, CNOT)",
      roadmap: "Mathematical formulation → Single-qubit simulations → Two-qubit Bell states → Measurement collapse",
      project_ideas: "Build a single-qubit Bloch Sphere 3D visualizer using Python & Matplotlib/Three.js",
      related_skills: "Linear Algebra, Python, NumPy, Circuit Simulation",
      potential_roles: "Quantum Software Researcher, Quantum Applications Engineer"
    },
    {
      id: "qa",
      title: "Quantum Algorithms",
      badge: "Topic 2",
      prerequisites: "Topic 1 Foundations, Algorithmic Complexity (Big-O)",
      beginner_concepts: "Quantum Fourier Transform (QFT), Phase Estimation, Amplitude Amplification, Shor's Factoring, Grover's Search",
      roadmap: "Oracle construction → Grover search on 3-qubit space → QFT matrix implementation → Complexity comparison",
      project_ideas: "Implement Grover's search algorithm for an unstructured database in Qiskit with noise analysis",
      related_skills: "Algorithm Design, Cryptanalysis, Discrete Mathematics",
      potential_roles: "Quantum Algorithm Engineer, Quantum Research Scientist"
    },
    {
      id: "qml",
      title: "Quantum Machine Learning (QML)",
      badge: "Topic 3",
      prerequisites: "Classical Machine Learning (PyTorch/Scikit-learn), Quantum Circuits",
      beginner_concepts: "Parameterized Quantum Circuits (PQC), Variational Quantum Eigensolvers (VQE), Quantum Kernels, Barren Plateaus",
      roadmap: "Data encoding (Angle/Amplitude) → Hybrid quantum-classical loops → PennyLane integration → Classification benchmarks",
      project_ideas: "Train a hybrid PyTorch-PennyLane variational classifier for binary classification of medical imagery",
      related_skills: "PyTorch, PennyLane, Optimization, Gradient Descent",
      potential_roles: "Quantum Machine Learning Engineer, AI/Quantum Convergence Specialist"
    },
    {
      id: "qcrypt",
      title: "Quantum Cryptography",
      badge: "Topic 4",
      prerequisites: "Basic Cryptography (RSA, ECC), Quantum Measurement Properties",
      beginner_concepts: "No-Cloning Theorem, BB84 Protocol, Quantum Key Distribution (QKD), Post-Quantum Cryptography (Lattice-based)",
      roadmap: "BB84 simulation → Eavesdropping detection analysis → NIST PQC standard review → Migration strategies",
      project_ideas: "Simulate BB84 Quantum Key Distribution with simulated Eve interceptor and calculate Quantum Bit Error Rate (QBER)",
      related_skills: "Cybersecurity, Network Protocols, Information Theory",
      potential_roles: "Post-Quantum Cryptography Specialist, Quantum Security Consultant"
    },
    {
      id: "qsoft",
      title: "Quantum Software & Frameworks",
      badge: "Topic 5",
      prerequisites: "Python Mastery, Git, Basic Quantum Circuit knowledge",
      beginner_concepts: "Qiskit SDK, Cirq, PennyLane, OpenQASM, Quantum Circuit Transpilation and Gate Optimization",
      roadmap: "Qiskit runtime setup → Local Aer simulators → Transpilation to native IBM hardware basis gates → Pulse control",
      project_ideas: "Automated quantum circuit optimizer comparing circuit depth and CNOT counts across transpiler passes",
      related_skills: "Python, OpenQASM, Compiler Optimization, Open-Source Development",
      potential_roles: "Quantum Software Developer, Scientific Software Engineer"
    },
    {
      id: "qhard",
      title: "Quantum Hardware Architectures",
      badge: "Topic 6",
      prerequisites: "Solid State Physics / Electromagnetic Theory / Microelectronics",
      beginner_concepts: "Superconducting Qubits (Transmons), Trapped Ions, Neutral Atoms, Photonics, Coherence Times (T1, T2)",
      roadmap: "Physical realization comparison → Dilution refrigerator basics → Microwave pulse control → Error mitigation",
      project_ideas: "Benchmark report comparing physical fidelity, error rates, and scalability across Superconducting vs Trapped-Ion platforms",
      related_skills: "Cryogenics, RF Electronics, Semiconductor Physics, Hardware Calibration",
      potential_roles: "Quantum Hardware Engineer, Test & Characterization Engineer"
    },
    {
      id: "qai",
      title: "Quantum + AI Convergence",
      badge: "Topic 7",
      prerequisites: "Level 4 Agentic AI + Quantum Machine Learning",
      beginner_concepts: "Quantum Reinforcement Learning, Quantum Walks for Agent Exploration, Speedup in Search-Space Pruning",
      roadmap: "Agent environment modeling → Quantum policy network → Variational reward optimization → Hybrid agent harness",
      project_ideas: "Prototype an agent using a quantum walk policy to navigate high-dimensional decision trees",
      related_skills: "Agentic Systems, Quantum Reinforcement Learning, Autonomous Systems",
      potential_roles: "Quantum-Agentic AI Architect, Future Tech Strategist"
    }
  ];

  const currentTopic = topics[selectedTopicIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-950/70 px-2.5 py-0.5 rounded-full border border-teal-800 mb-2">
          <Atom className="w-3.5 h-3.5" /> Future Technology Explorer
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Quantum Career Explorer
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Comprehensive exploration across 7 strategic quantum technology domains. 
          Prepares you for the upcoming quantum revolution in computing, security, and AI.
        </p>
      </div>

      {/* STRICT SEPARATION BANNER: Current Verified Skills vs Future Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Current Verified Skills (Candidate Baseline)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Alex Rivera has verified skills in <strong>Python, FastAPI, React, PostgreSQL, and Docker</strong>. 
            No quantum computing claims exist on the candidate's resume.
          </p>
          <div className="text-[10px] text-emerald-400 font-mono">
            Zero Hallucination: Never fabricate unproven quantum experience.
          </div>
        </div>

        <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-800/40 space-y-2">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended Future Skills (Learning Trajectory)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Begin with <strong>Linear Algebra & Qiskit simulation</strong>, leveraging your strong Python baseline to explore quantum circuits without overstating readiness.
          </p>
          <div className="text-[10px] text-teal-300 font-mono">
            Structured roadmap for self-directed or university-backed growth.
          </div>
        </div>
      </div>

      {/* Topic Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {topics.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopicIdx(idx)}
            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${
              selectedTopicIdx === idx
                ? 'bg-teal-950/40 border-teal-500 shadow-lg shadow-teal-500/10 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-teal-400 mb-1">
              {t.badge}
            </div>
            <div className="text-xs font-bold leading-tight line-clamp-2">
              {t.title}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Topic Breakdown */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-bold text-teal-400 uppercase">
              {currentTopic.badge} Detailed Guide
            </div>
            <h2 className="text-2xl font-bold text-white font-['Outfit'] mt-0.5">
              {currentTopic.title}
            </h2>
          </div>
          <span className="text-xs text-teal-300 bg-teal-950 px-3 py-1 rounded-lg border border-teal-800 font-medium">
            Future Exploration Track
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">
              1. Prerequisites
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.prerequisites}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">
              2. Core Beginner Concepts
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.beginner_concepts}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">
              3. Step-by-Step Learning Roadmap
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.roadmap}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-teal-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 4. Hands-On Project Idea
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.project_ideas}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-mono">
              5. Related Mathematical & Software Skills
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.related_skills}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase text-sky-400 font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> 6. Potential Industry & Research Roles
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentTopic.potential_roles}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
