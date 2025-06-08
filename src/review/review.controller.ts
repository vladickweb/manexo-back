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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Review } from './entities/review.entity';
import { ServiceReviewStats } from './interfaces/service-review-stats.interface';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear una nueva review' })
  @ApiResponse({
    status: 201,
    description: 'La review ha sido creada exitosamente',
    type: Review,
  })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.create(createReviewDto, req.user);
  }

  @Get('service/:id')
  @ApiOperation({ summary: 'Obtener todas las reviews de un servicio' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reviews del servicio',
    type: [Review],
  })
  findByServiceId(@Param('id') id: string) {
    return this.reviewService.findByServiceId(id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Obtener todas las reviews de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reviews del usuario',
    type: [Review],
  })
  findByUserId(@Param('id') id: string) {
    return this.reviewService.findByUserId(Number(id));
  }

  @Get('service/:id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de reviews de un servicio' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de reviews del servicio',
    schema: {
      type: 'object',
      properties: {
        totalReviews: {
          type: 'number',
          description: 'Número total de reviews',
        },
        averageRating: {
          type: 'number',
          description: 'Promedio de puntuaciones (1-5)',
        },
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  getServiceReviewStats(@Param('id') id: string): Promise<ServiceReviewStats> {
    return this.reviewService.getServiceReviewStats(id);
  }
}
