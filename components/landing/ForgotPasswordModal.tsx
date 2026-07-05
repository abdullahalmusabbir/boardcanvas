'use client';

import { authApi } from '@/lib/api';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    KeyRound,
    Lock,
    Mail,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: ForgotPasswordModalProps) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
        setStep('email');
        setEmail('');
        setOtp('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        }
    }, [isOpen]);

    // ESC key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Step 1 — Email submit
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        await authApi.forgotPasswordRequest(email.trim());
        setStep('otp');
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
        setLoading(false);
        }
    };

    // Step 2 — OTP submit
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        const data = await authApi.forgotPasswordVerify(email.trim(), otp.trim());
        setResetToken(data.reset_token);
        setStep('reset');
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid OTP');
        } finally {
        setLoading(false);
        }
    };

    // Step 3 — New Password submit
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
        }
        if (newPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
        }

        setLoading(true);
        try {
        await authApi.forgotPasswordReset(
            email.trim(),
            resetToken,
            newPassword
        );
        setStep('success');
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Reset failed');
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

        {/* Modal */}
        <div className="relative w-full max-w-md animate-scale-in">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br
            from-indigo-500/30 via-purple-500/20 to-pink-500/10 blur-sm" />

            <div className="relative glass rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-1 w-full bg-gradient-to-r
                from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-600 rounded-xl
                    flex items-center justify-center
                    shadow-lg shadow-indigo-500/30">
                    <KeyRound size={22} className="text-white" />
                    </div>
                    <div>
                    <h2 className="text-xl font-bold text-white">
                        {step === 'email' && 'Forgot Password'}
                        {step === 'otp' && 'Enter OTP'}
                        {step === 'reset' && 'New Password'}
                        {step === 'success' && 'All Done!'}
                    </h2>
                    <p className="text-xs text-[#8b8ba7] mt-0.5">
                        {step === 'email' && 'Enter your email to receive OTP'}
                        {step === 'otp' && `OTP sent to ${email}`}
                        {step === 'reset' && 'Choose a strong password'}
                        {step === 'success' && 'Password changed successfully'}
                    </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-[#8b8ba7]
                    hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <X size={18} />
                </button>
                </div>

                {/* Step Indicator */}
                {step !== 'success' && (
                <div className="flex items-center gap-2 mb-6">
                    {(['email', 'otp', 'reset'] as Step[]).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center
                        justify-center text-xs font-bold transition-all duration-300
                        ${step === s
                            ? 'bg-indigo-600 text-white'
                            : ['email', 'otp', 'reset'].indexOf(step) > i
                            ? 'bg-green-500 text-white'
                            : 'bg-[#2a2a3a] text-[#8b8ba7]'
                        }`}>
                        {['email', 'otp', 'reset'].indexOf(step) > i
                            ? '✓'
                            : i + 1}
                        </div>
                        {i < 2 && (
                        <div className={`h-px w-8 transition-all duration-300
                            ${['email', 'otp', 'reset'].indexOf(step) > i
                            ? 'bg-green-500'
                            : 'bg-[#2a2a3a]'
                            }`} />
                        )}
                    </div>
                    ))}
                </div>
                )}

                {/* ── STEP 1: Email ── */}
                {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                    <div>
                    <label className="block text-xs font-semibold
                        text-[#8b8ba7] uppercase tracking-wider mb-2">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail size={15} className="absolute left-3.5 top-1/2
                        -translate-y-1/2 text-[#4a4a6a]
                        group-focus-within:text-indigo-400
                        transition-colors duration-200" />
                        <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        className="w-full pl-10 pr-4 py-3
                            bg-[#0a0a0f]/80 border border-[#2a2a3a]
                            rounded-xl text-white text-sm placeholder-[#3a3a5a]
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20
                            transition-all duration-200"
                        />
                    </div>
                    </div>

                    {error && (
                    <div className="flex items-center gap-2.5 p-3.5
                        bg-red-500/8 border border-red-500/20
                        rounded-xl text-red-400 text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                    )}

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center
                        gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                        disabled:opacity-60 disabled:cursor-not-allowed
                        text-white font-semibold rounded-xl
                        shadow-lg shadow-indigo-500/25
                        transition-all duration-200
                        hover:scale-[1.01] active:scale-[0.99] mt-2"
                    >
                    {loading ? (
                        <>
                        <span className="w-4 h-4 border-2
                            border-white/30 border-t-white
                            rounded-full animate-spin" />
                        Sending OTP...
                        </>
                    ) : (
                        <>
                        Send OTP
                        <ArrowRight size={16} />
                        </>
                    )}
                    </button>
                </form>
                )}

                {/* ── STEP 2: OTP ── */}
                {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                    <div>
                    <label className="block text-xs font-semibold
                        text-[#8b8ba7] uppercase tracking-wider mb-2">
                        6-Digit OTP
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                        )}
                        placeholder="123456"
                        required
                        autoFocus
                        maxLength={6}
                        className="w-full px-4 py-3 text-center
                        bg-[#0a0a0f]/80 border border-[#2a2a3a]
                        rounded-xl text-white text-2xl
                        font-bold tracking-[0.5em]
                        placeholder-[#3a3a5a]
                        focus:outline-none focus:border-indigo-500/60
                        focus:ring-2 focus:ring-indigo-500/20
                        transition-all duration-200"
                    />
                    <p className="text-xs text-[#4a4a6a] mt-2 text-center">
                        OTP expires in 10 minutes
                    </p>
                    </div>

                    {error && (
                    <div className="flex items-center gap-2.5 p-3.5
                        bg-red-500/8 border border-red-500/20
                        rounded-xl text-red-400 text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                    )}

                    <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center
                        gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                        disabled:opacity-60 disabled:cursor-not-allowed
                        text-white font-semibold rounded-xl
                        shadow-lg shadow-indigo-500/25
                        transition-all duration-200
                        hover:scale-[1.01] active:scale-[0.99] mt-2"
                    >
                    {loading ? (
                        <>
                        <span className="w-4 h-4 border-2
                            border-white/30 border-t-white
                            rounded-full animate-spin" />
                        Verifying...
                        </>
                    ) : (
                        <>
                        Verify OTP
                        <ArrowRight size={16} />
                        </>
                    )}
                    </button>

                    <button
                    type="button"
                    onClick={() => {
                        setStep('email');
                        setOtp('');
                        setError('');
                    }}
                    className="w-full text-center text-xs text-[#4a4a6a]
                        hover:text-white transition-colors mt-1"
                    >
                    ← Back to email
                    </button>
                </form>
                )}

                {/* ── STEP 3: New Password ── */}
                {step === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-5">
                    <div>
                    <label className="block text-xs font-semibold
                        text-[#8b8ba7] uppercase tracking-wider mb-2">
                        New Password
                    </label>
                    <div className="relative group">
                        <Lock size={15} className="absolute left-3.5 top-1/2
                        -translate-y-1/2 text-[#4a4a6a]
                        group-focus-within:text-indigo-400
                        transition-colors duration-200" />
                        <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoFocus
                        className="w-full pl-10 pr-4 py-3
                            bg-[#0a0a0f]/80 border border-[#2a2a3a]
                            rounded-xl text-white text-sm placeholder-[#3a3a5a]
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20
                            transition-all duration-200"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold
                        text-[#8b8ba7] uppercase tracking-wider mb-2">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <Lock size={15} className="absolute left-3.5 top-1/2
                        -translate-y-1/2 text-[#4a4a6a]
                        group-focus-within:text-indigo-400
                        transition-colors duration-200" />
                        <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-3
                            bg-[#0a0a0f]/80 border border-[#2a2a3a]
                            rounded-xl text-white text-sm placeholder-[#3a3a5a]
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20
                            transition-all duration-200"
                        />
                    </div>
                    </div>

                    {error && (
                    <div className="flex items-center gap-2.5 p-3.5
                        bg-red-500/8 border border-red-500/20
                        rounded-xl text-red-400 text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                    )}

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center
                        gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                        disabled:opacity-60 disabled:cursor-not-allowed
                        text-white font-semibold rounded-xl
                        shadow-lg shadow-indigo-500/25
                        transition-all duration-200
                        hover:scale-[1.01] active:scale-[0.99] mt-2"
                    >
                    {loading ? (
                        <>
                        <span className="w-4 h-4 border-2
                            border-white/30 border-t-white
                            rounded-full animate-spin" />
                        Resetting...
                        </>
                    ) : (
                        <>
                        Reset Password
                        <ArrowRight size={16} />
                        </>
                    )}
                    </button>
                </form>
                )}

                {/* ── STEP 4: Success ── */}
                {step === 'success' && (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full
                    flex items-center justify-center mx-auto mb-4
                    border border-green-500/20">
                    <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">
                    Password Reset Successful!
                    </h3>
                    <p className="text-[#8b8ba7] text-sm mb-6">
                    Your password has been updated. You can now login with your new password.
                    </p>
                    <button
                    onClick={() => {
                        onClose();
                        onSwitchToLogin?.();
                    }}
                    className="w-full flex items-center justify-center
                        gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                        text-white font-semibold rounded-xl
                        transition-all duration-200
                        hover:scale-[1.01] active:scale-[0.99]"
                    >
                    Go to Login
                    <ArrowRight size={16} />
                    </button>
                </div>
                )}

                {/* Back to Login */}
                {step !== 'success' && (
                <p className="text-center text-xs text-[#3a3a5a] mt-6">
                    Remember your password?{' '}
                    <button
                    onClick={() => {
                        onClose();
                        onSwitchToLogin?.();
                    }}
                    className="text-purple-400 hover:text-purple-300
                        font-semibold transition-colors"
                    >
                    Sign In
                    </button>
                </p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}