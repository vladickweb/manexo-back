import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: 19.4326,
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -99.1332,
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Avenida Reforma 123, Ciudad de México',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Nombre de la calle',
    example: 'Avenida Reforma',
  })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @ApiProperty({
    description: 'Número de la calle',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  streetNumber: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Ciudad de México',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Provincia/Estado',
    example: 'CDMX',
  })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({
    description: 'Código postal',
    example: '06500',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    description: 'País',
    example: 'México',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class UpdateLocationDto {
  @ApiProperty({
    description: 'Ubicación del usuario',
    type: LocationDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;
}
