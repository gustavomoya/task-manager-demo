
interface TaskStatsProps {
    counts: {
        all: number;
        pending: number;
        in_progress: number;
        done: number;
    };
}

function TaskStats({ counts }: TaskStatsProps) {
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
    );
}

export default TaskStats;
