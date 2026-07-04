'use client';

import LandingFooter from '@/components/landing/LandingFooter';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LoginModal from '@/components/landing/LoginModal';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Download,
    Eye,
    Filter,
    GripVertical,
    ImageIcon,
    Layers,
    LayoutDashboard,
    MousePointer2,
    Palette,
    RefreshCw,
    Tag,
    Zap
} from 'lucide-react';
import { useState } from 'react';

/* ─── data ─────────────────────────────────────────────────── */
const taskFeatures = [
    {
        icon: LayoutDashboard,
        title: 'Kanban Board',
        desc: 'Three-column board with To Do, In Progress, and Done. See everything at a glance.',
        color: '#6366f1',
    },
    {
        icon: GripVertical,
        title: 'Drag & Drop',
        desc: 'Grab any task card and drag it between columns. Order updates are saved instantly.',
        color: '#a855f7',
    },
    {
        icon: Calendar,
        title: 'Date Selector',
        desc: 'Pick any date and the board filters to show only tasks scheduled for that day.',
        color: '#ec4899',
    },
    {
        icon: Tag,
        title: 'Custom Tags',
        desc: 'Create color-coded tags and attach them to tasks for quick categorization.',
        color: '#10b981',
    },
    {
        icon: Filter,
        title: 'Priority Levels',
        desc: 'Assign Low, Medium, High, or Urgent priority to each task. Never miss critical work.',
        color: '#f59e0b',
    },
    {
        icon: RefreshCw,
        title: 'Real-time Sync',
        desc: 'All changes persist immediately to the Django backend. Refresh anytime — your data is safe.',
        color: '#06b6d4',
    },
];

const annotateFeatures = [
    {
        icon: ImageIcon,
        title: 'Image Upload',
        desc: 'Upload multiple images directly from your device. They\'re stored securely on the backend.',
        color: '#6366f1',
    },
    {
        icon: Layers,
        title: 'Image Carousel',
        desc: 'Scroll through all your uploaded images in a smooth carousel. Switch context instantly.',
        color: '#a855f7',
    },
    {
        icon: MousePointer2,
        title: 'Polygon Drawing',
        desc: 'Click to place points on the canvas. Close the shape to form a precise polygon annotation.',
        color: '#ec4899',
    },
    {
        icon: Palette,
        title: 'Colored Labels',
        desc: 'Give each polygon a custom color and label. Distinguish object classes visually.',
        color: '#10b981',
    },
    {
        icon: Eye,
        title: 'Toggle Visibility',
        desc: 'Show or hide individual polygons to inspect complex annotations layer by layer.',
        color: '#f59e0b',
    },
    {
        icon: Download,
        title: 'Persistent Save',
        desc: 'Polygons are saved to the database via the API. Re-open any image and your work is there.',
        color: '#06b6d4',
    },
];

const comparisons = [
    { feature: 'Kanban Board', us: true, others: true },
    { feature: 'Date-based task filter', us: true, others: false },
    { feature: 'Image annotation', us: true, others: false },
    { feature: 'Polygon drawing', us: true, others: false },
    { feature: 'Persistent annotations', us: true, others: false },
    { feature: 'Dark-mode first UI', us: true, others: false },
    { feature: 'Custom colored tags', us: true, others: true },
    { feature: 'Per-user data isolation', us: true, others: true },
    { feature: 'REST API backend', us: true, others: false },
    { feature: 'TypeScript frontend', us: true, others: false },
];

/* ─── tab types ─────────────────────────────────────────────── */
type Tab = 'tasks' | 'annotate';

