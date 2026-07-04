'use client';

import { useDate } from '@/context/DateContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

function formatDisplay(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
}

function isToday(iso: string) {
    return iso === new Date().toISOString().split('T')[0];
}

function addDays(iso: string, n: number) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
}

export default function DateSelector() {
    const { selectedDate, setSelectedDate } = useDate();

    return (
        <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3
                        border border-[#2a2a3a]">
        {/* Prev day */}
        <button
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-white
                    hover:bg-white/5 transition-all"
        >
            <ChevronLeft size={16} />
        </button>

        {/* Date display + native picker */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar size={15} className="text-indigo-400 shrink-0" />
            <div className="relative min-w-0">
            <p className="text-sm font-semibold text-white truncate">
                {formatDisplay(selectedDate)}
            </p>
            {isToday(selectedDate) && (
                <span className="text-[10px] text-indigo-400 font-medium">
                Today
                </span>
            )}
            {/* hidden native date input for calendar picker */}
            <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                aria-label="Pick date"
            />
            </div>
        </div>

        {/* Today button */}
        {!isToday(selectedDate) && (
            <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold
                        text-indigo-400 bg-indigo-600/15 border border-indigo-500/30
                        hover:bg-indigo-600/25 transition-all whitespace-nowrap"
            >
            Today
            </button>
        )}

        {/* Next day */}
        <button
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-white
                    hover:bg-white/5 transition-all"
        >
            <ChevronRight size={16} />
        </button>
        </div>
    );
}