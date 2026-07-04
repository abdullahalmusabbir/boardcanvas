'use client';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LoginModal from '@/components/landing/LoginModal';
import SignupModal from '@/components/landing/SignupModal';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  Layers,
  LayoutDashboard,
  MousePointer2, Shield,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import { useState } from 'react';


/* ─── static data ─────────────────────────────────────────── */
const stats = [
  { value: '3', label: 'Kanban Columns' },
  { value: '∞', label: 'Tasks & Notes' },
  { value: '100%', label: 'Open Source' },
  { value: '1', label: 'Unified Workspace' },
];

const features = [
  {
    icon: LayoutDashboard,
    title: 'Kanban Board',
    desc: 'Drag-and-drop tasks across To Do, In Progress, and Done columns. Visualize your workflow beautifully.',
    color: '#6366f1',
    gradient: 'from-indigo-500/10 to-indigo-500/0',
  },
  {
    icon: Calendar,
    title: 'Date-based Planning',
    desc: 'Pick a date and instantly see every task scheduled for that day. Never miss a deadline again.',
    color: '#a855f7',
    gradient: 'from-purple-500/10 to-purple-500/0',
  },
  {
    icon: ImageIcon,
    title: 'Image Annotation',
    desc: 'Upload images and draw precise polygons to annotate regions of interest. Perfect for ML datasets.',
    color: '#ec4899',
    gradient: 'from-pink-500/10 to-pink-500/0',
  },
  {
    icon: Tag,
    title: 'Smart Tags',
    desc: 'Organize tasks with colored tags. Filter, group, and search through your work in seconds.',
    color: '#10b981',
    gradient: 'from-emerald-500/10 to-emerald-500/0',
  },
  {
    icon: MousePointer2,
    title: 'Polygon Drawing',
    desc: 'Click to place points, form shapes, and annotate complex image regions with ease.',
    color: '#f59e0b',
    gradient: 'from-amber-500/10 to-amber-500/0',
  },
  {
    icon: Shield,
    title: 'Secure & Persistent',
    desc: 'Session-based auth, per-user data isolation, and a Django-powered backend that keeps your data safe.',
    color: '#06b6d4',
    gradient: 'from-cyan-500/10 to-cyan-500/0',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign in securely with your email and password. Your personal workspace is ready instantly.',
  },
  {
    step: '02',
    title: 'Manage Your Tasks',
    desc: 'Add tasks, set priorities, assign tags, and drag them across your Kanban board effortlessly.',
  },
  {
    step: '03',
    title: 'Annotate Images',
    desc: 'Upload images, draw polygon annotations, save them to the cloud, and revisit anytime.',
  },
];

