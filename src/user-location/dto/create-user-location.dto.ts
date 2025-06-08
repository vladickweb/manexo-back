import { ApiProperty } from '@nestjs/swagger';

export class CreateUserLocationDto {
  @ApiProperty({ description: 'Latitud', example: 19.4326 })
  latitude: number;

  @ApiProperty({ description: 'Longitud', example: -99.1332 })
  longitude: number;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Avenida Reforma 123, Ciudad de México',
  })
  address: string;

  @ApiProperty({
    description: 'Nombre de la calle',
    example: 'Avenida Reforma',
  })
  streetName: string;

  @ApiProperty({ description: 'Número de la calle', example: '123' })
  streetNumber: string;

  @ApiProperty({ description: 'Ciudad', example: 'Ciudad de México' })
  city: string;

  @ApiProperty({ description: 'Provincia', example: 'CDMX' })
  province: string;

  @ApiProperty({ description: 'Código postal', example: '06500' })
  postalCode: string;

  @ApiProperty({ description: 'País', example: 'México' })
  country: string;

  @ApiProperty({ description: 'ID del usuario', example: 1 })
  userId: number;
}
