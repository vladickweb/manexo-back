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
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Service } from './entities/service.entity';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { FilterServiceDto } from './dto/filter-service.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { ServiceAvailabilityResponse } from './interfaces/service-availability.interface';
import { GetAvailabilityQueryDto } from '@/service/dto/get-availability-query.dto';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new service',
    description: 'Creates a new service with the provided information',
  })
  @ApiBody({
    type: CreateServiceDto,
    description: 'Service creation data',
  })
  @ApiCreatedResponse({
    description: 'Service created successfully',
    type: Service,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  create(@Body() createServiceDto: CreateServiceDto, @Req() req: Request) {
    return this.serviceService.create(createServiceDto, req.user as User);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all services',
    description:
      'Retrieves a paginated list of services with optional filtering options',
  })
  @ApiQuery({
    name: 'subcategoryIds',
    required: false,
    type: [Number],
    isArray: true,
    description: 'Filter by subcategory IDs',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'onlyActives',
    required: false,
    type: Boolean,
    description: 'Filter only active services (true) or all services (false)',
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    description: 'User latitude for location-based filtering',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    description: 'User longitude for location-based filtering',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Search radius in meters for location-based filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOkResponse({
    description: 'Paginated list of services retrieved successfully',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Service' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Total number of services' },
            page: { type: 'number', description: 'Current page number' },
            limit: { type: 'number', description: 'Items per page' },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
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
  @ApiOperation({
    summary: 'Get a service by ID',
    description: 'Retrieves a specific service by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Service retrieved successfully',
    type: Service,
  })
  @ApiNotFoundResponse({
    description: 'Service not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a service',
    description: 'Updates an existing service with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiBody({
    type: UpdateServiceDto,
    description: 'Service update data',
  })
  @ApiOkResponse({
    description: 'Service updated successfully',
    type: Service,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service or category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a service',
    description: 'Permanently deletes a service from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Service deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Service deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get('me/published')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get user's published services",
    description: 'Retrieves all services published by the authenticated user',
  })
  @ApiOkResponse({
    description: "User's published services retrieved successfully",
    type: [Service],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  findMyPublishedServices(@Req() req: Request) {
    return this.serviceService.findMyPublishedServices(req.user as User);
  }

  @Get(':id/availability')
  @ApiOperation({
    summary: 'Get service availability',
    description: 'Retrieves the availability of a service for a specific date',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: 'string',
    description: 'Date to check availability (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @ApiOkResponse({
    description: 'Service availability retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        serviceId: { type: 'string' },
        date: { type: 'string' },
        availableSlots: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              startTime: { type: 'string', example: '09:00' },
              endTime: { type: 'string', example: '10:00' },
              isAvailable: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Service not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getServiceAvailability(
    @Param('id') id: string,
    @Query() query: GetAvailabilityQueryDto,
  ): Promise<ServiceAvailabilityResponse> {
    const parsedDate = query.date ? new Date(query.date) : new Date();
    return this.serviceService.getServiceAvailability(id, parsedDate);
  }
}
