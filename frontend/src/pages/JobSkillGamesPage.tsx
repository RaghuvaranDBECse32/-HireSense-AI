import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Trophy, RotateCcw, Volume2, VolumeX, Sparkles, 
  CheckCircle2, Award, Zap, Flame, ShieldCheck, HelpCircle, 
  ArrowRight, Heart, Star, Target
} from 'lucide-react';

// Sound generator using Web Audio API (zero external assets needed)
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playBeep(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.08) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  score() {
    this.playBeep(587.33, 'triangle', 0.1);
    setTimeout(() => this.playBeep(880, 'triangle', 0.15), 100);
  }

  hit() {
    this.playBeep(320, 'square', 0.05);
  }

  powerup() {
    this.playBeep(523.25, 'sine', 0.08);
    setTimeout(() => this.playBeep(659.25, 'sine', 0.08), 80);
    setTimeout(() => this.playBeep(783.99, 'sine', 0.12), 160);
  }

  gameover() {
    this.playBeep(260, 'sawtooth', 0.2);
    setTimeout(() => this.playBeep(196, 'sawtooth', 0.3), 150);
  }
}

const sfx = new SoundFX();

export const JobSkillGamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'miniball' | 'crossword' | 'blitz'>('miniball');
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    sfx.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              <Gamepad2 className="w-3.5 h-3.5" /> JOB SKILL ARCADE
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Learn by Playing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Job Skill Required Arcade
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test your knowledge of high-demand industry skills, build muscle memory for required job stacks, and catch skills with the career pad!
          </p>
        </div>

        {/* Game Mode Tabs & Sound Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveGame('miniball')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'miniball'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Miniball & Pad Catch</span>
          </button>

          <button
            onClick={() => setActiveGame('crossword')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'crossword'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Job Skill Crossword</span>
          </button>

          <button
            onClick={() => setActiveGame('blitz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'blitz'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Required Skills Blitz</span>
          </button>

          <button
            onClick={toggleSound}
            title={soundOn ? "Mute Arcade SFX" : "Enable Arcade SFX"}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Active Game View */}
      {activeGame === 'miniball' && <MiniballGame />}
      {activeGame === 'crossword' && <JobSkillCrossword />}
      {activeGame === 'blitz' && <RequiredSkillBlitz />}
    </div>
  );
};

