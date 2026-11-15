
import type { TaskStatus } from '../../types/task';

export type TaskFilterValue = 'all' | TaskStatus;

interface TaskFilterProps {
    value: TaskFilterValue;
    onChange: (value: TaskFilterValue) => void;
}

function TaskFilter({ value, onChange }: TaskFilterProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label
                htmlFor="task-filter"
                className="text-sm font-medium text-slate-700"
            >
                Filter by status
            </label>

            <select
                id="task-filter"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value as TaskFilterValue)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:w-52"
            >
                <option value="all">All tasks</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
            </select>
        </div>
    );
}

export default TaskFilter;
