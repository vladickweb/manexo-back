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
  @ApiOperation({ summary: 'Obtener todos los servicios' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios',
    type: [Service],
  })
  findAll(@Query() filters?: FilterServiceDto) {
    return this.serviceService.findAll(filters);
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
}
