import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const user = await this.userService.findById(createServiceDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const category = await this.categoryService.findOne(
      createServiceDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const service = this.serviceRepository.create({
      title: createServiceDto.title,
      description: createServiceDto.description,
      location: {
        address: createServiceDto.location,
        city: '', // These would need to be added to the DTO
        country: '', // These would need to be added to the DTO
      },
      price: createServiceDto.price,
      isActive: createServiceDto.isActive,
      user,
      category,
    });

    return await this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['user', 'category'],
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id);
    if ('userId' in updateServiceDto) {
      const user = await this.userService.findById(
        updateServiceDto.userId as string,
      );
      if (!user) {
        throw new NotFoundException('User not found');
      }
      service.user = user;
    }

    if (updateServiceDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateServiceDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      service.category = category;
    }

    Object.assign(service, updateServiceDto);
    return await this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }

  async findByUserId(userId: string): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });
  }

  async findByCategoryId(categoryId: string): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { category: { id: categoryId } },
      relations: ['user'],
    });
  }
}
