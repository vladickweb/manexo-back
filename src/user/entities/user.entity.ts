import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Service } from '../../service/entities/service.entity';
import { Contract } from '../../contract/entities/contract.entity';
import { Review } from '../../review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Availability } from '../../availability/entities/availability.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Chat } from '../../chats/entities/chat.entity';
import { Message } from '../../messages/entities/message.entity';
import { UserLocation } from '../../user-location/entities/user-location.entity';

@Entity()
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    required: false,
  })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Perez',
    required: false,
  })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (encriptada)',
    example: '********',
  })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Lista de servicios asociados al usuario',
    type: [Service],
    required: false,
  })
  @OneToMany(() => Service, (service) => service.user, { cascade: true })
  services: Service[];

  @OneToMany(() => Contract, (contract) => contract.client)
  contracts: Contract[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  profileImagePublicId: string;

  @ApiProperty({
    description: 'Lista de disponibilidades del usuario',
    type: [Availability],
    required: false,
  })
  @OneToMany(() => Availability, (availability) => availability.user, {
    cascade: true,
  })
  availabilities: Availability[];

  @ApiProperty({
    description: 'Lista de reservas realizadas por el usuario',
    type: [Booking],
    required: false,
  })
  @OneToMany(() => Booking, (booking) => booking.client, { cascade: true })
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.provider)
  providedServices: Booking[];

  @OneToMany(() => Chat, (chat) => chat.user, { cascade: true })
  chats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.serviceProvider)
  serviceChats: Chat[];

  @OneToMany(() => Message, (message) => message.sender, { cascade: true })
  messages: Message[];

  @OneToOne(() => UserLocation, (location) => location.user, {
    cascade: true,
  })
  location: UserLocation;
}
