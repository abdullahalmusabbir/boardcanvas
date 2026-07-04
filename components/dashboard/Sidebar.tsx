'use client';

import { useAuth } from '@/context/AuthContext';
import {
    ChevronLeft, ChevronRight,
    ImageIcon,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const navItems = [
    {
        href: '/dashboard/tasks',
        label: 'Tasks',
        icon: LayoutDashboard,
        desc: 'Kanban board',
    },
    {
        href: '/dashboard/annotate',
        label: 'Annotate',
        icon: ImageIcon,
        desc: 'Image annotation',
    },
    {
        href: '/dashboard/profile',
        label: 'Profile',
        icon: User,
        desc: 'Your account',
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
        await logout();
        router.push('/');
        } finally {
        setLoggingOut(false);
        }
    };

    return (
        <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col
            border-r border-[#2a2a3a] bg-[#0d0d14]
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-16' : 'w-64'}`}
        >
        {/* ── Logo ── */}
        <div className={`flex items-center h-16 px-4 border-b border-[#2a2a3a]
                        ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center
                                justify-center shadow-lg shadow-indigo-500/30
                                group-hover:shadow-indigo-500/50 transition-shadow">
                <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">
                VisionBoard
                </span>
            </Link>
            )}

            {collapsed && (
            <Link href="/">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center
                                justify-center shadow-lg shadow-indigo-500/30">
                <Zap size={16} className="text-white" />
                </div>
            </Link>
            )}

            {/* collapse toggle — hidden on small screens */}
            <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg text-[#8b8ba7]
                        hover:text-white hover:bg-white/5 transition-all
                        ${collapsed ? 'mt-0' : ''}`}
            >
            {collapsed
                ? <ChevronRight size={16} />
                : <ChevronLeft size={16} />
            }
            </button>
        </div>

        {/* ── Nav Items ── */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname.startsWith(href);
            return (
                <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-xl transition-all
                    duration-200 group relative
                    ${collapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'}
                    ${active
                    ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-400'
                    : 'text-[#8b8ba7] hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                <Icon
                    size={18}
                    className={`shrink-0 transition-transform duration-200
                    ${active ? 'text-indigo-400' : ''}
                    group-hover:scale-110`}
                />
                {!collapsed && (
                    <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-none
                                    ${active ? 'text-indigo-300' : ''}`}>
                        {label}
                    </p>
                    <p className="text-[10px] text-[#4a4a6a] mt-0.5 leading-none">
                        {desc}
                    </p>
                    </div>
                )}

                {/* Active indicator */}
                {active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2
                                    w-0.5 h-6 bg-indigo-500 rounded-full" />
                )}

                {/* Tooltip when collapsed */}
                {collapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1
                                    bg-[#1a1a2e] border border-[#2a2a3a]
                                    rounded-lg text-xs text-white font-medium
                                    whitespace-nowrap opacity-0 pointer-events-none
                                    group-hover:opacity-100 transition-opacity
                                    shadow-xl z-50">
                    {label}
                    </div>
                )}
                </Link>
            );
            })}
        </nav>

        {/* ── Bottom: User + Logout ── */}
        <div className="px-2 py-4 border-t border-[#2a2a3a] space-y-1">
            {/* User info */}
            {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                <div className="w-8 h-8 bg-indigo-600/30 border border-indigo-500/30
                                rounded-full flex items-center justify-center
                                text-sm font-bold text-indigo-300 shrink-0">
                {user.username[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                    {user.username}
                </p>
                <p className="text-[10px] text-[#4a4a6a] truncate">
                    {user.email}
                </p>
                </div>
            </div>
            )}

            {/* Settings link */}
            <Link
            href="/dashboard/profile"
            title={collapsed ? 'Settings' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5
                        text-[#8b8ba7] hover:text-white hover:bg-white/5
                        transition-all duration-200 group relative
                        border border-transparent
                        ${collapsed ? 'justify-center' : ''}`}
            >
            <Settings size={16} className="shrink-0 group-hover:rotate-45
                                            transition-transform duration-300" />
            {!collapsed && (
                <span className="text-sm font-medium">Settings</span>
            )}
            {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1
                                bg-[#1a1a2e] border border-[#2a2a3a]
                                rounded-lg text-xs text-white font-medium
                                whitespace-nowrap opacity-0 pointer-events-none
                                group-hover:opacity-100 transition-opacity
                                shadow-xl z-50">
                Settings
                </div>
            )}
            </Link>

            {/* Logout */}
            <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5
                        text-[#8b8ba7] hover:text-red-400 hover:bg-red-500/10
                        border border-transparent hover:border-red-500/20
                        transition-all duration-200 group relative
                        disabled:opacity-50
                        ${collapsed ? 'justify-center' : ''}`}
            >
            {loggingOut
                ? <span className="w-4 h-4 border-2 border-current
                                border-t-transparent rounded-full animate-spin" />
                : <LogOut size={16} className="shrink-0" />
            }
            {!collapsed && (
                <span className="text-sm font-medium">
                {loggingOut ? 'Logging out...' : 'Logout'}
                </span>
            )}
            {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1
                                bg-[#1a1a2e] border border-[#2a2a3a]
                                rounded-lg text-xs text-white font-medium
                                whitespace-nowrap opacity-0 pointer-events-none
                                group-hover:opacity-100 transition-opacity
                                shadow-xl z-50">
                Logout
                </div>
            )}
            </button>
        </div>
        </aside>
    );
}