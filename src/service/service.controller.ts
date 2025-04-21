import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Service } from './entities/service.entity';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 201,
    description: 'The service has been successfully created.',
    type: Service,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({
    status: 200,
    description: 'Return all services.',
    type: [Service],
  })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the service.',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully updated.',
    type: Service,
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get services by user id' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the user.',
    type: [Service],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByUserId(@Param('userId') userId: string) {
    return this.serviceService.findByUserId(userId);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get services by category id' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the category.',
    type: [Service],
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.serviceService.findByCategoryId(categoryId);
  }
}
