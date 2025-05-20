import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FilterServiceDto {
  @ApiProperty({
    description: 'IDs de las categorías',
    required: false,
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({
    description: 'Precio mínimo',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Precio máximo',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Estado activo del servicio',
    required: false,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Latitud del usuario',
    required: false,
    example: 37.62332465580069,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitud del usuario',
    required: false,
    example: -0.9851654443962178,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Radio de búsqueda en metros',
    required: false,
    example: 5000,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  radius?: number;
}
