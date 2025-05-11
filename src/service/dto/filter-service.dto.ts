import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class FilterServiceDto {
  @ApiProperty({
    description: 'ID de la categoría para filtrar',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'Precio máximo del servicio',
    example: 1000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    description: 'Precio mínimo del servicio',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'Filtrar solo servicios activos',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
