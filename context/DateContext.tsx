'use client';

import React, { createContext, useContext, useState } from 'react';

interface DateContextType {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}

const DateContext = createContext<DateContextType | null>(null);

export function DateProvider({ children }: { children: React.ReactNode }) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
        {children}
        </DateContext.Provider>
    );
}

export function useDate() {
    const ctx = useContext(DateContext);
    if (!ctx) throw new Error('useDate must be used within DateProvider');
    return ctx;
}