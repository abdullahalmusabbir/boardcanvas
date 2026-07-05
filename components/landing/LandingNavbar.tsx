'use client';

import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, LogOut, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal'; 
import ForgotPasswordModal from './ForgotPasswordModal';
const navLinks = [
    { href: '/',         label: 'Home' },
    { href: '/about',    label: 'About' },
    { href: '/features', label: 'Features' },
];

export default function LandingNavbar() {
    const pathname = usePathname();
    const router   = useRouter();
    const { user, loading, logout } = useAuth();
    const [forgotOpen, setForgotOpen] = useState(false);

    const [scrolled,    setScrolled]    = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [loginOpen,   setLoginOpen]   = useState(false);
    const [signupOpen,  setSignupOpen]  = useState(false); 

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        setMobileOpen(false);
        router.push('/');
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
                    ${scrolled
                        ? 'glass shadow-lg shadow-black/20 border-b border-[#2a2a3a]/60'
                        : 'bg-transparent border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center
                                            justify-center shadow-lg shadow-indigo-500/30
                                            group-hover:shadow-indigo-500/60
                                            group-hover:scale-110 transition-all duration-300">
                                <Zap size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-white text-lg">VisionBoard</span>
                        </Link>

                        {/* ── Desktop Nav Links ── */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ href, label }) => {
                                const active = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium
                                            transition-all duration-200
                                            ${active
                                                ? 'text-white bg-white/8'
                                                : 'text-[#8b8ba7] hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ── Desktop Right Side ── */}
                        <div className="hidden md:flex items-center gap-3">
                            {loading ? (
                                <div className="w-24 h-9 bg-white/5 rounded-xl animate-pulse" />
                            ) : user ? (
                                /* ── logged in ── */
                                <div className="flex items-center gap-2">
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 glass
                                                    rounded-xl border border-[#2a2a3a]">
                                        <div className="w-6 h-6 bg-indigo-600/40 border
                                                        border-indigo-500/40 rounded-full flex
                                                        items-center justify-center text-xs
                                                        font-bold text-indigo-300">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm text-[#c4c4d4] font-medium">
                                            {user.username}
                                        </span>
                                    </div>
                                    {/* Dashboard button */}
                                    <button
                                        onClick={() => router.push('/dashboard/tasks')}
                                        className="flex items-center gap-1.5 px-4 py-2
                                                   rounded-xl text-sm font-semibold
                                                   bg-indigo-600 hover:bg-indigo-500
                                                   text-white shadow-lg shadow-indigo-500/25
                                                   hover:shadow-indigo-500/40
                                                   transition-all duration-200
                                                   hover:scale-105 active:scale-95"
                                    >
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </button>
                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3 py-2
                                                   rounded-xl text-sm font-medium
                                                   text-[#8b8ba7] hover:text-red-400
                                                   hover:bg-red-500/10 border border-transparent
                                                   hover:border-red-500/20 transition-all duration-200"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                /* ── not logged in ── */
                                <div className="flex items-center gap-2">
                                    {/*  Sign Up button */}
                                    <button
                                        onClick={() => setSignupOpen(true)}
                                        className="px-5 py-2 rounded-xl text-sm font-semibold
                                                   text-[#8b8ba7] hover:text-white
                                                   hover:bg-white/5 border border-[#2a2a3a]
                                                   hover:border-white/10
                                                   transition-all duration-200"
                                    >
                                        Sign Up
                                    </button>
                                    {/* Login button */}
                                    <button
                                        onClick={() => setLoginOpen(true)}
                                        className="px-5 py-2 rounded-xl text-sm font-semibold
                                                   bg-indigo-600 hover:bg-indigo-500 text-white
                                                   shadow-lg shadow-indigo-500/25
                                                   hover:shadow-indigo-500/40
                                                   transition-all duration-200
                                                   hover:scale-105 active:scale-95"
                                    >
                                        Login
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Mobile Menu Toggle ── */}
                        <button
                            className="md:hidden p-2 rounded-xl text-[#8b8ba7]
                                       hover:text-white hover:bg-white/5 transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                {mobileOpen && (
                    <div className="md:hidden glass border-t border-[#2a2a3a]/60
                                    animate-slide-up">
                        <div className="px-4 py-4 space-y-1">
                            {/* Nav links */}
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-2.5 rounded-xl text-sm
                                        font-medium transition-all duration-200
                                        ${pathname === href
                                            ? 'text-white bg-white/8'
                                            : 'text-[#8b8ba7] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div className="pt-2 border-t border-[#2a2a3a]/60 space-y-2">
                                {loading ? (
                                    <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                                ) : user ? (
                                    <>
                                        {/* user info */}
                                        <div className="flex items-center gap-2 px-4 py-2.5">
                                            <div className="w-7 h-7 bg-indigo-600/40 border
                                                            border-indigo-500/40 rounded-full flex
                                                            items-center justify-center text-xs
                                                            font-bold text-indigo-300">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm text-[#c4c4d4]">
                                                {user.username}
                                            </span>
                                        </div>
                                        {/* Dashboard */}
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                router.push('/dashboard/tasks');
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5
                                                       rounded-xl text-sm font-semibold
                                                       bg-indigo-600 hover:bg-indigo-500
                                                       text-white transition-all duration-200"
                                        >
                                            <LayoutDashboard size={15} />
                                            Go to Dashboard
                                        </button>
                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5
                                                       rounded-xl text-sm font-medium text-red-400
                                                       hover:bg-red-500/10 border border-red-500/20
                                                       transition-all duration-200"
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/*  Sign Up mobile */}
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                setSignupOpen(true);
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl
                                                       text-sm font-semibold
                                                       text-[#8b8ba7] hover:text-white
                                                       border border-[#2a2a3a]
                                                       hover:bg-white/5
                                                       transition-all duration-200"
                                        >
                                            Sign Up
                                        </button>
                                        {/* Login mobile */}
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                setLoginOpen(true);
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl
                                                       text-sm font-semibold
                                                       bg-indigo-600 hover:bg-indigo-500
                                                       text-white transition-all duration-200"
                                        >
                                            Login
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Modals ── */}
            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToSignup={() => {          
                    setLoginOpen(false);
                    setSignupOpen(true);
                }}
                onForgotPassword={() => {
                    setLoginOpen(false);
                    setForgotOpen(true);
                }}
            />
            <SignupModal
                isOpen={signupOpen}
                onClose={() => setSignupOpen(false)}
                onSwitchToLogin={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                }}
            />
            <ForgotPasswordModal
                isOpen={forgotOpen}
                onClose={() => setForgotOpen(false)}
                onSwitchToLogin={() => {
                setForgotOpen(false);
                setLoginOpen(true);
                }}
            />
        </>
    );
}