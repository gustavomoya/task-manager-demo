
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
import TaskStats from '../components/tasks/TaskStats';
import TaskFilter, { type TaskFilterValue } from '../components/tasks/TaskFilter';

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof ApiError ? error.message : fallback;
}

function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<TaskFilterValue>('all');
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

    const filteredTasks = useMemo(
        () =>
            filter === 'all'
                ? tasks
                : tasks.filter((task) => task.status === filter),
        [tasks, filter],
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
                    ? {...item, status: nextStatus}
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
            // Roll back the change if the API request fails.
            setTasks((current) =>
                current.map((item) =>
                    item.id === task.id
                        ? {...item, status: task.status}
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

            <TaskStats counts={counts}/>

            <div className="mt-6">
                <TaskFilter
                    value={filter}
                    onChange={setFilter}
                />
            </div>

            <div className="mt-6 space-y-4">
                {success && (
                    <div
                        role="status"
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    >
                        {success}
                    </div>
                )}

                {!isLoading && error && (
                    <div
                        role="alert"
                        className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={handleRetry}
                            className="font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div
                        role="status"
                        className="space-y-3"
                        aria-label="Loading tasks"
                    >
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
                            />
                        ))}
                    </div>
                )}

                {!isLoading && !error && tasks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <h3 className="text-base font-semibold text-slate-900">
                            No tasks yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Get started by creating your first task.
                        </p>

                        <Link
                            to="/tasks/new"
                            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Create your first task
                        </Link>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    tasks.length > 0 &&
                    filteredTasks.length === 0 && (
                        <div
                            className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                            <h3 className="text-base font-semibold text-slate-900">
                                No tasks found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                There are no tasks with this status.
                            </p>
                        </div>
                    )}

                {!isLoading && !error && filteredTasks.length > 0 && (
                    <div className="space-y-3">
                        {filteredTasks.map((task) => (
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
