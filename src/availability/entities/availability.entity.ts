import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity()
export class Availability {
  @ApiProperty({
    description: 'ID único de la disponibilidad',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Día de la semana (0-6, donde 0 es domingo)',
    example: 6,
  })
  @Column()
  dayOfWeek: number;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:mm',
    example: '09:00',
  })
  @Column()
  startTime: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:mm',
    example: '17:00',
  })
  @Column()
  endTime: string;

  @ApiProperty({
    description: 'Estado activo de la disponibilidad',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Usuario que ofrece el servicio',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.availabilities, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ApiProperty({
    description: 'Reservas asociadas a esta disponibilidad',
    type: () => [Booking],
  })
  @OneToMany(() => Booking, (booking) => booking.availability)
  bookings: Booking[];

  @ApiProperty({
    description: 'Fecha de creación de la disponibilidad',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la disponibilidad',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
