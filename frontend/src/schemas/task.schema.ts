import { z } from 'zod';

export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, 'Title must contain at least 3 characters')
        .max(150, 'Title cannot exceed 150 characters'),

    assignee: z
        .string()
        .trim()
        .min(1, 'Assignee is required')
        .max(100, 'Assignee cannot exceed 100 characters'),
});

export type TaskFormData = z.infer<typeof taskSchema>;
