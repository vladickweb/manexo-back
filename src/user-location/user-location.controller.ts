import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserLocationService } from './user-location.service';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLocation } from './entities/user-location.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('UserLocation')
@ApiBearerAuth()
@Controller('user-location')
export class UserLocationController {
  constructor(private readonly userLocationService: UserLocationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create user location',
    description: 'Creates a new location record for a user',
  })
  @ApiBody({
    type: CreateUserLocationDto,
    description: 'User location creation data',
  })
  @ApiCreatedResponse({
    description: 'User location created successfully',
    type: UserLocation,
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
          example: ['latitude must be a number', 'longitude must be a number'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  create(
    @Body() createUserLocationDto: CreateUserLocationDto,
  ): Promise<UserLocation> {
    return this.userLocationService.create(createUserLocationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all user locations',
    description: 'Retrieves a list of all user location records',
  })
  @ApiOkResponse({
    description: 'List of all user locations retrieved successfully',
    type: [UserLocation],
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
  findAll(): Promise<UserLocation[]> {
    return this.userLocationService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user location by ID',
    description: 'Retrieves a specific user location by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User location ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'User location retrieved successfully',
    type: UserLocation,
  })
  @ApiNotFoundResponse({
    description: 'User location not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User location not found' },
        error: { type: 'string', example: 'Not Found' },
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
  findOne(@Param('id') id: string): Promise<UserLocation> {
    return this.userLocationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user location',
    description: 'Updates an existing user location with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'User location ID',
    type: 'string',
    example: '1',
  })
  @ApiBody({
    type: UpdateUserLocationDto,
    description: 'User location update data',
  })
  @ApiOkResponse({
    description: 'User location updated successfully',
    type: UserLocation,
  })
  @ApiNotFoundResponse({
    description: 'User location not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User location not found' },
        error: { type: 'string', example: 'Not Found' },
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
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['latitude must be a number', 'longitude must be a number'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
  ): Promise<UserLocation> {
    return this.userLocationService.update(+id, updateUserLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete user location',
    description: 'Permanently deletes a user location record',
  })
  @ApiParam({
    name: 'id',
    description: 'User location ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'User location deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User location deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User location not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User location not found' },
        error: { type: 'string', example: 'Not Found' },
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
  remove(@Param('id') id: string): Promise<void> {
    return this.userLocationService.remove(+id);
  }
}
