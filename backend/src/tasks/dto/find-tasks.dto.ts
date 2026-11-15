import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity.js';

export class FindTasksDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}