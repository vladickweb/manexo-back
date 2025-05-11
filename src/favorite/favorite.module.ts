import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './entities/favorite.entity';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Service])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
