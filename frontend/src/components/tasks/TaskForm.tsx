import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../schemas/task.schema';
import { createTask, ApiError } from '../../services/tasks.service';
import type { Task } from '../../types/task';

interface TaskFormProps {
    onTaskCreated: (task: Task) => void;
}

function TaskForm({ onTaskCreated }: TaskFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            assignee: '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        clearErrors();

        try {
            const task = await createTask(data);

            reset();
            onTaskCreated(task);
        } catch (error) {
            if (error instanceof ApiError) {
                let hasFieldError = false;

                for (const fieldError of error.errors ?? []) {
                    if (
                        fieldError.field === 'title' ||
                        fieldError.field === 'assignee'
                    ) {
                        hasFieldError = true;

                        setError(fieldError.field, {
                            type: 'server',
                            message: fieldError.messages.join(', '),
                        });
                    }
                }

                if (!hasFieldError) {
                    setError('root.serverError', {
                        type: 'server',
                        message: error.message,
                    });
                }
            } else {
                setError('root.serverError', {
                    type: 'server',
                    message:
                        'Unable to connect to the server. Please try again.',
                });
            }
        }
    };

    const inputClasses = (hasError: boolean) =>
        `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
        }`;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-busy={isSubmitting}
                className="space-y-5 p-6"
            >
                <div>
                    <div className="mb-1.5 flex items-center justify-between gap-4">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-slate-700"
                        >
                            Task title{' '}
                            <span className="text-red-500" aria-hidden="true">
                                *
                            </span>
                        </label>
                    </div>

                    <input
                        id="title"
                        type="text"
                        placeholder="Create a task for demo"
                        autoComplete="off"
                        maxLength={150}
                        disabled={isSubmitting}
                        {...register('title')}
                        className={inputClasses(!!errors.title)}
                        aria-required="true"
                        aria-invalid={!!errors.title}
                        aria-describedby={
                            errors.title ? 'title-error' : undefined
                        }
                    />

                    {errors.title && (
                        <p
                            id="title-error"
                            className="mt-1.5 text-xs font-medium text-red-600"
                        >
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="mb-1.5 flex items-center justify-between gap-4">
                        <label
                            htmlFor="assignee"
                            className="text-sm font-medium text-slate-700"
                        >
                            Assignee{' '}
                            <span className="text-red-500" aria-hidden="true">
                                *
                            </span>
                        </label>
                    </div>

                    <input
                        id="assignee"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="off"
                        maxLength={100}
                        disabled={isSubmitting}
                        {...register('assignee')}
                        className={inputClasses(!!errors.assignee)}
                        aria-required="true"
                        aria-invalid={!!errors.assignee}
                        aria-describedby={
                            errors.assignee ? 'assignee-error' : undefined
                        }
                    />

                    {errors.assignee && (
                        <p
                            id="assignee-error"
                            className="mt-1.5 text-xs font-medium text-red-600"
                        >
                            {errors.assignee.message}
                        </p>
                    )}
                </div>

                {errors.root?.serverError && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {errors.root.serverError.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 animate-spin"
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
                    )}

                    {isSubmitting ? 'Creating...' : 'Create task'}
                </button>
            </form>
        </section>
    );
}

export default TaskForm;
