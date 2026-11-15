import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Task } from './entities/task.entity.js';
import {FindTasksDto} from "./dto/find-tasks.dto.js";
import {UpdateTaskStatusDto} from "./dto/update-task-status.dto.js";

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() query: FindTasksDto): Promise<Task[]> {
    return this.tasksService.findAll(query.status);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id/status')
  updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, updateTaskStatusDto.status,);
  }
}
