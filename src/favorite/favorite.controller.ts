import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new favorite',
    description: "Adds a service to the user's favorites list",
  })
  @ApiBody({
    type: CreateFavoriteDto,
    description: 'Favorite creation data including service ID',
    examples: {
      example1: {
        summary: 'Add service to favorites',
        description: 'Add a cleaning service to user favorites',
        value: {
          serviceId: 1,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Favorite created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
          },
        },
        service: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'House Cleaning Service' },
            description: {
              type: 'string',
              example: 'Professional house cleaning',
            },
            price: { type: 'number', example: 150.0 },
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
  @ApiBadRequestResponse({
    description: 'Invalid input data or service already in favorites',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Service already in favorites' },
        error: { type: 'string', example: 'Bad Request' },
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
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Retrieves all favorites in the system (admin only)',
  })
  @ApiOkResponse({
    description: 'All favorites retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
            },
          },
          service: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'House Cleaning Service' },
              description: {
                type: 'string',
                example: 'Professional house cleaning',
              },
              price: { type: 'number', example: 150.0 },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Home Services' },
                },
              },
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
  findAll() {
    return this.favoriteService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get user favorites',
    description: 'Retrieves all favorites for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User favorites retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
          service: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              title: { type: 'string', example: 'House Cleaning Service' },
              description: {
                type: 'string',
                example: 'Professional house cleaning',
              },
              price: { type: 'number', example: 150.0 },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'https://example.com/image1.jpg',
                },
              },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 2 },
                  firstName: { type: 'string', example: 'Jane' },
                  lastName: { type: 'string', example: 'Smith' },
                  rating: { type: 'number', example: 4.8 },
                },
              },
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
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.favoriteService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get favorite by ID',
    description: 'Retrieves a specific favorite by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Favorite ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Favorite retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        createdAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-10T10:00:00Z' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
        service: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'House Cleaning Service' },
            description: {
              type: 'string',
              example: 'Professional house cleaning service',
            },
            price: { type: 'number', example: 150.0 },
            images: {
              type: 'array',
              items: {
                type: 'string',
                example: 'https://example.com/image1.jpg',
              },
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Home Services' },
              },
            },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 2 },
                firstName: { type: 'string', example: 'Jane' },
                lastName: { type: 'string', example: 'Smith' },
                rating: { type: 'number', example: 4.8 },
                location: {
                  type: 'object',
                  properties: {
                    city: { type: 'string', example: 'Madrid' },
                    country: { type: 'string', example: 'Spain' },
                  },
                },
              },
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
  @ApiNotFoundResponse({
    description: 'Favorite not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Favorite not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove favorite',
    description: "Removes a service from the user's favorites list",
  })
  @ApiParam({
    name: 'id',
    description: 'Favorite ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Favorite removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Favorite removed successfully' },
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
    description: 'Favorite not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Favorite not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.remove(id);
  }
}
