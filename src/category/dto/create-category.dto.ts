import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Plomería', description: 'Nombre de la categoría' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Servicios de plomería y fontanería',
    description: 'Descripción de la categoría',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'faucet',
    description: 'Icono de la categoría',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;
}
