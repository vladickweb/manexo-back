import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { Subcategory } from './subcategory.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Hogar',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Servicios de hogar',
    required: false,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Icono de la categoría',
    example: 'home',
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
  @ApiProperty({
    description: 'Lista de subcategorías asociadas a la categoría',
    type: [Subcategory],
    required: false,
  })
  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
