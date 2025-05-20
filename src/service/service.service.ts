import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { PaginationDto } from './dto/pagination.dto';
import { User } from '../user/entities/user.entity';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    user: User,
  ): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      user,
    });

    return await this.serviceRepository.save(service);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  async findAll(
    filters?: FilterServiceDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResponse<Service>> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.user', 'user')
      .leftJoinAndSelect('service.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category');

    if (filters) {
      if (filters.categoryIds?.length > 0) {
        queryBuilder.andWhere('subcategory.categoryId IN (:...categoryIds)', {
          categoryIds: filters.categoryIds,
        });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('service.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('service.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('service.isActive = :isActive', {
          isActive: filters.isActive,
        });
      }
    }

    // Obtener el total de registros
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    queryBuilder.skip(skip).take(limit);

    const services = await queryBuilder.getMany();

    // Si se proporcionan coordenadas y radio, filtrar por distancia
    let filteredServices = services;
    if (filters?.latitude && filters?.longitude && filters?.radius) {
      filteredServices = services
        .filter((service) => {
          if (!service.user?.location) return false;

          const distance = this.calculateDistance(
            filters.latitude,
            filters.longitude,
            service.user.location.latitude,
            service.user.location.longitude,
          );

          service['distance'] = Math.round(distance);

          return distance <= filters.radius;
        })
        .sort((a, b) => a['distance'] - b['distance']);
    }

    return {
      data: filteredServices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id);

    Object.assign(service, updateServiceDto);
    return await this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async findMyPublishedServices(user: User): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'subcategory', 'subcategory.category'],
    });
  }
}
