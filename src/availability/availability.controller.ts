import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Availability } from './entities/availability.entity';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { BatchAvailabilityDto } from './dto/batch-availability.dto';

@ApiTags('availabilities')
@ApiBearerAuth()
@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear una nueva disponibilidad' })
  @ApiResponse({
    status: 201,
    description: 'Disponibilidad creada exitosamente',
    type: Availability,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @Req() req: Request,
  ) {
    return this.availabilityService.create(
      createAvailabilityDto,
      req.user as User,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las disponibilidades del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de disponibilidades',
    type: [Availability],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Req() req: Request) {
    return this.availabilityService.findAll(req.user as User);
  }

  @Get('day/:dayOfWeek')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener disponibilidades por día de la semana' })
  @ApiResponse({
    status: 200,
    description: 'Lista de disponibilidades para el día especificado',
    type: [Availability],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByDayOfWeek(@Param('dayOfWeek') dayOfWeek: number, @Req() req: Request) {
    return this.availabilityService.findByDayOfWeek(
      dayOfWeek,
      req.user as User,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una disponibilidad por ID' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad encontrada',
    type: Availability,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Disponibilidad no encontrada' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.availabilityService.findOne(+id, req.user as User);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar una disponibilidad' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad actualizada',
    type: Availability,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Disponibilidad no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @Req() req: Request,
  ) {
    return this.availabilityService.update(
      +id,
      updateAvailabilityDto,
      req.user as User,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar una disponibilidad' })
  @ApiResponse({ status: 200, description: 'Disponibilidad eliminada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Disponibilidad no encontrada' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.availabilityService.remove(+id, req.user as User);
  }

  @Post('batch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar todas las disponibilidades en lote' })
  @ApiResponse({
    status: 201,
    description: 'Disponibilidades actualizadas exitosamente',
    type: [Availability],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  batchUpdate(
    @Body() batchAvailabilityDto: BatchAvailabilityDto,
    @Req() req: Request,
  ) {
    return this.availabilityService.batchUpdate(
      batchAvailabilityDto,
      req.user as User,
    );
  }
}
