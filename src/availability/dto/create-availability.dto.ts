import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsBoolean,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'Día de la semana (0-6, donde 0 es domingo)',
    example: 6,
    minimum: 0,
    maximum: 6,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:mm',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:mm',
    example: '17:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Estado activo de la disponibilidad',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
