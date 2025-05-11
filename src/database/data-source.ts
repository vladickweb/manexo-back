import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';
import { Category } from '../category/entities/category.entity';
import { Subcategory } from '../category/entities/subcategory.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Review } from '../review/entities/review.entity';
import { Favorite } from '../favorite/entities/favorite.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Service, Category, Subcategory, Contract, Review, Favorite],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
