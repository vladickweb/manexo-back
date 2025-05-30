import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { UserLocation } from './entities/user-location.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocation)
    private readonly userLocationRepository: Repository<UserLocation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserLocationDto: CreateUserLocationDto,
  ): Promise<UserLocation> {
    const user = await this.userRepository.findOne({
      where: { id: createUserLocationDto.userId },
      relations: ['location'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.location)
      throw new BadRequestException('Usuario ya tiene una localización');

    const location = this.userLocationRepository.create({
      ...createUserLocationDto,
      user,
    });
    return this.userLocationRepository.save(location);
  }

  findAll(): Promise<UserLocation[]> {
    return this.userLocationRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<UserLocation> {
    const location = await this.userLocationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!location) throw new NotFoundException('Localización no encontrada');
    return location;
  }

  async update(
    id: number,
    updateUserLocationDto: UpdateUserLocationDto,
  ): Promise<UserLocation> {
    if (
      !updateUserLocationDto ||
      Object.keys(updateUserLocationDto).length === 0
    ) {
      throw new BadRequestException('No hay datos para actualizar');
    }
    const location = await this.userLocationRepository.findOne({
      where: { id },
    });
    if (!location) throw new NotFoundException('Localización no encontrada');
    Object.assign(location, updateUserLocationDto);
    return this.userLocationRepository.save(location);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userLocationRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Localización no encontrada');
  }
}
