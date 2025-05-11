import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entities/service.entity';
import { Contract } from '../../contract/entities/contract.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Service, (service) => service.reviews)
  service: Service;

  @OneToOne(() => Contract)
  @JoinColumn()
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;
}
