import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de refresco JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Información del usuario',
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  })
  user: any;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
