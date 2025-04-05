import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import { User } from '../src/user/entities/user.entity';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'default_user',
  password: process.env.POSTGRES_PASSWORD || 'default_password',
  database: process.env.POSTGRES_DB || 'default_db',
  entities: [User],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  seeds: ['dist/db/seeds/*{.ts,.js}'],
  factories: ['dist/db/factories/*{.ts,.js}'],
  synchronize: true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  migrationsTableName: 'custom_migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
