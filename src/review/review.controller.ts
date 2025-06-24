import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
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
import { Review } from './entities/review.entity';
import { ServiceReviewStats } from './interfaces/service-review-stats.interface';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new review',
    description: 'Creates a new review for a service',
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Review creation data',
  })
  @ApiCreatedResponse({
    description: 'Review created successfully',
    type: Review,
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
    description: 'Invalid input data or user already reviewed this service',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'User already reviewed this service',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.create(createReviewDto, req.user);
  }

  @Get('service/:id')
  @ApiOperation({
    summary: 'Get reviews by service',
    description: 'Retrieves all reviews for a specific service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'List of reviews for the service retrieved successfully',
    type: [Review],
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
  findByServiceId(@Param('id') id: string) {
    return this.reviewService.findByServiceId(id);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Get reviews by user',
    description: 'Retrieves all reviews created by a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'List of reviews by the user retrieved successfully',
    type: [Review],
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
  findByUserId(@Param('id') id: string) {
    return this.reviewService.findByUserId(Number(id));
  }

  @Get('service/:id/stats')
  @ApiOperation({
    summary: 'Get service review statistics',
    description:
      'Retrieves review statistics and detailed reviews for a specific service',
  })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Service review statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalReviews: {
          type: 'number',
          description: 'Total number of reviews',
          example: 15,
        },
        averageRating: {
          type: 'number',
          description: 'Average rating (1-5)',
          example: 4.2,
        },
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '1' },
              rating: { type: 'number', example: 5 },
              comment: { type: 'string', example: 'Excellent service!' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                },
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z',
              },
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
  getServiceReviewStats(@Param('id') id: string): Promise<ServiceReviewStats> {
    return this.reviewService.getServiceReviewStats(id);
  }
}
