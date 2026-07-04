import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import {
    Code2,
    Cpu,
    Database,
    Globe, Heart,
    Layers,
    Shield, Sparkles,
    Zap,
} from 'lucide-react';

/* ── Tech stack data ── */
const techStack = [
    {
        category: 'Frontend',
        color: '#6366f1',
        icon: Globe,
        items: [
        { name: 'Next.js 14', desc: 'React framework with App Router' },
        { name: 'TypeScript', desc: 'Type-safe development' },
        { name: 'Tailwind CSS', desc: 'Utility-first styling' },
        { name: 'Lucide React', desc: 'Beautiful icon library' },
        ],
    },
    {
        category: 'Backend',
        color: '#10b981',
        icon: Database,
        items: [
        { name: 'Django', desc: 'Python web framework' },
        { name: 'Django REST Framework', desc: 'Powerful API toolkit' },
        { name: 'SQLite / PostgreSQL', desc: 'Relational database' },
        { name: 'Django ORM', desc: 'Database abstraction layer' },
        ],
    },
    {
        category: 'Architecture',
        color: '#a855f7',
        icon: Layers,
        items: [
        { name: 'Session Auth', desc: 'Cookie-based authentication' },
        { name: 'REST API', desc: 'Clean endpoint design' },
        { name: 'Context API', desc: 'State management' },
        { name: 'Modular Components', desc: 'Reusable UI building blocks' },
        ],
    },
];

const values = [
    {
        icon: Code2,
        title: 'Clean Code First',
        desc: 'Every component is modular, typed, and purposefully designed. No spaghetti, no shortcuts.',
        color: '#6366f1',
    },
    {
        icon: Cpu,
        title: 'Performance Minded',
        desc: 'Optimized rendering, minimal re-renders, and a backend that responds fast under load.',
        color: '#a855f7',
    },
    {
        icon: Shield,
        title: 'Security by Default',
        desc: 'Session-based auth, user-scoped data, and Django\'s battle-tested security layer.',
        color: '#10b981',
    },
    {
        icon: Sparkles,
        title: 'Great UX Always',
        desc: 'Dark-mode first, smooth animations, and an interface that stays out of your way.',
        color: '#f59e0b',
    },
];

const timeline = [
    {
        phase: 'Phase 1',
        title: 'Foundation',
        desc: 'Django backend with models, serializers, auth, and REST endpoints for tasks and annotations.',
        color: '#6366f1',
    },
    {
        phase: 'Phase 2',
        title: 'Landing Experience',
        desc: 'Next.js frontend with landing pages, login modal, and context-based auth state.',
        color: '#a855f7',
    },
    {
        phase: 'Phase 3',
        title: 'Task Board',
        desc: 'Kanban board with drag-and-drop, date filtering, task modals, and full CRUD.',
        color: '#ec4899',
    },
    {
        phase: 'Phase 4',
        title: 'Annotation Tool',
        desc: 'Canvas-based polygon drawing, image carousel, and persistent storage via API.',
        color: '#10b981',
    },
];

