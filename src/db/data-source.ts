import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';
import { Category } from '../category/entities/category.entity';
import { Subcategory } from '../category/entities/subcategory.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Review } from '../review/entities/review.entity';
import { Favorite } from '../favorite/entities/favorite.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Service, Category, Subcategory, Contract, Review, Favorite],
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: true,
  dropSchema: false,
  logging: true,
  extra: {
    ssl: false,
    application_name: 'manexo-back',
    statement_timeout: 60000,
    query_timeout: 60000,
    pool: {
      max: 10,
      min: 2,
      idleTimeoutMillis: 30000,
    },
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
