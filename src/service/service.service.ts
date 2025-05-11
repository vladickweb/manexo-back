import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Subcategory } from '../category/entities/subcategory.entity';
import { FilterServiceDto } from './dto/filter-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    user: User,
  ): Promise<Service> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: createServiceDto.categoryId },
    });

    if (!subcategory) {
      throw new NotFoundException(
        `Subcategoría con ID ${createServiceDto.categoryId} no encontrada`,
      );
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      user,
      subcategory,
    });

    return await this.serviceRepository.save(service);
  }

  async findAll(filters?: FilterServiceDto): Promise<Service[]> {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.user', 'user')
      .leftJoinAndSelect('service.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category');

    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('service.subcategoryId = :categoryId', {
          categoryId: filters.categoryId,
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

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'category', 'subcategory'],
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

    if (updateServiceDto.categoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: updateServiceDto.categoryId },
        relations: ['category'],
      });

      if (!subcategory) {
        throw new NotFoundException('Subcategoría no encontrada');
      }

      service.subcategory = subcategory;
      service.subcategory.category = subcategory.category;
    }

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
