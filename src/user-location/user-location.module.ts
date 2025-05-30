import { Module } from '@nestjs/common';
import { UserLocationService } from './user-location.service';
import { UserLocationController } from './user-location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocation } from './entities/user-location.entity';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [UserLocationController],
  providers: [UserLocationService],
  imports: [TypeOrmModule.forFeature([UserLocation, User])],
})
export class UserLocationModule {}
