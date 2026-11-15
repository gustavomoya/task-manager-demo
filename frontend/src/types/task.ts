export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
    id: number;
    title: string;
    status: TaskStatus;
    assignee: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    assignee: string;
}

export interface UpdateTaskStatusDto {
    status: TaskStatus;
}
