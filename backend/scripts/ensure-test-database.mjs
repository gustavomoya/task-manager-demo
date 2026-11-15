import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const databaseName = process.env.DB_TEST_DATABASE ?? 'task_manager_test';

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'postgres',
});

async function ensureTestDatabase() {
  try {
    await client.connect();

    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Database "${databaseName}" created successfully.`);
    } else {
      console.log(`Database "${databaseName}" already exists.`);
    }
  } catch (error) {
    console.error('Error creating test database:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

await ensureTestDatabase();
