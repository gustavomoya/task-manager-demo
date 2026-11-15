import {Body, Controller, Post} from '@nestjs/common';
import {TasksService} from "./tasks.service.js";
import {CreateTaskDto} from "./dto/create-task.dto.js";
import {Task} from "./entities/task.entity.js";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }
}
