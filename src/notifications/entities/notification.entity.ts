import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  CHAT_REQUEST = 'chat_request',
  BOOKING_REQUEST = 'booking_request',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_RECEIVED = 'review_received',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column('text')
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  data: string; // JSON string con datos adicionales (chatId, bookingId, etc)

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
