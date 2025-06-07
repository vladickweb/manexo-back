import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Service } from '../../service/entities/service.entity';

@Entity()
export class Review {
  @ApiProperty({
    description: 'ID único de la review',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Puntuación del servicio (1-5)',
    example: 5,
  })
  @Column()
  rating: number;

  @ApiProperty({
    description: 'Comentario de la review',
    example: 'Excelente servicio, muy profesional y puntual',
  })
  @Column('text')
  comment: string;

  @ApiProperty({
    description: 'Usuario que realiza la review',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ApiProperty({
    description: 'Servicio evaluado',
    type: () => Service,
  })
  @ManyToOne(() => Service, (service) => service.reviews, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @ApiProperty({
    description: 'Fecha de creación de la review',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la review',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
