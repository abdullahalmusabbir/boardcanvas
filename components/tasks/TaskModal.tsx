'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Task, Tag, Priority, TaskStatus } from '@/types';
import { tagApi } from '@/lib/api';
import { Plus, X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TaskFormData) => Promise<void>;
    task?: Task | null;
    defaultDate: string;
    defaultStatus?: TaskStatus;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    task_date: string;
    due_date: string;
    tag_ids: number[];
}

const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
const statuses: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

const priorityColors = {
    low: '#10b981', medium: '#f59e0b',
    high: '#ef4444', urgent: '#ec4899',
};

export default function TaskModal({
    isOpen, onClose, onSave, task, defaultDate, defaultStatus = 'todo',
}: TaskModalProps) {
    const [form, setForm] = useState<TaskFormData>({
        title: '', description: '', priority: 'medium',
        status: defaultStatus, task_date: defaultDate,
        due_date: '', tag_ids: [],
    });
    const [tags, setTags] = useState<Tag[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#6366f1');
    const [showTagCreate, setShowTagCreate] = useState(false);

    /* load tags */
    useEffect(() => {
        if (!isOpen) return;
        tagApi.list().then(setTags).catch(console.error);
    }, [isOpen]);

    /* populate form when editing */
    useEffect(() => {
        if (task) {
        setForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            task_date: task.task_date,
            due_date: task.due_date || '',
            tag_ids: task.tags.map(t => t.id),
        });
        } else {
        setForm({
            title: '', description: '', priority: 'medium',
            status: defaultStatus, task_date: defaultDate,
            due_date: '', tag_ids: [],
        });
        }
        setError('');
    }, [task, isOpen, defaultDate, defaultStatus]);

    const set = <K extends keyof TaskFormData>(k: K, v: TaskFormData[K]) =>
        setForm(f => ({ ...f, [k]: v }));

    const toggleTag = (id: number) =>
        set('tag_ids', form.tag_ids.includes(id)
        ? form.tag_ids.filter(t => t !== id)
        : [...form.tag_ids, id]
        );

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        try {
        const tag = await tagApi.create({ name: newTagName.trim(), color: newTagColor });
        setTags(prev => [...prev, tag]);
        set('tag_ids', [...form.tag_ids, tag.id]);
        setNewTagName('');
        setShowTagCreate(false);
        } catch {
        /* ignore */
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError('Title is required'); return; }
        setSaving(true);
        setError('');
        try {
        await onSave(form);
        onClose();
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save task');
        } finally {
        setSaving(false);
        }
    };

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={task ? 'Edit Task' : 'New Task'}
        size="lg"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
            <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Title *
            </label>
            <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a]
                        rounded-xl text-white text-sm placeholder-[#3a3a5a]
                        focus:outline-none focus:border-indigo-500/60
                        focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            </div>

            {/* Description */}
            <div>
            <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Description
            </label>
            <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Add details..."
                rows={3}
                className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#2a2a3a]
                        rounded-xl text-white text-sm placeholder-[#3a3a5a]
                        focus:outline-none focus:border-indigo-500/60
                        focus:ring-2 focus:ring-indigo-500/20 transition-all
                        resize-none"
            />
            </div>

            {/* Priority + Status row */}
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Priority
                </label>
                <div className="flex gap-1.5 flex-wrap">
                {priorities.map(p => (
                    <button
                    key={p}
                    type="button"
                    onClick={() => set('priority', p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold
                        capitalize transition-all duration-200 border`}
                    style={form.priority === p ? {
                        backgroundColor: priorityColors[p] + '25',
                        borderColor: priorityColors[p] + '60',
                        color: priorityColors[p],
                    } : {
                        backgroundColor: 'transparent',
                        borderColor: '#2a2a3a',
                        color: '#8b8ba7',
                    }}
                    >
                    {p}
                    </button>
                ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Status
                </label>
                <select
                value={form.status}
                onChange={e => set('status', e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a]
                            rounded-xl text-white text-sm
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
                </select>
            </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Task Date *
                </label>
                <input
                type="date"
                value={form.task_date}
                onChange={e => set('task_date', e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a]
                            rounded-xl text-white text-sm
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider mb-1.5">
                Due Date
                </label>
                <input
                type="date"
                value={form.due_date}
                onChange={e => set('due_date', e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#2a2a3a]
                            rounded-xl text-white text-sm
                            focus:outline-none focus:border-indigo-500/60
                            focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>
            </div>

            {/* Tags */}
            <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#8b8ba7]
                                uppercase tracking-wider">
                Tags
                </label>
                <button
                type="button"
                onClick={() => setShowTagCreate(!showTagCreate)}
                className="flex items-center gap-1 text-xs text-indigo-400
                            hover:text-indigo-300 transition-colors"
                >
                <Plus size={12} />
                New tag
                </button>
            </div>

            {/* Create tag inline */}
            {showTagCreate && (
                <div className="flex gap-2 mb-2 p-3 bg-[#0a0a0f] rounded-xl
                                border border-[#2a2a3a]">
                <input
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    placeholder="Tag name"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateTag())}
                    className="flex-1 px-3 py-1.5 bg-[#111118] border border-[#2a2a3a]
                            rounded-lg text-white text-xs placeholder-[#3a3a5a]
                            focus:outline-none focus:border-indigo-500/60 transition-all"
                />
                <input
                    type="color"
                    value={newTagColor}
                    onChange={e => setNewTagColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border
                            border-[#2a2a3a] p-0.5"
                />
                <Button size="sm" onClick={handleCreateTag} type="button">
                    Add
                </Button>
                </div>
            )}

            {/* Tag list */}
            <div className="flex flex-wrap gap-1.5">
                {tags.length === 0 && (
                <p className="text-xs text-[#4a4a6a]">No tags yet. Create one above.</p>
                )}
                {tags.map(tag => {
                const selected = form.tag_ids.includes(tag.id);
                return (
                    <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        text-xs font-semibold transition-all duration-200 border`}
                    style={selected ? {
                        backgroundColor: tag.color + '25',
                        borderColor: tag.color + '60',
                        color: tag.color,
                    } : {
                        backgroundColor: 'transparent',
                        borderColor: '#2a2a3a',
                        color: '#8b8ba7',
                    }}
                    >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: selected ? tag.color : '#8b8ba7' }}
                    />
                    {tag.name}
                    {selected && <X size={10} />}
                    </button>
                );
                })}
            </div>
            </div>

            {/* Error */}
            {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20
                            rounded-xl px-4 py-3">
                {error}
            </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
            <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                loading={saving}
                className="flex-1"
            >
                {task ? 'Save Changes' : 'Create Task'}
            </Button>
            </div>
        </form>
        </Modal>
    );
}