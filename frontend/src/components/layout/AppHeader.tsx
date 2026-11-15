import { NavLink } from 'react-router-dom';

function AppHeader() {
    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 ${
            isActive
                ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30 hover:bg-blue-400'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-blue-950">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
                <NavLink
                    to="/"
                    end
                    aria-label="Task Manager - Tasks"
                    className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950"
                >
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-400 via-blue-500 to-indigo-500 text-lg font-bold text-white shadow-md shadow-blue-500/40 ring-1 ring-inset ring-white/30 transition-transform duration-200 group-hover:scale-105">
                        <span
                            aria-hidden="true"
                            className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-white/30 blur-md"
                        />
                        <span className="relative">T</span>
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            Task Manager
                        </h1>
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-blue-200/70">
                            Team task management
                        </p>
                    </div>
                </NavLink>

                <nav
                    aria-label="Main navigation"
                    className="flex items-center gap-2"
                >
                    <NavLink to="/" end className={linkClasses}>
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <rect x="3" y="3" width="14" height="14" rx="2" />
                            <path d="M7 7h6M7 10h6M7 13h4" />
                        </svg>
                        Tasks
                    </NavLink>

                    <NavLink to="/tasks/new" className={linkClasses}>
                        <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M10 4v12M4 10h12" />
                        </svg>
                        Create Task
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default AppHeader;
