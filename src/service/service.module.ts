import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Subcategory } from '../category/entities/subcategory.entity';
import { Contract } from '../contract/entities/contract.entity';
import { Review } from '../review/entities/review.entity';
import { Booking } from '../booking/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      User,
      Category,
      Subcategory,
      Contract,
      Review,
      Booking,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
