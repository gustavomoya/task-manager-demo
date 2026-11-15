import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Task, TaskStatus } from './entities/task.entity.js';

describe('TasksService', () => {
  let service: TasksService;

  const tasksRepositoryMock = {
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: tasksRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Implement tasks API',
        assignee: 'John',
      };

      const task: Task = {
        id: 1,
        title: createTaskDto.title,
        status: TaskStatus.PENDING,
        assignee: createTaskDto.assignee,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      tasksRepositoryMock.create.mockReturnValue(task);
      tasksRepositoryMock.save.mockResolvedValue(task);

      const result = await service.create(createTaskDto);

      expect(tasksRepositoryMock.create).toHaveBeenCalledWith(createTaskDto);
      expect(tasksRepositoryMock.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });
});
