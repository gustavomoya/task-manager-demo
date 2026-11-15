import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { Task } from '../src/tasks/entities/task.entity.js';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let tasksRepository: Repository<Task>;

  beforeAll(async () => {
    // use testing db
    process.env.DB_DATABASE = process.env.DB_TEST_DATABASE;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    tasksRepository = app.get<Repository<Task>>(getRepositoryToken(Task));
  });

  beforeEach(async () => {
    // clear table
    await tasksRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a task successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Implement tasks API',
          assignee: 'John',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: 'Implement tasks API',
        assignee: 'John',
        status: 'pending',
      });
    });

    it('should reject an empty title', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: '',
          assignee: 'John',
        })
        .expect(400);
    });

    it('should reject a title shorter than 3 characters', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'AB',
          assignee: 'John',
        })
        .expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Implement tasks API',
          assignee: 'John',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Implement tasks API',
        assignee: 'John',
        status: 'pending',
      });
    });

    it('should return an empty array when there are no tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
