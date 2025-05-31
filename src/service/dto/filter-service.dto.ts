import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@/service/dto/pagination.dto';

export class FilterServiceDto extends PaginationDto {
  @ApiProperty({
    description: 'IDs de las subcategorías',
    required: false,
    type: [Number],
    isArray: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  subcategoryIds?: number[];

  @ApiProperty({
    description: 'ID de la categoría',
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'Precio mínimo',
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Precio máximo',
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Latitud del usuario',
    required: false,
    example: 37.62332465580069,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitud del usuario',
    required: false,
    example: -0.9851654443962178,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Número de página',
    required: false,
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;
}
