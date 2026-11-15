import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { createTask } from '../../services/tasks.service';
import type { Task } from '../../types/task';

vi.mock('../../services/tasks.service', () => ({
    createTask: vi.fn(),
    ApiError: class ApiError extends Error {},
}));

describe('TaskForm', () => {
    const mockOnTaskCreated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('display validation errors when submitting an empty form', async () => {
        const user = userEvent.setup();

        render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

        await user.click(
            screen.getByRole('button', { name: 'Create task' }),
        );

        expect(
            await screen.findByText(
                'Title must contain at least 3 characters',
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByText('Assignee is required'),
        ).toBeInTheDocument();

        expect(createTask).not.toHaveBeenCalled();
    });

    it('create a task when the form data is valid', async () => {
        const user = userEvent.setup();

        const mockTask: Task = {
            id: 1,
            title: 'Create demo project',
            status: 'pending',
            assignee: 'John Doe',
            createdAt: '2026-11-15T10:00:00.000Z',
            updatedAt: '2026-11-15T10:00:00.000Z',
        };

        vi.mocked(createTask).mockResolvedValue(mockTask);

        render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

        await user.type(
            screen.getByLabelText(/Task title/i),
            'Create demo project',
        );

        await user.type(
            screen.getByLabelText(/Assignee/i),
            'John Doe',
        );

        await user.click(
            screen.getByRole('button', { name: 'Create task' }),
        );

        expect(createTask).toHaveBeenCalledWith({
            title: 'Create demo project',
            assignee: 'John Doe',
        });

        expect(
            await screen.findByRole('button', { name: 'Create task' }),
        ).toBeEnabled();

        expect(mockOnTaskCreated).toHaveBeenCalledWith(mockTask);
    });
});
