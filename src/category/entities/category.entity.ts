import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Plomería',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Servicios de plomería y fontanería',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Icono de la categoría',
    example: 'faucet',
    required: false,
  })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({
    description: 'Fecha de creación de la categoría',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la categoría',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Lista de servicios asociados a la categoría',
    type: [Service],
    required: false,
  })
  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
