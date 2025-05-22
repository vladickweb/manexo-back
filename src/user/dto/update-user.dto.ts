import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({
    description: 'Latitud de la ubicación',
    example: 19.4326,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitud de la ubicación',
    example: -99.1332,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Avenida Reforma 123, Ciudad de México',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Nombre de la calle',
    example: 'Avenida Reforma',
  })
  @IsString()
  @IsOptional()
  streetName?: string;

  @ApiProperty({
    description: 'Número de la calle',
    example: '123',
  })
  @IsString()
  @IsOptional()
  streetNumber?: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Ciudad de México',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Provincia/Estado',
    example: 'CDMX',
  })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({
    description: 'Código postal',
    example: '06500',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'País',
    example: 'México',
  })
  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'newpassword123',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Imagen de perfil del usuario',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({
    description: 'ID de la imagen de perfil del usuario',
    example: '1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  profileImagePublicId?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Ubicación del usuario',
    type: LocationDto,
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}
