import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';
import { Review } from '../review/entities/review.entity';
import { StripeModule } from '../stripe/stripe.module';
import { Booking } from '../booking/entities/booking.entity';
import { Availability } from '../availability/entities/availability.entity';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      User,
      Service,
      Review,
      Booking,
      Availability,
    ]),
    StripeModule,
  ],
  controllers: [ContractController],
  providers: [ContractService, StripeService],
  exports: [ContractService],
})
export class ContractModule {}
