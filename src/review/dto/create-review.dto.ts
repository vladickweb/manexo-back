import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID del servicio a evaluar',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty({
    description: 'Puntuación del servicio (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comentario de la review',
    example: 'Excelente servicio, muy profesional y puntual',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
