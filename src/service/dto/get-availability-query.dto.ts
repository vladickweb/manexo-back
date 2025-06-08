import { IsOptional, IsISO8601 } from 'class-validator';

export class GetAvailabilityQueryDto {
  @IsOptional()
  @IsISO8601(
    {},
    {
      message:
        'La fecha debe ser ISO 8601, por ejemplo 2025-05-19T00:00:00Z o 2025-05-19T00:00:00+02:00',
    },
  )
  date?: string;
}