export default function AboutPage() {
    return (
        <>
        <LandingNavbar />
        <main className="pt-16">

            {/* ══════════════════════════════════════════
                HERO
            ══════════════════════════════════════════ */}
            <section className="relative py-28 px-4 overflow-hidden">
            {/* bg orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96
                                bg-indigo-600/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72
                                bg-purple-600/8 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass
                                rounded-full border border-indigo-500/30
                                text-xs font-semibold text-indigo-400 mb-6">
                <Heart size={11} className="text-pink-400 fill-pink-400" />
                Built with passion
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black
                            text-white leading-tight mb-6">
                About{' '}
                <span className="gradient-text">VisionBoard App</span>
                </h1>

                <p className="text-base sm:text-lg text-[#8b8ba7] max-w-2xl
                            mx-auto leading-relaxed">
                A 2-in-1 productivity platform that combines a full-featured
                Kanban task manager with a precision image annotation tool —
                crafted from scratch as a showcase of modern full-stack development.
                </p>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                WHAT IS THIS
            ══════════════════════════════════════════ */}
            <section className="py-20 px-4 bg-[#111118]/60">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 glass
                                    rounded-full text-xs font-semibold text-purple-400
                                    border border-purple-500/20 mb-5">
                    <Zap size={11} />
                    The Project
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
                    One app.
                    <br />
                    <span className="gradient-text">Two superpowers.</span>
                    </h2>
                    <div className="space-y-4 text-[#8b8ba7] text-sm leading-relaxed">
                    <p>
                        VisionBoard App was built as a technical showcase — proving that a single,
                        cohesive workspace can handle both project management
                        and data labeling workflows without compromise.
                    </p>
                    <p>
                        The task side gives you a Kanban board with date-based filtering,
                        priority levels, custom tags, and drag-and-drop reordering.
                        The annotation side gives you a canvas where you can upload
                        images, draw polygons, label regions, and save everything
                        to a persistent backend.
                    </p>
                    <p>
                        Every feature talks to a Django REST API with proper
                        authentication, per-user data isolation, and clean
                        ORM-backed persistence.
                    </p>
                    </div>
                </div>

                {/* Visual */}
                <div className="relative">
                    {/* outer glow */}
                    <div className="absolute -inset-4 bg-gradient-to-br
                                    from-indigo-500/10 via-purple-500/5 to-pink-500/10
                                    rounded-3xl blur-xl" />
                    <div className="relative glass rounded-2xl p-6 space-y-4">
                    {[
                        { label: 'Task Management', pct: 50, color: '#6366f1' },
                        { label: 'Image Annotation', pct: 50, color: '#a855f7' },
                        { label: 'REST API Coverage', pct: 100, color: '#10b981' },
                        { label: 'TypeScript Coverage', pct: 100, color: '#f59e0b' },
                    ].map(({ label, pct, color }) => (
                        <div key={label}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-[#8b8ba7] font-medium">{label}</span>
                            <span className="font-bold" style={{ color }}>
                            {pct}%
                            </span>
                        </div>
                        <div className="h-1.5 bg-[#2a2a3a] rounded-full overflow-hidden">
                            <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                VALUES
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Built on{' '}
                    <span className="gradient-text">solid principles.</span>
                </h2>
                <p className="text-[#8b8ba7] text-sm max-w-lg mx-auto">
                    These aren't just buzzwords — they're the lens through which
                    every decision in this project was made.
                </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {values.map(({ icon: Icon, title, desc, color }) => (
                    <div
                    key={title}
                    className="glass rounded-2xl p-6 group hover:-translate-y-1
                                hover:shadow-xl hover:shadow-black/40
                                transition-all duration-300"
                    >
                    <div
                        className="w-11 h-11 rounded-xl flex items-center
                                justify-center mb-4"
                        style={{
                        backgroundColor: color + '18',
                        border: `1px solid ${color}30`,
                        }}
                    >
                        <Icon size={20} style={{ color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                    <p className="text-xs text-[#8b8ba7] leading-relaxed">{desc}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                TECH STACK
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4 bg-[#111118]/60">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 glass
                                rounded-full text-xs font-semibold text-emerald-400
                                border border-emerald-500/20 mb-4">
                    <Code2 size={11} />
                    Tech Stack
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    The tools behind the{' '}
                    <span className="gradient-text">magic.</span>
                </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techStack.map(({ category, color, icon: Icon, items }) => (
                    <div key={category} className="glass rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div
                        className="px-6 py-4 flex items-center gap-3"
                        style={{ borderBottom: `1px solid ${color}20` }}
                    >
                        <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: color + '20' }}
                        >
                        <Icon size={16} style={{ color }} />
                        </div>
                        <h3 className="font-bold text-white">{category}</h3>
                    </div>

                    {/* Items */}
                    <div className="p-4 space-y-3">
                        {items.map(({ name, desc }) => (
                        <div
                            key={name}
                            className="flex items-start gap-3 p-3 rounded-xl
                                    bg-white/2 hover:bg-white/4 transition-colors"
                        >
                            <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: color }}
                            />
                            <div>
                            <p className="text-sm font-semibold text-white">{name}</p>
                            <p className="text-xs text-[#8b8ba7] mt-0.5">{desc}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                BUILD TIMELINE
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    How it was{' '}
                    <span className="gradient-text">assembled.</span>
                </h2>
                <p className="text-[#8b8ba7] text-sm">
                    The project was built phase by phase, each building
                    on top of the last.
                </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                {/* vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-px
                                bg-gradient-to-b from-indigo-500/40
                                via-purple-500/40 to-transparent" />

                <div className="space-y-8">
                    {timeline.map(({ phase, title, desc, color }, i) => (
                    <div key={phase} className="flex gap-6 group">
                        {/* dot */}
                        <div className="relative shrink-0">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center
                                    justify-center text-xs font-black
                                    border transition-all duration-300
                                    group-hover:scale-110"
                            style={{
                            backgroundColor: color + '15',
                            borderColor: color + '40',
                            color,
                            }}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </div>
                        </div>

                        {/* content */}
                        <div
                        className="glass rounded-2xl p-5 flex-1
                                    group-hover:-translate-y-0.5
                                    transition-transform duration-300"
                        >
                        <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color }}
                        >
                            {phase}
                        </span>
                        <h3 className="font-bold text-white mt-1 mb-2">{title}</h3>
                        <p className="text-sm text-[#8b8ba7] leading-relaxed">{desc}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                AUTHOR / SOCIAL
            ══════════════════════════════════════════ */}
            <section className="py-20 px-4 bg-[#111118]/60">
            <div className="max-w-2xl mx-auto text-center">
                <div className="glass rounded-3xl p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br
                                from-indigo-600/8 via-purple-600/5 to-pink-600/8" />
                <div className="relative">
                    {/* Avatar */}
                    <div
                    className="w-20 h-20 bg-gradient-to-br from-indigo-600
                                to-purple-600 rounded-3xl flex items-center
                                justify-center mx-auto mb-5 text-3xl font-black
                                text-white shadow-2xl shadow-indigo-500/30"
                    >
                    D
                    </div>

                    <h3 className="text-xl font-black text-white mb-1">Developer</h3>
                    <p className="text-sm text-[#8b8ba7] mb-5">
                    Full-stack engineer · Next.js & Django enthusiast
                    </p>

                    <p className="text-sm text-[#8b8ba7] leading-relaxed mb-6">
                    Built as part of a technical challenge to demonstrate
                    clean architecture, aesthetic UI, and real-world
                    full-stack thinking. Every line written with intention.
                    </p>

                    {/* Social links */}
                    <div className="flex items-center justify-center gap-3">
                    {[
                        // { icon: Github, label: 'GitHub', href: '#' },
                        // { icon: Twitter, label: 'Twitter', href: '#' },
                        // { icon: Linkedin, label: 'LinkedIn', href: '#' },
                    ].map(({ icon: Icon, label, href }) => (
                        <a
                        key={label}
                        href={href}
                        className="flex items-center gap-2 px-4 py-2 glass
                                    rounded-xl text-sm text-[#8b8ba7]
                                    hover:text-white hover:border-indigo-500/40
                                    transition-all duration-200"
                        >
                        <Icon size={14} />
                        {label}
                        </a>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </section>

        </main>
        <LandingFooter />
        </>
    );
}