// ==============================================================================
// 1. MINIBALL & PAD CATCHING GAME (CANVAS RETRO ARCADE)
// ==============================================================================
const MiniballGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [skillsCollected, setSkillsCollected] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');

  // Game internal state references to avoid stale closures in requestAnimationFrame
  const stateRef = useRef({
    paddleX: 200,
    paddleW: 90,
    ballX: 250,
    ballY: 280,
    ballDX: 3,
    ballDY: -3,
    ballRadius: 7,
    running: false,
    bricks: [] as Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      skill: string;
      color: string;
      alive: boolean;
    }>,
    orbs: [] as Array<{
      x: number;
      y: number;
      dy: number;
      skill: string;
      color: string;
    }>,
  });

  const SKILL_BRICKS = [
    { skill: 'Python', color: '#38bdf8' },
    { skill: 'Docker', color: '#0ea5e9' },
    { skill: 'React', color: '#61dafb' },
    { skill: 'SQL', color: '#f59e0b' },
    { skill: 'FastAPI', color: '#10b981' },
    { skill: 'Git', color: '#f43f5e' },
    { skill: 'AWS Cloud', color: '#fb923c' },
    { skill: 'GraphQL', color: '#e879f9' },
    { skill: 'Kubernetes', color: '#818cf8' },
    { skill: 'TypeScript', color: '#3b82f6' },
    { skill: 'AI/LLMs', color: '#a855f7' },
    { skill: 'Security', color: '#ec4899' },
  ];

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const cols = 4;
    const rows = 3;
    const brickW = (width - 40) / cols;
    const brickH = 24;
    const bricks = [];

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const item = SKILL_BRICKS[idx % SKILL_BRICKS.length];
        bricks.push({
          x: 20 + c * brickW,
          y: 35 + r * (brickH + 8),
          w: brickW - 6,
          h: brickH,
          skill: item.skill,
          color: item.color,
          alive: true,
        });
        idx++;
      }
    }

    stateRef.current = {
      paddleX: width / 2 - 45,
      paddleW: 90,
      ballX: width / 2,
      ballY: height - 60,
      ballDX: 3.2 * (Math.random() > 0.5 ? 1 : -1),
      ballDY: -3.4,
      ballRadius: 7,
      running: true,
      bricks,
      orbs: [],
    };

    setScore(0);
    setLives(3);
    setSkillsCollected([]);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const state = stateRef.current;
      if (!state.running) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Grid background effect
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw & Check Bricks
      let activeCount = 0;
      state.bricks.forEach((b) => {
        if (!b.alive) return;
        activeCount++;

        // Draw Brick
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 4);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Brick Skill Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.skill, b.x + b.w / 2, b.y + b.h / 2);

        // Ball - Brick Collision
        if (
          state.ballX + state.ballRadius > b.x &&
          state.ballX - state.ballRadius < b.x + b.w &&
          state.ballY + state.ballRadius > b.y &&
          state.ballY - state.ballRadius < b.y + b.h
        ) {
          b.alive = false;
          state.ballDY = -state.ballDY;
          sfx.hit();
          setScore((s) => s + 20);

          // Drop a skill orb to catch with the pad!
          state.orbs.push({
            x: b.x + b.w / 2,
            y: b.y + b.h,
            dy: 1.8 + Math.random() * 0.8,
            skill: b.skill,
            color: b.color,
          });
        }
      });

      // Win condition
      if (activeCount === 0) {
        state.running = false;
        setGameState('victory');
        sfx.powerup();
        return;
      }

      // Update & Draw Falling Skill Orbs
      for (let i = state.orbs.length - 1; i >= 0; i--) {
        const orb = state.orbs[i];
        orb.y += orb.dy;

        // Draw Orb
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label above orb
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`+${orb.skill}`, orb.x, orb.y - 11);

        // Catch Orb with Pad!
        const padY = height - 20;
        if (
          orb.y >= padY - 8 &&
          orb.y <= padY + 14 &&
          orb.x >= state.paddleX &&
          orb.x <= state.paddleX + state.paddleW
        ) {
          state.orbs.splice(i, 1);
          sfx.score();
          setScore((s) => s + 50);
          setSkillsCollected((prev) => (prev.includes(orb.skill) ? prev : [...prev, orb.skill]));
          continue;
        }

        // Off screen
        if (orb.y > height) {
          state.orbs.splice(i, 1);
        }
      }

      // Ball Movement
      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      // Ball Wall Collisions
      if (state.ballX - state.ballRadius <= 0 || state.ballX + state.ballRadius >= width) {
        state.ballDX = -state.ballDX;
        sfx.hit();
      }
      if (state.ballY - state.ballRadius <= 0) {
        state.ballDY = -state.ballDY;
        sfx.hit();
      }

      // Paddle Collision
      const paddleY = height - 20;
      if (
        state.ballY + state.ballRadius >= paddleY &&
        state.ballY - state.ballRadius <= paddleY + 12 &&
        state.ballX >= state.paddleX - 4 &&
        state.ballX <= state.paddleX + state.paddleW + 4 &&
        state.ballDY > 0
      ) {
        // Angle depends on where it hits the paddle
        const hitPoint = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
        state.ballDX = hitPoint * 4.2;
        state.ballDY = -Math.abs(state.ballDY);
        sfx.hit();
      }

      // Ball Missed
      if (state.ballY > height + 20) {
        sfx.gameover();
        setLives((l) => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            state.running = false;
            setGameState('gameover');
            return 0;
          } else {
            // Reset ball position
            state.ballX = width / 2;
            state.ballY = height - 80;
            state.ballDY = -3.2;
            state.ballDX = 3 * (Math.random() > 0.5 ? 1 : -1);
            return nextLives;
          }
        });
      }

      // Draw Ball
      ctx.fillStyle = '#f8d000';
      ctx.shadowColor = '#f8d000';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Paddle
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(state.paddleX, paddleY, state.paddleW, 10, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Paddle Grip Lines
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(state.paddleX + state.paddleW / 2 - 8, paddleY + 2, 16, 2);

      animId = requestAnimationFrame(gameLoop);
    };

    if (gameState === 'playing') {
      animId = requestAnimationFrame(gameLoop);
    }

    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Mouse & Touch Controls
  const handleMove = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clamped = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, relativeX - stateRef.current.paddleW / 2));
    stateRef.current.paddleX = clamped;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Game Canvas Container */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center">
        {/* Top HUD */}
        <div className="w-full flex items-center justify-between mb-3 px-2 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              SCORE: <strong className="text-amber-400 text-sm">{score}</strong>
            </span>
            <span className="text-slate-400">
              LEVEL: <strong className="text-sky-400">{level}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px]">PAD SHIELDS:</span>
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition ${
                  i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Canvas Screen */}
        <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-slate-700 bg-[#090d16] shadow-2xl">
          <canvas
            ref={canvasRef}
            width={540}
            height={400}
            onMouseMove={(e) => handleMove(e.clientX)}
            onTouchMove={(e) => {
              if (e.touches[0]) handleMove(e.touches[0].clientX);
            }}
            className="w-full h-full cursor-ew-resize touch-none"
          />

          {/* Start Screen Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Miniball & Skill Pad Catch</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                Bounce the miniball with your pad to shatter required skill bricks. Catch falling skill orbs to level up your resume fit!
              </p>
              <button
                onClick={initGame}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Start Pad Game
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-xl font-extrabold text-white">GAME OVER</h3>
              <p className="text-xs text-rose-200 mt-1 mb-4">
                The ball dropped! Final Score: <strong className="text-amber-400 font-mono text-sm">{score}</strong>
              </p>
              <button
                onClick={initGame}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Play Again
              </button>
            </div>
          )}

          {/* Victory Screen */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
              <h3 className="text-xl font-extrabold text-white">ALL SKILLS ACQUIRED!</h3>
              <p className="text-xs text-emerald-200 mt-1 mb-4">
                You collected all required job skills! Score: <strong className="text-amber-400 font-mono text-sm">{score}</strong>
              </p>
              <button
                onClick={initGame}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Next Level
              </button>
            </div>
          )}
        </div>

        {/* Controls Info for Mobile / Desktop */}
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between w-full max-w-[540px] px-1">
          <span>🎮 Move pad: Drag with finger or move mouse</span>
          <span className="text-emerald-400 font-mono">Catch Falling Orbs: +50 Pts</span>
        </div>
      </div>

      {/* Side Inventory & Skills Dashboard */}
      <div className="lg:col-span-4 space-y-4">
        {/* Caught Skills Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pad-Caught Skill Inventory
              </h3>
            </div>
            <span className="text-[11px] font-mono text-sky-400">{skillsCollected.length} / 12</span>
          </div>

          {skillsCollected.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Catch falling orbs with your pad to add skills to your live candidate portfolio!
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skillsCollected.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-950/80 text-sky-300 border border-sky-800/80 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {s}
                </span>
              ))}
            </div>
          )}

          {/* Job Readiness Match Meter */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Job Readiness Score:</span>
              <span className="font-bold text-amber-400 font-mono">
                {Math.min(100, Math.round((skillsCollected.length / 8) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (skillsCollected.length / 8) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Catch at least 8 skills to reach 100% verified fit for Cloud & Full-Stack roles!
            </p>
          </div>
        </div>

        {/* Arcade Instructions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Arcade Anti-Gravity Rule:
          </div>
          <p className="text-[11px] leading-relaxed">
            Every brick corresponds to an audited job requirement. When broken, it produces verifiable evidence capsules you can add to candidate profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// 2. JOB SKILL CROSSWORD (INTERACTIVE PUZZLE)
// ==============================================================================
const JobSkillCrossword: React.FC = () => {
  // Simple, elegant 8x8 job skill crossword puzzle grid
  const CROSSWORD_DATA = [
    { num: 1, dir: 'across', word: 'PYTHON', clue: 'Leading language for AI, machine learning and backend automation' },
    { num: 2, dir: 'down', word: 'REACT', clue: 'Component-based UI library developed by Meta for web apps' },
    { num: 3, dir: 'across', word: 'DOCKER', clue: 'Industry standard tool for containerizing microservices' },
    { num: 4, dir: 'down', word: 'SQL', clue: 'Relational database query language for table joins and data queries' },
    { num: 5, dir: 'across', word: 'AWS', clue: 'Amazon cloud provider with EC2, S3 and Lambda serverless' },
    { num: 6, dir: 'down', word: 'GIT', clue: 'Distributed version control software created by Linus Torvalds' },
  ];

  // User input state for crossword answers
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  });

  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'wrong' | null }>({});
  const [revealed, setRevealed] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState(0);

  const handleWordChange = (num: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [num]: val.toUpperCase() }));
  };

  const checkAll = () => {
    let earned = 0;
    const newFeedback: { [key: number]: 'correct' | 'wrong' | null } = {};

    CROSSWORD_DATA.forEach((item) => {
      const userWord = (answers[item.num] || '').trim().toUpperCase();
      if (userWord === item.word) {
        newFeedback[item.num] = 'correct';
        earned += 50;
      } else {
        newFeedback[item.num] = 'wrong';
      }
    });

    setFeedback(newFeedback);
    setScore(earned);
    if (earned === CROSSWORD_DATA.length * 50) {
      sfx.powerup();
    } else {
      sfx.score();
    }
  };

  const reveal = (num: number) => {
    const item = CROSSWORD_DATA.find((c) => c.num === num);
    if (!item) return;
    setAnswers((prev) => ({ ...prev, [num]: item.word }));
    setRevealed((prev) => ({ ...prev, [num]: true }));
    setFeedback((prev) => ({ ...prev, [num]: 'correct' }));
  };

  const reset = () => {
    setAnswers({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
    setFeedback({});
    setRevealed({});
    setScore(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
            Job Skill Crossword Challenge
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill in the essential technical skills demanded by top engineering hiring managers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            SCORE: <span className="text-amber-400 font-bold">{score} / 300</span>
          </div>
          <button
            onClick={checkAll}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition shadow-lg shadow-sky-500/25"
          >
            Check Answers
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clues & Answer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CROSSWORD_DATA.map((item) => {
          const isCorrect = feedback[item.num] === 'correct';
          const isWrong = feedback[item.num] === 'wrong';

          return (
            <div
              key={item.num}
              className={`p-4 rounded-xl border transition ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-700/60'
                  : isWrong
                  ? 'bg-rose-950/40 border-rose-700/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-white text-[11px]">
                    {item.num}
                  </span>
                  {item.dir.toUpperCase()} ({item.word.length} letters)
                </span>

                <button
                  onClick={() => reveal(item.num)}
                  className="text-[10px] text-slate-400 hover:text-amber-400 underline font-mono"
                >
                  Reveal Answer
                </button>
              </div>

              <p className="text-xs text-slate-200 mb-3 leading-relaxed">
                {item.clue}
              </p>

              {/* Letter Inputs Box */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  maxLength={item.word.length}
                  value={answers[item.num] || ''}
                  onChange={(e) => handleWordChange(item.num, e.target.value)}
                  placeholder={`Type ${item.word.length} letters`}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase focus:outline-none transition ${
                    isCorrect
                      ? 'bg-emerald-900/50 border border-emerald-500 text-emerald-200'
                      : isWrong
                      ? 'bg-rose-900/50 border border-rose-500 text-rose-200'
                      : 'bg-slate-900 border border-slate-700 text-white focus:border-sky-500'
                  }`}
                />
                {isCorrect && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==============================================================================
// 3. REQUIRED SKILLS BLITZ (FAST-PACED MATCHING GAME)
// ==============================================================================
const RequiredSkillBlitz: React.FC = () => {
  const ROUNDS = [
    {
      role: 'Full-Stack AI Developer',
      requiredSkills: ['Python', 'React', 'Gemini API', 'FastAPI'],
      distractors: ['Solidity', 'Cobol', 'PHP 5', 'Objective-C'],
    },
    {
      role: 'Cloud Infrastructure & DevOps Engineer',
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      distractors: ['Photoshop', 'Canva', 'Excel 2003', 'Flash'],
    },
    {
      role: 'Data Science & Machine Learning Specialist',
      requiredSkills: ['PyTorch', 'Pandas', 'SQL', 'Scikit-Learn'],
      distractors: ['WordPress', 'Dreamweaver', 'Visual Basic', 'Perl'],
    },
  ];

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);

  const currentRound = ROUNDS[currentRoundIdx];
  const allChoices = React.useMemo(() => {
    return [...currentRound.requiredSkills, ...currentRound.distractors].sort(() => Math.random() - 0.5);
  }, [currentRoundIdx]);

  const handleSelectSkill = (skill: string) => {
    if (roundComplete) return;

    if (currentRound.requiredSkills.includes(skill)) {
      if (!selectedSkills.includes(skill)) {
        const next = [...selectedSkills, skill];
        setSelectedSkills(next);
        setScore((s) => s + 25);
        sfx.score();

        if (next.length === currentRound.requiredSkills.length) {
          setRoundComplete(true);
          sfx.powerup();
        }
      }
    } else {
      sfx.hit();
      setScore((s) => Math.max(0, s - 10));
    }
  };

  const nextRound = () => {
    setSelectedSkills([]);
    setRoundComplete(false);
    setCurrentRoundIdx((idx) => (idx + 1) % ROUNDS.length);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 font-bold mb-1">
            ROUND {currentRoundIdx + 1} OF {ROUNDS.length}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
            Target Role: <span className="text-amber-400">{currentRound.role}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap the 4 mandatory skills required for this job role. Avoid obsolete or irrelevant skills!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            TOTAL SCORE: <span className="text-amber-400 font-bold text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Skills Matched: {selectedSkills.length} / 4</span>
        <span className="text-emerald-400">
          {roundComplete ? 'ROUND COMPLETE!' : 'Click skills below:'}
        </span>
      </div>

      {/* Choice Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {allChoices.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          const isTarget = currentRound.requiredSkills.includes(skill);

          return (
            <button
              key={skill}
              onClick={() => handleSelectSkill(skill)}
              className={`p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <span>{skill}</span>
              {isSelected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Target className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
          );
        })}
      </div>

      {roundComplete && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Awesome! You identified all 4 core competencies for this job profile.</span>
          </div>
          <button
            onClick={nextRound}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <span>Next Target Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