/* ─── page ──────────────────────────────────────────────────── */
export default function FeaturesPage() {
    const [tab, setTab] = useState<Tab>('tasks');
    const [loginOpen, setLoginOpen] = useState(false);

    const activeFeatures = tab === 'tasks' ? taskFeatures : annotateFeatures;

    return (
        <>
        <LandingNavbar />
        <main className="pt-16">

            {/* ══════════════════════════════════════════
                HERO
            ══════════════════════════════════════════ */}
            <section className="relative py-28 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-96 h-96
                                bg-indigo-600/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-72 h-72
                                bg-purple-600/8 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass
                                rounded-full border border-indigo-500/30
                                text-xs font-semibold text-indigo-400 mb-6">
                <Zap size={11} className="animate-pulse" />
                Full Feature Breakdown
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black
                            text-white leading-tight mb-6">
                Packed with
                <br />
                <span className="gradient-text">the right features.</span>
                </h1>

                <p className="text-base sm:text-lg text-[#8b8ba7] max-w-2xl
                            mx-auto leading-relaxed mb-10">
                No feature bloat. No enterprise nonsense. Just two powerful
                tools built to perfection — a Kanban board and an annotation
                canvas that actually work together.
                </p>

                <button
                onClick={() => setLoginOpen(true)}
                className="group inline-flex items-center gap-2 px-8 py-3.5
                            bg-indigo-600 hover:bg-indigo-500 text-white
                            font-semibold rounded-2xl text-sm
                            shadow-xl shadow-indigo-500/30
                            hover:shadow-indigo-500/50
                            transition-all duration-300
                            hover:scale-105 active:scale-95"
                >
                Try It Free
                <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                />
                </button>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                TAB SWITCHER + FEATURE GRID
            ══════════════════════════════════════════ */}
            <section className="py-20 px-4 bg-[#111118]/60">
            <div className="max-w-6xl mx-auto">

                {/* Tabs */}
                <div className="flex justify-center mb-14">
                <div className="glass rounded-2xl p-1.5 flex gap-1">
                    {(
                    [
                        { key: 'tasks', label: 'Task Board', icon: LayoutDashboard },
                        { key: 'annotate', label: 'Annotation Tool', icon: ImageIcon },
                    ] as const
                    ).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl
                        text-sm font-semibold transition-all duration-300
                        ${tab === key
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-[#8b8ba7] hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Icon size={15} />
                        {label}
                    </button>
                    ))}
                </div>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeFeatures.map(({ icon: Icon, title, desc, color }) => (
                    <div
                    key={title}
                    className="glass rounded-2xl p-6 group
                                hover:-translate-y-1 hover:shadow-xl
                                hover:shadow-black/40 transition-all duration-300"
                    >
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center
                                justify-center mb-5 group-hover:scale-110
                                transition-transform duration-300"
                        style={{
                        backgroundColor: color + '18',
                        border: `1px solid ${color}30`,
                        }}
                    >
                        <Icon size={22} style={{ color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2">{title}</h3>
                    <p className="text-sm text-[#8b8ba7] leading-relaxed">{desc}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                DEEP DIVE — TASK BOARD
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Visual mock */}
                <div className="relative order-2 lg:order-1">
                    <div className="absolute -inset-4 bg-gradient-to-br
                                    from-indigo-500/10 to-purple-500/5
                                    rounded-3xl blur-xl" />
                    <div className="relative glass rounded-2xl p-5 space-y-3">
                    {/* Date bar */}
                    <div className="flex items-center justify-between
                                    pb-3 border-b border-[#2a2a3a]">
                        <span className="text-xs font-semibold text-[#8b8ba7]">
                        📅 Today — Tasks
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-indigo-600/20
                                        text-indigo-400 rounded-full border
                                        border-indigo-500/20">
                        3 tasks
                        </span>
                    </div>

                    {/* Kanban columns preview */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                        {
                            label: 'To Do', color: '#6366f1',
                            cards: ['Fix bug #42', 'Write docs'],
                        },
                        {
                            label: 'In Progress', color: '#f59e0b',
                            cards: ['API review'],
                        },
                        {
                            label: 'Done', color: '#10b981',
                            cards: ['Auth setup'],
                        },
                        ].map(col => (
                        <div key={col.label}>
                            <div className="text-[9px] font-bold uppercase
                                            tracking-wider mb-2 flex items-center gap-1"
                            style={{ color: col.color }}
                            >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: col.color }}
                            />
                            {col.label}
                            </div>
                            <div className="space-y-2">
                            {col.cards.map(c => (
                                <div
                                key={c}
                                className="p-2 bg-[#16161f] rounded-lg
                                            border border-[#2a2a3a] text-[9px]
                                            text-[#c4c4d4]"
                                >
                                {c}
                                <div
                                    className="mt-1.5 h-0.5 rounded-full w-2/3"
                                    style={{ backgroundColor: col.color + '40' }}
                                />
                                </div>
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* priority badges */}
                    <div className="flex gap-2 pt-2">
                        {[
                        { l: 'Low', c: '#10b981' },
                        { l: 'Medium', c: '#f59e0b' },
                        { l: 'High', c: '#ef4444' },
                        { l: 'Urgent', c: '#ec4899' },
                        ].map(({ l, c }) => (
                        <span
                            key={l}
                            className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{
                            backgroundColor: c + '20',
                            color: c,
                            border: `1px solid ${c}30`,
                            }}
                        >
                            {l}
                        </span>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Text */}
                <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 glass
                                    rounded-full text-xs font-semibold text-indigo-400
                                    border border-indigo-500/20 mb-5">
                    <LayoutDashboard size={11} />
                    Task Board Deep Dive
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
                    Your tasks,
                    <br />
                    <span className="gradient-text">beautifully organized.</span>
                    </h2>
                    <div className="space-y-4">
                    {[
                        'Drag tasks between columns — order persists to the database',
                        'Filter by date using the shared DateSelector component',
                        'Assign Low / Medium / High / Urgent priority to every task',
                        'Add multi-colored tags to categorize work in seconds',
                        'Create, edit, or delete tasks through clean modal dialogs',
                        'Context-based date state shared across all board components',
                    ].map(item => (
                        <div key={item} className="flex items-start gap-3">
                        <CheckCircle2
                            size={16}
                            className="text-indigo-400 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-[#8b8ba7]">{item}</p>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                DEEP DIVE — ANNOTATION
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4 bg-[#111118]/60">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 glass
                                    rounded-full text-xs font-semibold text-pink-400
                                    border border-pink-500/20 mb-5">
                    <ImageIcon size={11} />
                    Annotation Deep Dive
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
                    Annotate images
                    <br />
                    <span className="gradient-text">with precision.</span>
                    </h2>
                    <div className="space-y-4">
                    {[
                        'Upload images directly — stored securely on the backend',
                        'Browse images in a smooth horizontal carousel',
                        'Click to place polygon vertices on the canvas',
                        'Close any polygon to finalize the annotation region',
                        'Assign a label and color to each polygon shape',
                        'Save all polygons per image via bulk API endpoint',
                        'Delete individual polygons without affecting others',
                    ].map(item => (
                        <div key={item} className="flex items-start gap-3">
                        <CheckCircle2
                            size={16}
                            className="text-pink-400 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-[#8b8ba7]">{item}</p>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Visual mock */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br
                                    from-pink-500/10 to-purple-500/5
                                    rounded-3xl blur-xl" />
                    <div className="relative glass rounded-2xl overflow-hidden">
                    {/* Canvas area */}
                    <div className="h-52 bg-gradient-to-br from-[#1a1a2e]
                                    via-[#16213e] to-[#0f3460] relative">
                        <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 400 220"
                        >
                        {/* polygon 1 */}
                        <polygon
                            points="80,40 200,25 240,90 180,160 60,140"
                            fill="rgba(99,102,241,0.15)"
                            stroke="#6366f1"
                            strokeWidth="1.5"
                        />
                        {[
                            [80, 40], [200, 25], [240, 90],
                            [180, 160], [60, 140],
                        ].map(([x, y]) => (
                            <circle key={`${x}-${y}`}
                            cx={x} cy={y} r="4"
                            fill="#6366f1"
                            stroke="white" strokeWidth="1"
                            />
                        ))}

                        {/* polygon 2 */}
                        <polygon
                            points="260,50 340,60 330,130 250,120"
                            fill="rgba(236,72,153,0.12)"
                            stroke="#ec4899"
                            strokeWidth="1.5"
                        />
                        {[
                            [260, 50], [340, 60],
                            [330, 130], [250, 120],
                        ].map(([x, y]) => (
                            <circle key={`${x}-${y}`}
                            cx={x} cy={y} r="4"
                            fill="#ec4899"
                            stroke="white" strokeWidth="1"
                            />
                        ))}

                        {/* cursor dot */}
                        <circle cx="310" cy="180" r="5"
                            fill="white" opacity="0.6" />
                        <circle cx="310" cy="180" r="10"
                            fill="none" stroke="white"
                            strokeWidth="1" opacity="0.3" />
                        </svg>

                        {/* labels */}
                        <div className="absolute top-2 left-2 flex gap-2">
                        {[
                            { label: 'Object A', color: '#6366f1' },
                            { label: 'Object B', color: '#ec4899' },
                        ].map(({ label, color }) => (
                            <div
                            key={label}
                            className="flex items-center gap-1 px-2 py-0.5
                                        rounded-full text-[9px] font-semibold
                                        text-white"
                            style={{
                                backgroundColor: color + '90',
                                border: `1px solid ${color}60`,
                            }}
                            >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            {label}
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* image strip */}
                    <div className="p-4 flex gap-2 overflow-x-auto">
                        {[
                        { active: true, color: '#6366f1' },
                        { active: false, color: '#2a2a3a' },
                        { active: false, color: '#2a2a3a' },
                        ].map(({ active, color }, i) => (
                        <div
                            key={i}
                            className="w-14 h-10 rounded-lg shrink-0 border-2
                                    transition-colors"
                            style={{
                            backgroundColor: color + '20',
                            borderColor: active ? color : '#2a2a3a',
                            }}
                        />
                        ))}
                        <div className="w-14 h-10 rounded-lg shrink-0 border-2
                                        border-dashed border-[#2a2a3a] flex
                                        items-center justify-center text-[#4a4a6a]
                                        text-lg">
                        +
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                COMPARISON TABLE
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                    Why{' '}
                    <span className="gradient-text">VisionBoard App?</span>
                </h2>
                <p className="text-[#8b8ba7] text-sm">
                    See how we stack up against generic task tools.
                </p>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                {/* table header */}
                <div className="grid grid-cols-3 px-6 py-4 border-b border-[#2a2a3a]">
                    <span className="text-xs font-semibold text-[#8b8ba7] uppercase
                                    tracking-wider">
                    Feature
                    </span>
                    <span className="text-xs font-semibold text-indigo-400 uppercase
                                    tracking-wider text-center">
                    VisionBoard App
                    </span>
                    <span className="text-xs font-semibold text-[#8b8ba7] uppercase
                                    tracking-wider text-center">
                    Others
                    </span>
                </div>

                {/* rows */}
                {comparisons.map(({ feature, us, others }, i) => (
                    <div
                    key={feature}
                    className={`grid grid-cols-3 px-6 py-3.5 items-center
                        ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}
                        border-b border-[#2a2a3a]/50 last:border-0`}
                    >
                    <span className="text-sm text-[#c4c4d4]">{feature}</span>
                    <div className="flex justify-center">
                        {us
                        ? <CheckCircle2 size={18} className="text-indigo-400" />
                        : <span className="text-[#3a3a5a] text-lg">—</span>
                        }
                    </div>
                    <div className="flex justify-center">
                        {others
                        ? <CheckCircle2 size={18} className="text-[#8b8ba7]" />
                        : <span className="text-[#3a3a5a] text-lg">—</span>
                        }
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* ══════════════════════════════════════════
                CTA
            ══════════════════════════════════════════ */}
            <section className="py-24 px-4 bg-[#111118]/60">
            <div className="max-w-2xl mx-auto text-center">
                <div className="glass rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br
                                from-indigo-600/10 via-purple-600/5
                                to-pink-600/10 rounded-3xl" />
                <div className="relative">
                    <div className="text-5xl mb-5">⚡</div>
                    <h2 className="text-3xl font-black text-white mb-4">
                    See it in action.
                    </h2>
                    <p className="text-[#8b8ba7] mb-8 text-sm leading-relaxed">
                    Sign in and explore the full Kanban board and
                    annotation tool — no setup required.
                    </p>
                    <button
                    onClick={() => setLoginOpen(true)}
                    className="group inline-flex items-center gap-2 px-10 py-4
                                bg-indigo-600 hover:bg-indigo-500 text-white
                                font-bold rounded-2xl text-sm
                                shadow-xl shadow-indigo-500/30
                                hover:shadow-indigo-500/50
                                transition-all duration-300
                                hover:scale-105 active:scale-95"
                    >
                    Launch Dashboard
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
        </>
    );
}