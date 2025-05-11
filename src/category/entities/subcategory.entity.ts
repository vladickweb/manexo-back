import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Service } from '../../service/entities/service.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Subcategory {
  @ApiProperty({
    description: 'ID único de la subcategoría',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre de la subcategoría',
    example: 'Plancha',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Descripción de la subcategoría',
    example: 'Servicio de planchado a domicilio',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Icono de la subcategoría',
    example: 'ironing',
    required: false,
  })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({
    description: 'Fecha de creación de la subcategoría',
    example: '2024-03-20T12:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la subcategoría',
    example: '2024-03-20T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Service, (service) => service.subcategory)
  services: Service[];
}
