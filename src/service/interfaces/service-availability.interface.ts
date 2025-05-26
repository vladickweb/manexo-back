import { ApiProperty } from '@nestjs/swagger';

export class AvailableSlot {
  @ApiProperty({ example: '09:00', description: 'Hora de inicio del slot' })
  start: string;

  @ApiProperty({ example: '10:00', description: 'Hora de fin del slot' })
  end: string;
}

export class DayAvailability {
  @ApiProperty({
    example: new Date('2024-05-23'),
    description: 'Fecha del día',
  })
  date: Date;

  @ApiProperty({
    example: 1,
    description: 'Día de la semana (0-6, donde 0 es domingo)',
  })
  dayOfWeek: number;

  @ApiProperty({
    example: '09:00',
    description: 'Hora de inicio de la disponibilidad',
  })
  startTime: string;

  @ApiProperty({
    example: '17:00',
    description: 'Hora de fin de la disponibilidad',
  })
  endTime: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la disponibilidad está activa',
  })
  isActive: boolean;

  @ApiProperty({ type: [AvailableSlot], description: 'Slots disponibles' })
  availableSlots: AvailableSlot[];
}

export class ServiceAvailabilityResponse {
  @ApiProperty({ example: 1, description: 'ID del servicio' })
  serviceId: number;

  @ApiProperty({
    example: 'Servicio de limpieza',
    description: 'Nombre del servicio',
  })
  serviceName: string;

  @ApiProperty({
    example: { id: 1, name: 'Juan Pérez' },
    description: 'Información del proveedor del servicio',
  })
  provider: {
    id: number;
    name: string;
  };

  @ApiProperty({
    example: new Date('2024-05-20'),
    description: 'Fecha de inicio de la semana',
  })
  weekStart: Date;

  @ApiProperty({
    example: new Date('2024-05-26'),
    description: 'Fecha de fin de la semana',
  })
  weekEnd: Date;

  @ApiProperty({
    type: [DayAvailability],
    description: 'Disponibilidades por día de la semana',
  })
  weekAvailability: DayAvailability[];
}
