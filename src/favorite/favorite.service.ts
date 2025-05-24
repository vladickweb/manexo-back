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
      relations: ['user', 'service'],
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
    return this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'service', 'service.user', 'service.subcategory'],
    });
  }

  async remove(id: number) {
    const favorite = await this.findOne(id);
    return this.favoriteRepository.remove(favorite);
  }
}
