import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entities/service.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @ManyToOne(() => User, (user) => user.serviceChats)
  serviceProvider: User;

  @ManyToOne(() => Service, (service) => service.chats, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