/* ─── floating card mock ───────────────────────────────────── */
function KanbanPreview() {
  const columns = [
    {
      label: 'To Do',
      color: '#6366f1',
      tasks: ['Design system update', 'API integration'],
    },
    {
      label: 'In Progress',
      color: '#f59e0b',
      tasks: ['Auth flow'],
    },
    {
      label: 'Done',
      color: '#10b981',
      tasks: ['Setup project', 'DB schema'],
    },
  ];

  return (
    <div className="flex gap-3 p-4 bg-[#111118] rounded-2xl border border-[#2a2a3a]
                    shadow-2xl shadow-black/60 w-full max-w-sm">
      {columns.map(col => (
        <div key={col.label} className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: col.color }}
            />
            <span className="text-[10px] font-semibold text-[#8b8ba7] truncate">
              {col.label}
            </span>
          </div>
          <div className="space-y-1.5">
            {col.tasks.map(t => (
              <div
                key={t}
                className="p-2 bg-[#16161f] rounded-lg border border-[#2a2a3a]
                           hover:border-indigo-500/30 transition-colors"
              >
                <p className="text-[9px] text-[#c4c4d4] leading-tight">{t}</p>
                <div
                  className="mt-1.5 h-0.5 rounded-full w-3/4"
                  style={{ backgroundColor: col.color + '40' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── annotation preview mock ──────────────────────────────── */
function AnnotatePreview() {
  return (
    <div className="relative w-full max-w-xs bg-[#111118] rounded-2xl border
                    border-[#2a2a3a] shadow-2xl shadow-black/60 overflow-hidden">
      {/* Fake image */}
      <div className="h-36 bg-gradient-to-br from-[#1a1a2e] via-[#16213e]
                      to-[#0f3460] relative">
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox="0 0 300 150"
        >
          {/* polygon shape */}
          <polygon
            points="60,30 180,20 220,80 160,130 50,110"
            fill="rgba(99,102,241,0.15)"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <circle cx="60" cy="30" r="4" fill="#6366f1" />
          <circle cx="180" cy="20" r="4" fill="#6366f1" />
          <circle cx="220" cy="80" r="4" fill="#6366f1" />
          <circle cx="160" cy="130" r="4" fill="#6366f1" />
          <circle cx="50" cy="110" r="4" fill="#6366f1" />

          <polygon
            points="190,35 260,50 250,110 170,100"
            fill="rgba(168,85,247,0.12)"
            stroke="#a855f7"
            strokeWidth="1.5"
          />
        </svg>
        {/* label badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5
                        bg-indigo-600/80 rounded-full border border-indigo-400/30">
          <span className="text-[9px] font-semibold text-white">Object #1</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-white">sample_image.jpg</p>
          <p className="text-[9px] text-[#8b8ba7] mt-0.5">2 polygons drawn</p>
        </div>
        <div className="flex gap-1">
          {['#6366f1', '#a855f7'].map(c => (
            <div
              key={c}
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────────── */
export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <LandingNavbar />

      <main className="overflow-x-hidden">

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center
                            justify-center pt-16 pb-24 px-4">
          {/* Background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px]
                            bg-indigo-600/8 rounded-full blur-3xl
                            animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]
                            bg-purple-600/8 rounded-full blur-3xl
                            animate-pulse-glow delay-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl" />
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(#6366f1 1px, transparent 1px),' +
                  'linear-gradient(90deg, #6366f1 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5
                            glass rounded-full border border-indigo-500/30
                            text-xs font-semibold text-indigo-400
                            mb-8 animate-slide-up">
              <Sparkles size={12} className="animate-pulse" />
              Task Management × Image Annotation
              <Sparkles size={12} className="animate-pulse" />
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05]
                         tracking-tight mb-6 animate-slide-up delay-100"
            >
              <span className="text-white">Your workspace,</span>
              <br />
              <span className="gradient-text">reimagined.</span>
            </h1>

            {/* Sub */}
            <p
              className="text-base sm:text-lg text-[#8b8ba7] max-w-2xl mx-auto
                         leading-relaxed mb-10 animate-slide-up delay-200"
            >
              Manage tasks on a Kanban board and annotate images with precision —
              all inside one elegant, dark-mode-first workspace. Built for
              developers who demand quality.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center
                            gap-4 mb-20 animate-slide-up delay-300">
              <button
                onClick={() => setSignupOpen(true)}
                className="group flex items-center gap-2 px-8 py-3.5
                           bg-indigo-600 hover:bg-indigo-500 text-white
                           font-semibold rounded-2xl text-sm
                           shadow-xl shadow-indigo-500/30
                           hover:shadow-indigo-500/50
                           transition-all duration-300
                           hover:scale-105 active:scale-95"
              >
                Get Started Free
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <a
                href="/features"
                className="flex items-center gap-2 px-8 py-3.5
                           glass hover:bg-white/5 text-white
                           font-semibold rounded-2xl text-sm
                           transition-all duration-300
                           hover:border-indigo-500/40"
              >
                <Layers size={16} />
                See Features
              </a>
            </div>

            {/* Floating preview cards */}
            <div className="relative flex flex-col md:flex-row items-center
                            justify-center gap-8 animate-slide-up delay-400">
              {/* Kanban card */}
              <div className="animate-float">
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-[#8b8ba7]
                                uppercase tracking-widest mb-2 flex items-center gap-1">
                    <LayoutDashboard size={10} />
                    Kanban Board
                  </p>
                  <KanbanPreview />
                </div>
              </div>

              {/* center badge */}
              <div className="w-12 h-12 glass rounded-2xl flex items-center
                              justify-center border border-indigo-500/30
                              glow-indigo shrink-0 hidden md:flex animate-pulse-glow">
                <span className="text-xl">×</span>
              </div>

              {/* Annotate card */}
              <div className="animate-float-delayed">
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-[#8b8ba7]
                                uppercase tracking-widest mb-2 flex items-center gap-1">
                    <ImageIcon size={10} />
                    Image Annotation
                  </p>
                  <AnnotatePreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════ */}
        <section className="relative py-16 border-y border-[#2a2a3a]/60">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                    {value}
                  </div>
                  <div className="text-sm text-[#8b8ba7] font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════════ */}
        <section className="py-28 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 glass
                              rounded-full text-xs font-semibold text-indigo-400
                              border border-indigo-500/20 mb-4">
                <Zap size={11} />
                Core Features
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Everything you need,
                <br />
                <span className="gradient-text">nothing you don&apos;t.</span>
              </h2>
              <p className="text-[#8b8ba7] max-w-xl mx-auto text-base">
                A thoughtfully crafted toolkit that covers the full loop —
                from planning your work to annotating your data.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc, color, gradient }) => (
                <div
                  key={title}
                  className="group relative glass rounded-2xl p-6
                             hover:border-white/10 transition-all duration-300
                             hover:-translate-y-1 hover:shadow-xl
                             hover:shadow-black/40 overflow-hidden"
                >
                  {/* bg gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}
                                opacity-0 group-hover:opacity-100 transition-opacity
                                duration-300 rounded-2xl`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center
                                 justify-center mb-4 transition-transform
                                 duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: color + '18',
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <Icon size={20} style={{ color }} />
                    </div>

                    <h3 className="font-bold text-white mb-2 text-base">{title}</h3>
                    <p className="text-sm text-[#8b8ba7] leading-relaxed">{desc}</p>

                    {/* Arrow hint */}
                    <div
                      className="flex items-center gap-1 mt-4 text-xs font-semibold
                                 opacity-0 group-hover:opacity-100 transition-all
                                 duration-300 -translate-x-2
                                 group-hover:translate-x-0"
                      style={{ color }}
                    >
                      Learn more <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section className="py-28 px-4 bg-[#111118]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 glass
                              rounded-full text-xs font-semibold text-purple-400
                              border border-purple-500/20 mb-4">
                <CheckCircle2 size={11} />
                How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Up and running in
                <span className="gradient-text"> 3 steps.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[16.7%]
                              right-[16.7%] h-px bg-gradient-to-r
                              from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

              {howItWorks.map(({ step, title, desc }, i) => (
                <div key={step} className="relative text-center group">
                  {/* Step number */}
                  <div
                    className="w-16 h-16 glass rounded-2xl flex items-center
                               justify-center mx-auto mb-6 border border-[#2a2a3a]
                               group-hover:border-indigo-500/40 transition-all
                               duration-300 relative"
                  >
                    <span className="text-xl font-black gradient-text">{step}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm text-[#8b8ba7] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════════ */}
        <section className="py-28 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative glass rounded-3xl p-12 overflow-hidden">
              {/* inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10
                              via-purple-600/5 to-pink-600/10 rounded-3xl" />
              <div className="absolute -top-20 -right-20 w-60 h-60
                              bg-indigo-600/15 rounded-full blur-3xl
                              animate-pulse-glow" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60
                              bg-purple-600/15 rounded-full blur-3xl
                              animate-pulse-glow delay-300" />

              <div className="relative">
                <div className="text-5xl mb-6">🚀</div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  Ready to level up?
                </h2>
                <p className="text-[#8b8ba7] mb-8 text-base leading-relaxed">
                  Join the workspace that actually works. No fluff,
                  no bloat — just clean tools that get things done.
                </p>
                <button
                  onClick={() => setSignupOpen(true)}
                  className="group inline-flex items-center gap-2 px-10 py-4
                             bg-indigo-600 hover:bg-indigo-500 text-white
                             font-bold rounded-2xl text-sm
                             shadow-xl shadow-indigo-500/30
                             hover:shadow-indigo-500/50
                             transition-all duration-300
                             hover:scale-105 active:scale-95"
                >
                  Start Now — It&apos;s Free
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <LandingFooter />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
        <SignupModal
            isOpen={signupOpen}
            onClose={() => setSignupOpen(false)}
            onSwitchToLogin={() => setLoginOpen(true)}
        />
    </>
  );
}