'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDate } from '@/context/DateContext';
import { taskApi } from '@/lib/api';
import { Task, TaskStatus } from '@/types';
import DateSelector from '@/components/tasks/DateSelector';
import Board from '@/components/tasks/Board';
import TaskModal, { TaskFormData } from '@/components/tasks/TaskModal';
import Button from '@/components/ui/Button';
import {
    Plus, RefreshCw, LayoutDashboard,
    AlertCircle,
} from 'lucide-react';

export default function TasksPage() {
    const { selectedDate } = useDate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

    /* ── fetch tasks for selected date ── */
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
        const data = await taskApi.list({ date: selectedDate });
        setTasks(data);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
        } finally {
        setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    /* ── open modal for new task ── */
    const handleAddTask = (status: TaskStatus) => {
        setEditingTask(null);
        setDefaultStatus(status);
        setModalOpen(true);
    };

    /* ── open modal for editing ── */
    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    /* ── delete task ── */
    const handleDelete = async (id: number) => {
        if (!confirm('Delete this task?')) return;
        try {
        await taskApi.delete(id);
        setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
        alert(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    /* ── save (create or update) ── */
    const handleSave = async (data: TaskFormData) => {
        if (editingTask) {
        const updated = await taskApi.update(editingTask.id, data);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        } else {
        const created = await taskApi.create(data);
        /* only add to board if task_date matches selected date */
        if (created.task_date === selectedDate) {
            setTasks(prev => [...prev, created]);
        }
        }
    };

    /* ── stats ── */
    const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
    };

    return (
        <div className="min-h-screen flex flex-col">
        {/* ── Page header ── */}
        <div className="border-b border-[#2a2a3a] bg-[#0d0d14]/80
                        backdrop-blur-sm sticky top-0 z-30">
            <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center
                            justify-between gap-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600/20 border border-indigo-500/30
                                rounded-xl flex items-center justify-center">
                    <LayoutDashboard size={18} className="text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Task Board</h1>
                    <p className="text-xs text-[#8b8ba7]">
                    {stats.total} tasks · {stats.done} done
                    </p>
                </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                <DateSelector />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchTasks}
                    disabled={loading}
                >
                    <RefreshCw
                    size={14}
                    className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </Button>
                <Button
                    size="sm"
                    onClick={() => handleAddTask('todo')}
                >
                    <Plus size={14} />
                    New Task
                </Button>
                </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-4">
                {[
                { label: 'Total', value: stats.total, color: '#8b8ba7' },
                { label: 'To Do', value: stats.todo, color: '#6366f1' },
                { label: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
                { label: 'Done', value: stats.done, color: '#10b981' },
                ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                    <span
                    className="text-sm font-bold"
                    style={{ color }}
                    >
                    {value}
                    </span>
                    <span className="text-xs text-[#4a4a6a]">{label}</span>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* ── Board area ── */}
        <div className="flex-1 p-6">
            {/* Error */}
            {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10
                            border border-red-500/20 rounded-2xl text-red-400">
                <AlertCircle size={18} className="shrink-0" />
                <div>
                <p className="font-semibold text-sm">Failed to load tasks</p>
                <p className="text-xs mt-0.5 opacity-80">{error}</p>
                </div>
                <Button
                variant="danger"
                size="sm"
                className="ml-auto"
                onClick={fetchTasks}
                >
                Retry
                </Button>
            </div>
            )}

            {/* Loading skeleton */}
            {loading && (
            <div className="flex gap-5">
                {[1, 2, 3].map(i => (
                <div
                    key={i}
                    className="flex-1 min-w-[300px] h-64 bg-[#111118]
                            rounded-2xl border border-[#2a2a3a] animate-pulse"
                />
                ))}
            </div>
            )}

            {/* Board */}
            {!loading && !error && (
            <Board
                tasks={tasks}
                onTasksChange={setTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddTask={handleAddTask}
            />
            )}
        </div>

        {/* ── Task Modal ── */}
        <TaskModal
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditingTask(null); }}
            onSave={handleSave}
            task={editingTask}
            defaultDate={selectedDate}
            defaultStatus={defaultStatus}
        />
        </div>
    );
}