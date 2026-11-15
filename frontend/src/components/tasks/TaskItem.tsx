
import type { Task, TaskStatus } from '../../types/task';

export const STATUS_META: Record<
    TaskStatus,
    { label: string; badge: string; accent: string }
> = {
    pending: {
        label: 'Pending',
        badge: 'bg-amber-50 text-amber-700 ring-amber-200',
        accent: 'border-l-amber-400',
    },
    in_progress: {
        label: 'In progress',
        badge: 'bg-blue-50 text-blue-700 ring-blue-200',
        accent: 'border-l-blue-500',
    },
    done: {
        label: 'Done',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        accent: 'border-l-emerald-500',
    },
};

interface TaskItemProps {
    task: Task;
    isUpdating: boolean;
    isDisabled: boolean;
    onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
}

function TaskItem({
                      task,
                      isUpdating,
                      isDisabled,
                      onStatusChange,
                  }: TaskItemProps) {
    const meta = STATUS_META[task.status];

    return (
        <article
            className={`rounded-2xl border-y border-r border-l-4 border-y-slate-200 border-r-slate-200 ${meta.accent} bg-white p-5 shadow-sm transition hover:shadow-md`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                        {task.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span>{task.assignee}</span>

                        <span
                            className="text-slate-300"
                            aria-hidden="true"
                        >
                            •
                        </span>

                        <span className="text-xs text-slate-400">
                            Created {formatDate(task.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="relative shrink-0 self-start sm:self-auto">
                    <label
                        htmlFor={`status-${task.id}`}
                        className="sr-only"
                    >
                        Change status for {task.title}
                    </label>

                    <select
                        id={`status-${task.id}`}
                        value={task.status}
                        onChange={(event) =>
                            onStatusChange(
                                task,
                                event.target.value as TaskStatus,
                            )
                        }
                        disabled={isDisabled}
                        className={`appearance-none rounded-full py-2 pl-3.5 pr-9 text-xs font-semibold ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${meta.badge}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                    </select>

                    {isUpdating ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeOpacity="0.25"
                                strokeWidth="3"
                            />
                            <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                        >
                            <path d="M6 8l4 4 4-4" />
                        </svg>
                    )}
                </div>
            </div>
        </article>
    );
}

export default TaskItem;
