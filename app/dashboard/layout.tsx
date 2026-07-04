'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
        router.replace('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500
                            border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8b8ba7] text-sm">Loading workspace...</p>
            </div>
        </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
        <Sidebar />
        <main className="flex-1 min-w-0 ml-16 lg:ml-64 transition-all duration-300">
            {children}
        </main>
        </div>
    );
}