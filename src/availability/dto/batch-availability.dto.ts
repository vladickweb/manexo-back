import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAvailabilityDto } from './create-availability.dto';

export class BatchAvailabilityDto {
  @ApiProperty({
    description: 'Array de disponibilidades a actualizar',
    type: [CreateAvailabilityDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvailabilityDto)
  availabilities: CreateAvailabilityDto[];
}
