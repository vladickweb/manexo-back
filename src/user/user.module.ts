import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Service } from '../service/entities/service.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Review } from '../review/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Service, Contract, Review])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
