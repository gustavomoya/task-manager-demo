import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  /**
   * Find all tasks
   *
   * @param status optional filter parameter
   */
  async findAll(status?: TaskStatus): Promise<Task[]> {
    return this.tasksRepository.find({
      where: status ? { status } : {},
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Create a task
   *
   * @param createTaskDto the task data
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);

    return this.tasksRepository.save(task);
  }

  /**
   * Update the status of a task
   *
   * @param id     the task id
   * @param status the task status
   */
  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.status = status;

    return this.tasksRepository.save(task);
  }
}
