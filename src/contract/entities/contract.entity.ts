import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entities/service.entity';
import { Booking } from '../../booking/entities/booking.entity';

export enum ContractStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => User)
  provider: User;

  @ManyToOne(() => Service, (service) => service.contracts, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @OneToMany(() => Booking, (booking) => booking.contract)
  bookings: Booking[];

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  status: ContractStatus;

  @Column('text', { nullable: true })
  notes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  agreedPrice: number;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
