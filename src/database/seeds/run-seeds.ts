import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedCategories } from './categories.seed';
import { seedUsers } from './users.seed';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

async function runSeeds() {
  try {
    await dataSource.initialize();

    await seedCategories(dataSource);
    await seedUsers(dataSource);

    await dataSource.destroy();
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }
}

runSeeds();
