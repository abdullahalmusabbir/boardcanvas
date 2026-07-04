import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
    ghost: 'hover:bg-white/5 text-[#8b8ba7] hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    outline: 'border border-[#2a2a3a] hover:border-indigo-500/50 text-[#8b8ba7] hover:text-white',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
        className={`inline-flex items-center justify-center gap-2 rounded-xl
            font-medium transition-all duration-200 cursor-pointer select-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
        >
        {loading && (
            <span className="w-4 h-4 border-2 border-current border-t-transparent
                            rounded-full animate-spin" />
        )}
        {children}
        </button>
    );
    }