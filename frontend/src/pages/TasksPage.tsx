
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import TaskItem, {
    STATUS_META,
} from '../components/tasks/TaskItem';
import {
    ApiError,
    getTasks,
    updateTaskStatus,
} from '../services/tasks.service';
import type { Task, TaskStatus } from '../types/task';

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof ApiError ? error.message : fallback;
}

function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    'Unable to connect to the server.',
                ),
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchTasks();
    }, [fetchTasks]);

    const handleRetry = () => {
        void fetchTasks();
    };

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => setSuccess(null), 4000);

        return () => clearTimeout(timer);
    }, [success]);

    const counts = useMemo(
        () => ({
            all: tasks.length,
            pending: tasks.filter(
                (task) => task.status === 'pending',
            ).length,
            in_progress: tasks.filter(
                (task) => task.status === 'in_progress',
            ).length,
            done: tasks.filter(
                (task) => task.status === 'done',
            ).length,
        }),
        [tasks],
    );

    const handleStatusChange = async (
        task: Task,
        nextStatus: TaskStatus,
    ) => {
        if (nextStatus === task.status || updatingId !== null) {
            return;
        }

        setUpdatingId(task.id);
        setError(null);
        setSuccess(null);

        // Optimistic update: update the UI before the API responds.
        setTasks((current) =>
            current.map((item) =>
                item.id === task.id
                    ? { ...item, status: nextStatus }
                    : item,
            ),
        );

        try {
            const updated = await updateTaskStatus(task.id, {
                status: nextStatus,
            });

            setTasks((current) =>
                current.map((item) =>
                    item.id === updated.id ? updated : item,
                ),
            );

            setSuccess(
                `"${updated.title}" is now ${
                    STATUS_META[updated.status].label.toLowerCase()
                }.`,
            );
        } catch (err) {
            // Roll back the optimistic update if the API request fails.
            setTasks((current) =>
                current.map((item) =>
                    item.id === task.id
                        ? { ...item, status: task.status }
                        : item,
                ),
            );

            setError(
                getErrorMessage(
                    err,
                    'Unable to update the task. Please try again.',
                ),
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const statCards = [
        { label: 'Total', value: counts.all, dot: 'bg-slate-400' },
        { label: 'Pending', value: counts.pending, dot: 'bg-amber-500' },
        {
            label: 'In progress',
            value: counts.in_progress,
            dot: 'bg-blue-500',
        },
        { label: 'Done', value: counts.done, dot: 'bg-emerald-500' },
    ];

    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    My Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Manage and track your team's tasks.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className={`h-2 w-2 rounded-full ${stat.dot}`}
                                aria-hidden="true"
                            />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                {stat.label}
                            </p>
                        </div>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                {success && (
                    <div
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
                    >
                        {success}
                    </div>
                )}

                {!isLoading && error && (
                    <div
                        role="alert"
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div
                        className="space-y-3"
                        role="status"
                        aria-label="Loading tasks"
                    >
                        <span className="sr-only">Loading tasks</span>

                        {[0, 1, 2].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                                <div className="mt-3 h-3 w-1/4 animate-pulse rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && tasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <path d="M9 4h6a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                                <path d="M9 9h6M9 13h6M9 17h3" />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                            No tasks yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first task to get started.
                        </p>

                        <Link
                            to="/tasks/new"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            Create task
                        </Link>
                    </div>
                )}

                {!isLoading && tasks.length > 0 && (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                isUpdating={updatingId === task.id}
                                isDisabled={updatingId !== null}
                                onStatusChange={(selectedTask, nextStatus) =>
                                    void handleStatusChange(
                                        selectedTask,
                                        nextStatus,
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default TasksPage;
