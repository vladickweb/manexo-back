import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
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

export class CreateServiceDto {
  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Ofrezco servicios de plomería residencial y comercial',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Radio de cobertura del servicio',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  radius: number;

  @ApiProperty({
    description: 'Ubicación del servicio',
    type: LocationDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({
    description: 'Precio del servicio',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'ID de la subcategoría a la que pertenece el servicio',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  subcategory: number;

  @ApiProperty({
    description: 'Indica si el servicio requiere aceptación manual',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresAcceptance?: boolean;

  @ApiProperty({
    description: 'Lista de URLs de imágenes del servicio',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
