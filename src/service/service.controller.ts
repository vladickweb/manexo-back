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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Service } from './entities/service.entity';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { FilterServiceDto } from './dto/filter-service.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { ServiceAvailabilityResponse } from './interfaces/service-availability.interface';
import { GetAvailabilityQueryDto } from '@/service/dto/get-availability-query.dto';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiResponse({
    status: 201,
    description: 'Servicio creado exitosamente',
    type: Service,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  create(@Body() createServiceDto: CreateServiceDto, @Req() req: Request) {
    return this.serviceService.create(createServiceDto, req.user as User);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los servicios' })
  @ApiQuery({
    name: 'subcategoryIds',
    required: false,
    type: [Number],
    isArray: true,
    description: 'IDs de las subcategorías a filtrar',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'ID de la categoría a filtrar',
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({
    name: 'onlyActives',
    required: false,
    type: Boolean,
    description: 'Filtrar solo servicios activos (true) o todos (false)',
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    description: 'Latitud del usuario',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    description: 'Longitud del usuario',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Radio de búsqueda en metros',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios paginada',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Service' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  findAll(
    @Query() filters: FilterServiceDto,
    @Req() req: Request,
  ): Promise<PaginatedResponse<Service>> {
    const user = req.user as User | undefined;
    return this.serviceService.findAll(filters, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  @ApiResponse({
    status: 200,
    description: 'Servicio encontrado',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio actualizado',
    type: Service,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 404,
    description: 'Servicio o categoría no encontrada',
  })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar un servicio' })
  @ApiResponse({ status: 200, description: 'Servicio eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get('me/published')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener los servicios publicados por el usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios publicados por el usuario',
    type: [Service],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findMyPublishedServices(@Req() req: Request) {
    return this.serviceService.findMyPublishedServices(req.user as User);
  }

  @Get(':id/availability')
  @ApiOperation({
    summary: 'Obtener disponibilidad de un servicio para una fecha específica',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description:
      'Fecha de referencia para la semana en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ). La semana va de lunes a domingo',
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad del servicio',
    type: ServiceAvailabilityResponse,
  })
  @ApiResponse({ status: 400, description: 'Formato de fecha inválido' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getServiceAvailability(
    @Param('id') id: string,
    @Query() query: GetAvailabilityQueryDto,
  ): Promise<ServiceAvailabilityResponse> {
    const parsedDate = query.date ? new Date(query.date) : new Date();
    return this.serviceService.getServiceAvailability(id, parsedDate);
  }
}
