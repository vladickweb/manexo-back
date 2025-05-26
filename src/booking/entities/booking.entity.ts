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
import { Availability } from '../../availability/entities/availability.entity';
import { Service } from '../../service/entities/service.entity';
import { Contract } from '../../contract/entities/contract.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity()
export class Booking {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha de la reserva',
    example: '2024-03-23',
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:mm',
    example: '17:00',
  })
  @Column()
  startTime: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:mm',
    example: '19:00',
  })
  @Column()
  endTime: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Usuario que realiza la reserva',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.bookings)
  client: User;

  @ApiProperty({
    description: 'Usuario que proporciona el servicio',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.providedServices)
  provider: User;

  @ApiProperty({
    description: 'Disponibilidad asociada a la reserva',
    type: () => Availability,
  })
  @ManyToOne(() => Availability, (availability) => availability.bookings)
  availability: Availability;

  @ApiProperty({
    description: 'Servicio reservado',
    type: () => Service,
  })
  @ManyToOne(() => Service, (service) => service.bookings)
  service: Service;

  @ApiProperty({
    description: 'Contrato asociado a la reserva',
    type: () => Contract,
  })
  @ManyToOne(() => Contract, (contract) => contract.bookings)
  contract: Contract;

  @ApiProperty({
    description: 'Precio total de la reserva',
    example: 100.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({
    description: 'Notas adicionales de la reserva',
    example: 'Por favor, traer productos de limpieza',
    required: false,
  })
  @Column('text', { nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Fecha de creación de la reserva',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la reserva',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
