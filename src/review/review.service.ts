import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Service } from '../service/entities/service.entity';
import { User } from '../user/entities/user.entity';
import { Contract } from '../contract/entities/contract.entity';
import { ContractStatus } from '../contract/entities/contract.entity';
import { ServiceReviewStats } from './interfaces/service-review-stats.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    const service = await this.serviceRepository.findOne({
      where: { id: Number(createReviewDto.serviceId) },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    // Verificar que el usuario ha contratado y pagado el servicio
    const contract = await this.contractRepository.findOne({
      where: {
        service: { id: service.id },
        client: { id: user.id },
        status: ContractStatus.PAID,
      },
    });

    if (!contract) {
      throw new BadRequestException(
        'Debes haber contratado y pagado el servicio para poder dejarlo una review',
      );
    }

    // Verificar que no existe una review previa del mismo usuario para este servicio
    const existingReview = await this.reviewRepository.findOne({
      where: {
        service: { id: service.id },
        user: { id: user.id },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Ya has dejado una review para este servicio',
      );
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      service,
    });

    return await this.reviewRepository.save(review);
  }

  async findByServiceId(serviceId: string) {
    return await this.reviewRepository.find({
      where: { service: { id: Number(serviceId) } },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['service'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getServiceReviewStats(serviceId: string): Promise<ServiceReviewStats> {
    const reviews = await this.findByServiceId(serviceId);
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        user: {
          id: review.user.id,
          firstName: review.user.firstName,
          lastName: review.user.lastName,
        },
        createdAt: review.createdAt,
      })),
    };
  }
}
