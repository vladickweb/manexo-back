import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { User } from '../user/entities/user.entity';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    const user = await this.userRepository.findOne({
      where: { id: createFavoriteDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const service = await this.serviceRepository.findOne({
      where: { id: createFavoriteDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const favorite = this.favoriteRepository.create({
      user,
      service,
    });

    return this.favoriteRepository.save(favorite);
  }

  async findAll() {
    return this.favoriteRepository.find({
      relations: [
        'user',
        'service',
        'service.subcategory',
        'service.subcategory.category',
      ],
    });
  }

  async findOne(id: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: ['user', 'service'],
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    return favorite;
  }

  async findByUser(userId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: [
        'service',
        'service.user',
        'service.subcategory',
        'service.subcategory.category',
        'service.reviews',
        'service.user.location',
      ],
    });

    return favorites.map((favorite) => {
      const totalReviews = favorite.service.reviews.length;
      const averageRating =
        totalReviews > 0
          ? favorite.service.reviews.reduce(
              (acc, review) => acc + review.rating,
              0,
            ) / totalReviews
          : 0;

      return {
        ...favorite,
        service: {
          ...favorite.service,
          reviewStats: {
            totalReviews,
            averageRating: Number(averageRating.toFixed(1)),
          },
        },
      };
    });
  }

  async remove(id: number) {
    const favorite = await this.findOne(id);
    return this.favoriteRepository.remove(favorite);
  }
}
