'use client';

import { useState, useCallback } from 'react';
import {
    DndContext, DragEndEvent, DragOverEvent,
    DragStartEvent, PointerSensor, useSensor,
    useSensors, closestCorners, DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { taskApi } from '@/lib/api';
import Column from './Column';
import TaskCard from './TaskCard';

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

interface BoardProps {
    tasks: Task[];
    onTasksChange: (tasks: Task[]) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onAddTask: (status: TaskStatus) => void;
}

export default function Board({
    tasks, onTasksChange, onEdit, onDelete, onAddTask,
}: BoardProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const tasksByStatus = useCallback(
        (status: TaskStatus) =>
        tasks
            .filter(t => t.status === status)
            .sort((a, b) => a.order - b.order),
        [tasks]
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveTask(tasks.find(t => t.id === active.id) || null);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;
        const activeId = active.id as number;
        const overId = over.id;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        /* over a column droppable */
        if (STATUSES.includes(overId as TaskStatus)) {
        const newStatus = overId as TaskStatus;
        if (activeTask.status !== newStatus) {
            onTasksChange(
            tasks.map(t =>
                t.id === activeId ? { ...t, status: newStatus } : t
            )
            );
        }
        return;
        }

        /* over another task */
        const overTask = tasks.find(t => t.id === overId);
        if (!overTask) return;

        if (activeTask.status !== overTask.status) {
        onTasksChange(
            tasks.map(t =>
            t.id === activeId ? { ...t, status: overTask.status } : t
            )
        );
        }
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        setActiveTask(null);
        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;
        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        let updatedTasks = [...tasks];

        /* dropped on column */
        if (STATUSES.includes(overId as TaskStatus)) {
        const newStatus = overId as TaskStatus;
        updatedTasks = updatedTasks.map(t =>
            t.id === activeId ? { ...t, status: newStatus } : t
        );
        } else {
        /* dropped on task — reorder */
        const overTask = tasks.find(t => t.id === overId);
        if (!overTask) return;

        const sameCols = updatedTasks
            .filter(t => t.status === overTask.status)
            .sort((a, b) => a.order - b.order);

        const oldIdx = sameCols.findIndex(t => t.id === activeId);
        const newIdx = sameCols.findIndex(t => t.id === overId);

        if (oldIdx !== -1 && newIdx !== -1) {
            const reordered = arrayMove(sameCols, oldIdx, newIdx).map(
            (t, i) => ({ ...t, order: i })
            );
            updatedTasks = updatedTasks.map(t => {
            const r = reordered.find(r => r.id === t.id);
            return r || t;
            });
        }

        if (activeTask.status !== overTask.status) {
            updatedTasks = updatedTasks.map(t =>
            t.id === activeId ? { ...t, status: overTask.status } : t
            );
        }
        }

        onTasksChange(updatedTasks);

        /* persist to backend */
        try {
        await taskApi.reorder(
            updatedTasks.map(t => ({
            id: t.id, order: t.order, status: t.status,
            }))
        );
        } catch (err) {
        console.error('Reorder failed', err);
        }
    };

    return (
        <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <div className="flex gap-5 overflow-x-auto pb-6 min-h-[500px]">
            {STATUSES.map(status => (
            <Column
                key={status}
                status={status}
                tasks={tasksByStatus(status)}
                onAddTask={onAddTask}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
            {activeTask && (
            <div className="rotate-2 opacity-90">
                <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging
                />
            </div>
            )}
        </DragOverlay>
        </DndContext>
    );
}