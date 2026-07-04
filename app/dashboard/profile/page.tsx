'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
    User, Mail, Shield, Calendar,
    LogOut, CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
        router.push('/');
    };

    if (!user) return null;

    const infoItems = [
        {
        icon: User,
        label: 'Username',
        value: user.username,
        color: '#6366f1',
        },
        {
        icon: Mail,
        label: 'Email',
        value: user.email,
        color: '#a855f7',
        },
        {
        icon: Shield,
        label: 'Account Status',
        value: user.active ? 'Active' : 'Inactive',
        color: user.active ? '#10b981' : '#ef4444',
        },
        {
        icon: User,
        label: 'Full Name',
        value: [user.first_name, user.last_name].filter(Boolean).join(' ') || '—',
        color: '#f59e0b',
        },
    ];

    return (
        <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-purple-600/20 border border-purple-500/30
                            rounded-xl flex items-center justify-center">
                <User size={18} className="text-purple-400" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white">Profile</h1>
                <p className="text-xs text-[#8b8ba7]">Your account details</p>
            </div>
            </div>

            {/* Avatar card */}
            <div className="glass rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br
                            from-indigo-600/8 via-transparent to-purple-600/8" />
            <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600
                                to-purple-600 rounded-3xl flex items-center
                                justify-center mx-auto mb-4 text-4xl font-black
                                text-white shadow-2xl shadow-indigo-500/30">
                {user.username[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-black text-white mb-1">
                {user.username}
                </h2>
                <p className="text-sm text-[#8b8ba7]">{user.email}</p>

                {user.active && (
                <div className="inline-flex items-center gap-1.5 mt-3
                                px-3 py-1 bg-emerald-500/10 border
                                border-emerald-500/20 rounded-full">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                    Active Account
                    </span>
                </div>
                )}
            </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                        backgroundColor: color + '18',
                        border: `1px solid ${color}30`,
                    }}
                    >
                    <Icon size={15} style={{ color }} />
                    </div>
                    <span className="text-xs font-semibold text-[#8b8ba7]
                                    uppercase tracking-wider">
                    {label}
                    </span>
                </div>
                <p className="text-sm font-bold text-white pl-1">{value}</p>
                </div>
            ))}
            </div>

            {/* Danger zone */}
            <div className="glass rounded-2xl p-6 border border-red-500/10">
            <h3 className="text-sm font-bold text-white mb-1">Danger Zone</h3>
            <p className="text-xs text-[#8b8ba7] mb-4">
                Logging out will end your current session.
            </p>
            <Button
                variant="danger"
                loading={loggingOut}
                onClick={handleLogout}
            >
                <LogOut size={15} />
                {loggingOut ? 'Logging out...' : 'Logout'}
            </Button>
            </div>

        </div>
        </div>
    );
}