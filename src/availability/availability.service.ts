import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { User } from '../user/entities/user.entity';
import { BatchAvailabilityDto } from './dto/batch-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  async create(
    createAvailabilityDto: CreateAvailabilityDto,
    user: User,
  ): Promise<Availability> {
    const availability = this.availabilityRepository.create({
      ...createAvailabilityDto,
      user,
    });
    return this.availabilityRepository.save(availability);
  }

  async findAll(user: User): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { user: { id: user.id } },
      relations: ['bookings'],
    });
  }

  async findOne(id: number, user: User): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['bookings'],
    });

    if (!availability) {
      throw new NotFoundException(`Disponibilidad con ID ${id} no encontrada`);
    }

    return availability;
  }

  async update(
    id: number,
    updateAvailabilityDto: UpdateAvailabilityDto,
    user: User,
  ): Promise<Availability> {
    const availability = await this.findOne(id, user);

    Object.assign(availability, updateAvailabilityDto);
    return this.availabilityRepository.save(availability);
  }

  async remove(id: number, user: User): Promise<void> {
    const availability = await this.findOne(id, user);
    await this.availabilityRepository.remove(availability);
  }

  async findByDayOfWeek(
    dayOfWeek: number,
    user: User,
  ): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { dayOfWeek, user: { id: user.id } },
      relations: ['bookings'],
    });
  }

  async batchUpdate(
    batchAvailabilityDto: BatchAvailabilityDto,
    user: User,
  ): Promise<Availability[]> {
    // Primero eliminamos todas las disponibilidades existentes del usuario
    await this.availabilityRepository.delete({ user: { id: user.id } });

    // Creamos las nuevas disponibilidades
    const availabilities = batchAvailabilityDto.availabilities.map(
      (availabilityDto) =>
        this.availabilityRepository.create({
          ...availabilityDto,
          user,
        }),
    );

    // Guardamos todas las nuevas disponibilidades
    return this.availabilityRepository.save(availabilities);
  }
}
