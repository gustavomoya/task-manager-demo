import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity.js";
import {Repository} from "typeorm";
import {CreateTaskDto} from "./dto/create-task.dto.js";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    /**
     * Create a task
     *
     * @param createTaskDto the task data
     */
    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.tasksRepository.create(createTaskDto);

        return this.tasksRepository.save(task);
    }
}
