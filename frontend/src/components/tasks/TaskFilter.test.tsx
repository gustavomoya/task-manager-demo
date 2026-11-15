import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFilter from './TaskFilter';

describe('TaskFilter', () => {
    it('display all available filter options', () => {
        const onChange = vi.fn();

        render(
            <TaskFilter
                value="all"
                onChange={onChange}
            />,
        );

        const select = screen.getByRole('combobox', {
            name: 'Filter by status',
        });

        expect(select).toBeInTheDocument();

        expect(
            screen.getByRole('option', { name: 'All tasks' }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', { name: 'Pending' }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', { name: 'In progress' }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('option', { name: 'Done' }),
        ).toBeInTheDocument();
    });

    it('call onChange when selecting a different status', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <TaskFilter
                value="all"
                onChange={onChange}
            />,
        );

        const select = screen.getByRole('combobox', {
            name: 'Filter by status',
        });

        await user.selectOptions(select, 'pending');

        expect(onChange).toHaveBeenCalledWith('pending');
    });
});
