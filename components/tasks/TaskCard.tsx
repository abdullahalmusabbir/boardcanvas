'use client';

import { Task } from '@/types';
import Badge from '@/components/ui/Badge';
import { Calendar, GripVertical, Pencil, Trash2, Clock } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    isDragging?: boolean;
}

const priorityConfig = {
    low: { color: '#10b981', label: 'Low' },
    medium: { color: '#f59e0b', label: 'Medium' },
    high: { color: '#ef4444', label: 'High' },
    urgent: { color: '#ec4899', label: 'Urgent' },
};

export default function TaskCard({
    task, onEdit, onDelete, dragHandleProps, isDragging,
}: TaskCardProps) {
    const priority = priorityConfig[task.priority];

    return (
        <div
        className={`group glass rounded-xl p-4 border transition-all duration-200
            ${isDragging
            ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/20 rotate-1 scale-105'
            : 'border-[#2a2a3a] hover:border-[#3a3a4a] hover:-translate-y-0.5'
            }`}
        >
        {/* Top row: grip + priority + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
            {/* Drag handle */}
            <div
                {...dragHandleProps}
                className="text-[#3a3a5a] hover:text-[#8b8ba7] cursor-grab
                        active:cursor-grabbing transition-colors"
            >
                <GripVertical size={14} />
            </div>

            {/* Priority badge */}
            <Badge label={priority.label} color={priority.color} size="sm" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                            transition-opacity">
            <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-indigo-400
                        hover:bg-indigo-500/10 transition-all"
            >
                <Pencil size={13} />
            </button>
            <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-red-400
                        hover:bg-red-500/10 transition-all"
            >
                <Trash2 size={13} />
            </button>
            </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white leading-snug mb-2">
            {task.title}
        </h3>

        {/* Description */}
        {task.description && (
            <p className="text-xs text-[#8b8ba7] leading-relaxed mb-3 line-clamp-2">
            {task.description}
            </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map(tag => (
                <Badge key={tag.id} label={tag.name} color={tag.color} size="sm" />
            ))}
            </div>
        )}

        {/* Due date */}
        {task.due_date && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#8b8ba7]">
            <Clock size={10} className="text-indigo-400" />
            <span>Due {new Date(task.due_date + 'T00:00:00').toLocaleDateString(
                'en-US', { month: 'short', day: 'numeric' }
            )}</span>
            </div>
        )}
        </div>
    );
}