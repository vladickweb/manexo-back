import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Título del servicio',
    example: 'Servicio de plomería',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Servicio profesional de plomería a domicilio',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Ubicación del servicio',
    example:
      '{"address": "Calle Principal 123", "city": "Ciudad", "country": "País"}',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Precio del servicio',
    example: 50.0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Si el servicio está activo',
    example: true,
    default: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'ID del usuario que ofrece el servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID de la categoría del servicio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  categoryId: string;
}
