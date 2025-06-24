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
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Availability } from './entities/availability.entity';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { BatchAvailabilityDto } from './dto/batch-availability.dto';

@ApiTags('Availabilities')
@ApiBearerAuth()
@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new availability',
    description: 'Creates a new availability slot for the authenticated user',
  })
  @ApiBody({
    type: CreateAvailabilityDto,
    description: 'Availability creation data',
  })
  @ApiCreatedResponse({
    description: 'Availability created successfully',
    type: Availability,
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
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dayOfWeek must be a number',
            'startTime must be a valid time',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get user availabilities',
    description: 'Retrieves all availability slots for the authenticated user',
  })
  @ApiOkResponse({
    description: 'List of user availabilities retrieved successfully',
    type: [Availability],
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
  findAll(@Req() req: Request) {
    return this.availabilityService.findAll(req.user as User);
  }

  @Get('day/:dayOfWeek')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get availabilities by day of week',
    description:
      'Retrieves availability slots for a specific day of the week (0=Sunday, 1=Monday, etc.)',
  })
  @ApiParam({
    name: 'dayOfWeek',
    description: 'Day of week (0-6, where 0 is Sunday)',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'List of availabilities for the specified day retrieved successfully',
    type: [Availability],
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
  @ApiBadRequestResponse({
    description: 'Invalid day of week',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Day of week must be between 0 and 6',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  findByDayOfWeek(@Param('dayOfWeek') dayOfWeek: number, @Req() req: Request) {
    return this.availabilityService.findByDayOfWeek(
      dayOfWeek,
      req.user as User,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get availability by ID',
    description: 'Retrieves a specific availability slot by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Availability ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Availability retrieved successfully',
    type: Availability,
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
    description: 'Availability not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Availability not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.availabilityService.findOne(+id, req.user as User);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update availability',
    description: 'Updates an existing availability slot',
  })
  @ApiParam({
    name: 'id',
    description: 'Availability ID',
    type: 'string',
    example: '1',
  })
  @ApiBody({
    type: UpdateAvailabilityDto,
    description: 'Availability update data',
  })
  @ApiOkResponse({
    description: 'Availability updated successfully',
    type: Availability,
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
    description: 'Availability not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Availability not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Delete availability',
    description: 'Permanently deletes an availability slot',
  })
  @ApiParam({
    name: 'id',
    description: 'Availability ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Availability deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Availability deleted successfully',
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
  @ApiNotFoundResponse({
    description: 'Availability not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Availability not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.availabilityService.remove(+id, req.user as User);
  }

  @Post('batch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Batch update availabilities',
    description: 'Updates multiple availability slots at once',
  })
  @ApiBody({
    type: BatchAvailabilityDto,
    description: 'Batch availability update data',
  })
  @ApiCreatedResponse({
    description: 'Availabilities updated successfully',
    type: [Availability],
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
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'availabilities must be an array',
            'Invalid availability data',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
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
