import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserLocation {
  @ApiProperty({ description: 'ID único de la localización', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Latitud', example: 19.4326 })
  @Column('float')
  latitude: number;

  @ApiProperty({ description: 'Longitud', example: -99.1332 })
  @Column('float')
  longitude: number;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Avenida Reforma 123, Ciudad de México',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Nombre de la calle',
    example: 'Avenida Reforma',
  })
  @Column()
  streetName: string;

  @ApiProperty({ description: 'Número de la calle', example: '123' })
  @Column()
  streetNumber: string;

  @ApiProperty({ description: 'Ciudad', example: 'Ciudad de México' })
  @Column()
  city: string;

  @ApiProperty({ description: 'Provincia', example: 'CDMX' })
  @Column()
  province: string;

  @ApiProperty({ description: 'Código postal', example: '06500' })
  @Column()
  postalCode: string;

  @ApiProperty({ description: 'País', example: 'México' })
  @Column()
  country: string;

  @OneToOne(() => User, (user) => user.location, {
    onDelete: 'CASCADE',
    cascade: false,
  })
  @JoinColumn()
  user: User;
}
