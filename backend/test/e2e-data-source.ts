import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '../.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_TEST_HOST ?? process.env.DB_HOST,
  port: Number(process.env.DB_TEST_PORT ?? process.env.DB_PORT),
  username: process.env.DB_TEST_USERNAME ?? process.env.DB_USERNAME,
  password: process.env.DB_TEST_PASSWORD ?? process.env.DB_PASSWORD,
  database: process.env.DB_TEST_DATABASE,
  entities: [resolve(process.cwd(), 'src/**/*.entity{.ts,.js}')],
  migrations: [resolve(process.cwd(), 'src/database/migrations/*{.ts,.js}')],
  synchronize: false,
});
