'use client';

import { authApi } from '@/lib/api';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Eye, EyeOff,
    Lock,
    Mail,
    User,
    X,
    Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function SignupModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: SignupModalProps) {
    const router = useRouter();

    const [username, setUsername]   = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [showPass, setShowPass]   = useState(false);
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState(false);
    const [loading, setLoading]     = useState(false);

    const usernameRef = useRef<HTMLInputElement>(null);

    // ── focus & body scroll ──
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => usernameRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // reset
            setUsername('');
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setError('');
            setSuccess(false);
            setShowPass(false);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── ESC close ──
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
            await authApi.signup({
                username: username.trim(),
                email: email.trim(),
                password,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
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
                                from-purple-500/30 via-indigo-500/20 to-pink-500/10 blur-sm" />

                <div className="relative glass rounded-2xl overflow-hidden shadow-2xl">
                    {/* Top bar */}
                    <div className="h-1 w-full bg-gradient-to-r
                                    from-purple-500 via-indigo-500 to-pink-500" />

                    <div className="p-8">
                        {/* ── Success State ── */}
                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-emerald-500/10 border
                                                border-emerald-500/20 rounded-2xl
                                                flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Account Created! 🎉
                                </h2>
                                <p className="text-sm text-[#8b8ba7] mb-6">
                                    Your account is ready. Please login to continue.
                                </p>
                                <button
                                    onClick={() => {
                                        onClose();
                                        onSwitchToLogin();
                                    }}
                                    className="w-full flex items-center justify-center gap-2
                                               py-3 bg-indigo-600 hover:bg-indigo-500
                                               text-white font-semibold rounded-xl
                                               transition-all duration-200
                                               hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Go to Login
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 bg-purple-600 rounded-xl
                                                        flex items-center justify-center
                                                        shadow-lg shadow-purple-500/30">
                                            <Zap size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                Create Account
                                            </h2>
                                            <p className="text-xs text-[#8b8ba7] mt-0.5">
                                                Join VisionBoard today ✨
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-xl text-[#8b8ba7]
                                                   hover:text-white hover:bg-white/5
                                                   transition-all duration-200"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">

                                    {/* Username */}
                                    <div>
                                        <label className="block text-xs font-semibold
                                                          text-[#8b8ba7] uppercase
                                                          tracking-wider mb-2">
                                            Username *
                                        </label>
                                        <div className="relative group">
                                            <User
                                                size={15}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                           text-[#4a4a6a]
                                                           group-focus-within:text-purple-400
                                                           transition-colors duration-200"
                                            />
                                            <input
                                                ref={usernameRef}
                                                type="text"
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                placeholder="johndoe"
                                                required
                                                className="w-full pl-10 pr-4 py-3
                                                           bg-[#0a0a0f]/80
                                                           border border-[#2a2a3a]
                                                           rounded-xl text-white text-sm
                                                           placeholder-[#3a3a5a]
                                                           focus:outline-none
                                                           focus:border-purple-500/60
                                                           focus:ring-2
                                                           focus:ring-purple-500/20
                                                           transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* First + Last name row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold
                                                              text-[#8b8ba7] uppercase
                                                              tracking-wider mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                placeholder="John"
                                                className="w-full px-3 py-3
                                                           bg-[#0a0a0f]/80
                                                           border border-[#2a2a3a]
                                                           rounded-xl text-white text-sm
                                                           placeholder-[#3a3a5a]
                                                           focus:outline-none
                                                           focus:border-purple-500/60
                                                           focus:ring-2
                                                           focus:ring-purple-500/20
                                                           transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold
                                                              text-[#8b8ba7] uppercase
                                                              tracking-wider mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                className="w-full px-3 py-3
                                                           bg-[#0a0a0f]/80
                                                           border border-[#2a2a3a]
                                                           rounded-xl text-white text-sm
                                                           placeholder-[#3a3a5a]
                                                           focus:outline-none
                                                           focus:border-purple-500/60
                                                           focus:ring-2
                                                           focus:ring-purple-500/20
                                                           transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold
                                                          text-[#8b8ba7] uppercase
                                                          tracking-wider mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative group">
                                            <Mail
                                                size={15}
                                                className="absolute left-3.5 top-1/2
                                                           -translate-y-1/2 text-[#4a4a6a]
                                                           group-focus-within:text-purple-400
                                                           transition-colors duration-200"
                                            />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full pl-10 pr-4 py-3
                                                           bg-[#0a0a0f]/80
                                                           border border-[#2a2a3a]
                                                           rounded-xl text-white text-sm
                                                           placeholder-[#3a3a5a]
                                                           focus:outline-none
                                                           focus:border-purple-500/60
                                                           focus:ring-2
                                                           focus:ring-purple-500/20
                                                           transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs font-semibold
                                                          text-[#8b8ba7] uppercase
                                                          tracking-wider mb-2">
                                            Password *
                                        </label>
                                        <div className="relative group">
                                            <Lock
                                                size={15}
                                                className="absolute left-3.5 top-1/2
                                                           -translate-y-1/2 text-[#4a4a6a]
                                                           group-focus-within:text-purple-400
                                                           transition-colors duration-200"
                                            />
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="min 6 characters"
                                                required
                                                minLength={6}
                                                className="w-full pl-10 pr-11 py-3
                                                           bg-[#0a0a0f]/80
                                                           border border-[#2a2a3a]
                                                           rounded-xl text-white text-sm
                                                           placeholder-[#3a3a5a]
                                                           focus:outline-none
                                                           focus:border-purple-500/60
                                                           focus:ring-2
                                                           focus:ring-purple-500/20
                                                           transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="absolute right-3.5 top-1/2
                                                           -translate-y-1/2 text-[#4a4a6a]
                                                           hover:text-white transition-colors"
                                            >
                                                {showPass
                                                    ? <EyeOff size={15} />
                                                    : <Eye size={15} />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2.5 p-3.5
                                                        bg-red-500/8 border border-red-500/20
                                                        rounded-xl text-red-400 text-sm
                                                        animate-fade-in">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center
                                                   gap-2 py-3 bg-purple-600
                                                   hover:bg-purple-500
                                                   disabled:opacity-60
                                                   disabled:cursor-not-allowed
                                                   text-white font-semibold rounded-xl
                                                   shadow-lg shadow-purple-500/25
                                                   transition-all duration-200
                                                   hover:shadow-purple-500/40
                                                   hover:scale-[1.01]
                                                   active:scale-[0.99] mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2
                                                                 border-white/30
                                                                 border-t-white
                                                                 rounded-full
                                                                 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Switch to login */}
                                <p className="text-center text-xs text-[#3a3a5a] mt-6">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onSwitchToLogin();
                                        }}
                                        className="text-indigo-400 hover:text-indigo-300
                                                   font-semibold transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}