interface BadgeProps {
    label: string;
    color?: string;
    size?: 'sm' | 'md';
}

export default function Badge({
    label, color = '#6366f1', size = 'sm',
}: BadgeProps) {
    return (
        <span
        className={`inline-flex items-center rounded-full font-medium
            ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
        style={{
            backgroundColor: `${color}20`,
            color,
            border: `1px solid ${color}40`,
        }}
        >
        {label}
        </span>
    );
}