import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'John',
    description: 'Nombre del usuario',
    required: false,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Apellido del usuario',
    required: false,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'https://example.com/picture.jpg',
    description: 'URL de la foto de perfil del usuario',
    required: false,
  })
  @IsString()
  @IsOptional()
  picture?: string;
}
