import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Service {
  @ApiProperty({
    description: 'ID único del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Título del servicio',
    example: 'Servicio de plomería',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Servicio profesional de plomería a domicilio',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Ubicación del servicio',
    example: {
      address: 'Calle Principal 123',
      city: 'Ciudad',
      country: 'País',
    },
  })
  @Column('jsonb')
  location: {
    address: string;
    city: string;
    country: string;
  };

  @ApiProperty({
    description: 'Precio del servicio',
    example: 50.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Estado del servicio (activo/inactivo)',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del servicio',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del servicio',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Usuario que ofrece el servicio',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'Categoría del servicio',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
