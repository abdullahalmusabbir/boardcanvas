'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

/* ── Sortable wrapper for each card ── */
function SortableTaskCard({
    task, onEdit, onDelete,
}: {
    task: Task;
    onEdit: (t: Task) => void;
    onDelete: (id: number) => void;
}) {
    const {
        attributes, listeners, setNodeRef,
        transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
        <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            dragHandleProps={{ ...attributes, ...listeners }}
            isDragging={isDragging}
        />
        </div>
    );
}

/* ── Column config ── */
const columnConfig: Record<TaskStatus, {
    label: string; color: string; dot: string;
    }> = {
    todo: {
        label: 'To Do', color: '#6366f1', dot: 'bg-indigo-500',
    },
    in_progress: {
        label: 'In Progress', color: '#f59e0b', dot: 'bg-amber-500',
    },
    done: {
        label: 'Done', color: '#10b981', dot: 'bg-emerald-500',
    },
};

interface ColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onAddTask: (status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

export default function Column({
     status, tasks, onAddTask, onEdit, onDelete,
}: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const cfg = columnConfig[status];

    return (
        <div className="flex flex-col min-w-[300px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <h2 className="text-sm font-bold text-white">{cfg.label}</h2>
            <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                backgroundColor: cfg.color + '20',
                color: cfg.color,
                border: `1px solid ${cfg.color}30`,
                }}
            >
                {tasks.length}
            </span>
            </div>
            <button
            onClick={() => onAddTask(status)}
            className="p-1.5 rounded-lg text-[#8b8ba7] hover:text-white
                        hover:bg-white/5 transition-all"
            >
            <Plus size={16} />
            </button>
        </div>

        {/* Drop zone */}
        <div
            ref={setNodeRef}
            className={`flex-1 rounded-2xl p-3 min-h-[200px] space-y-3
            border-2 border-dashed transition-all duration-200
            ${isOver
                ? 'border-indigo-500/60 bg-indigo-500/5'
                : 'border-[#2a2a3a]/60 bg-[#111118]/40'
            }`}
        >
            <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
            >
            {tasks.map(task => (
                <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                />
            ))}
            </SortableContext>

            {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center
                            h-32 text-center">
                <p className="text-xs text-[#4a4a6a]">No tasks here</p>
                <button
                onClick={() => onAddTask(status)}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300
                            transition-colors"
                >
                + Add one
                </button>
            </div>
            )}
        </div>
        </div>
    );
}