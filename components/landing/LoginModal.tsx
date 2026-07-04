'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    X, Mail, Lock, Eye, EyeOff,
    AlertCircle, Zap, ArrowRight,
} from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
        setTimeout(() => emailRef.current?.focus(), 100);
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = '';
        setEmail('');
        setPassword('');
        setError('');
        setShowPass(false);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        await login(email.trim(), password);
        onClose();
        router.push('/dashboard/tasks');
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
        setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative w-full max-w-md animate-scale-in">
            {/* Glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br
                            from-indigo-500/30 via-purple-500/20 to-pink-500/10 blur-sm" />

            <div className="relative glass rounded-2xl overflow-hidden shadow-2xl">
            {/* Top bar gradient */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center
                                    justify-center shadow-lg shadow-indigo-500/30">
                    <Zap size={22} className="text-white" />
                    </div>
                    <div>
                    <h2 className="text-xl font-bold text-white">Sign In</h2>
                    <p className="text-xs text-[#8b8ba7] mt-0.5">
                        Welcome back, warrior 🔥
                    </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-[#8b8ba7] hover:text-white
                            hover:bg-white/5 transition-all duration-200"
                >
                    <X size={18} />
                </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field */}
                <div>
                    <label className="block text-xs font-semibold text-[#8b8ba7]
                                    uppercase tracking-wider mb-2">
                    Email Address
                    </label>
                    <div className="relative group">
                    <Mail
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2
                                text-[#4a4a6a] group-focus-within:text-indigo-400
                                transition-colors duration-200"
                    />
                    <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f]/80
                                border border-[#2a2a3a] rounded-xl text-white text-sm
                                placeholder-[#3a3a5a]
                                focus:outline-none focus:border-indigo-500/60
                                focus:ring-2 focus:ring-indigo-500/20
                                transition-all duration-200"
                    />
                    </div>
                </div>

                {/* Password field */}
                <div>
                    <label className="block text-xs font-semibold text-[#8b8ba7]
                                    uppercase tracking-wider mb-2">
                    Password
                    </label>
                    <div className="relative group">
                    <Lock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2
                                text-[#4a4a6a] group-focus-within:text-indigo-400
                                transition-colors duration-200"
                    />
                    <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-11 py-3 bg-[#0a0a0f]/80
                                border border-[#2a2a3a] rounded-xl text-white text-sm
                                placeholder-[#3a3a5a]
                                focus:outline-none focus:border-indigo-500/60
                                focus:ring-2 focus:ring-indigo-500/20
                                transition-all duration-200"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2
                                text-[#4a4a6a] hover:text-white transition-colors"
                    >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2.5 p-3.5
                                    bg-red-500/8 border border-red-500/20
                                    rounded-xl text-red-400 text-sm animate-fade-in">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3
                            bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                            disabled:cursor-not-allowed text-white font-semibold
                            rounded-xl shadow-lg shadow-indigo-500/25
                            transition-all duration-200 hover:shadow-indigo-500/40
                            hover:scale-[1.01] active:scale-[0.99] mt-2"
                >
                    {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30
                                        border-t-white rounded-full animate-spin" />
                        Signing in...
                    </>
                    ) : (
                    <>
                        Sign In
                        <ArrowRight size={16} />
                    </>
                    )}
                </button>
                </form>

                {/* Bottom note */}
                <p className="text-center text-xs text-[#3a3a5a] mt-6">
                No account? Contact your admin to get access.
                </p>
            </div>
            </div>
        </div>
        </div>
    );
    }