import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { Contract } from '../../contract/entities/contract.entity';
import { Review } from '../../review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Favorite } from '../../favorite/entities/favorite.entity';

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
  @OneToMany(() => Service, (service) => service.user)
  services: Service[];

  @OneToMany(() => Contract, (contract) => contract.requester)
  contracts: Contract[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];
}
