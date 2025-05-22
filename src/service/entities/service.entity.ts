import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Subcategory } from '../../category/entities/subcategory.entity';
import { Contract } from '../../contract/entities/contract.entity';
import { Review } from '../../review/entities/review.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column('int')
  radius: number;

  @Column('json')
  location: {
    latitude: number;
    longitude: number;
    address: string;
    streetName: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  requiresAcceptance: boolean;

  @ManyToOne(() => User, (user) => user.services)
  user: User;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.services)
  subcategory: Subcategory;

  @OneToMany(() => Contract, (contract) => contract.service)
  contracts: Contract[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];

  @ApiProperty({
    description: 'Lista de reservas asociadas al servicio',
    type: [Booking],
    required: false,
  })
  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
