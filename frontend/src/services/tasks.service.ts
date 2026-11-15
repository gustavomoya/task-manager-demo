
import type {
    Task,
    TaskStatus,
    CreateTaskDto,
    UpdateTaskStatusDto,
} from '../types/task';

export interface ApiFieldError {
    field: string;
    messages: string[];
}

interface ApiErrorBody {
    message?: string | string[];
    errors?: ApiFieldError[];
}

export class ApiError extends Error {
    readonly status: number;
    readonly errors?: ApiFieldError[];

    constructor(status: number, message: string, errors?: ApiFieldError[]) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

const API_URL = (
    import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = (await response
            .json()
            .catch(() => null)) as ApiErrorBody | null;

        const message = Array.isArray(body?.message)
            ? body.message.join(', ')
            : body?.message ?? `Error ${response.status}`;

        throw new ApiError(
            response.status,
            message,
            body?.errors,
        );
    }

    return response.json() as Promise<T>;
}

/**
 * Get tasks
 *
 * @param status option filter parameter
 */
export async function getTasks(status?: TaskStatus): Promise<Task[]> {
    const params = new URLSearchParams();

    if (status) {
        params.append('status', status);
    }

    const query = params.toString();
    const url = `${API_URL}/tasks${query ? `?${query}` : ''}`;

    const response = await fetch(url);

    return handleResponse<Task[]>(response);
}

/**
 * Create a task
 *
 * @param data the data
 */
export async function createTask(data: CreateTaskDto): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return handleResponse<Task>(response);
}

/**
 * Update the status of a task
 *
 * @param id   the task id
 * @param data the new status
 */
export async function updateTaskStatus(
    id: number,
    data: UpdateTaskStatusDto,
): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return handleResponse<Task>(response);
}
