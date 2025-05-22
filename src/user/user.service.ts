import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async updateLocation(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<User | null> {
    await this.userRepository.update(id, {
      location: updateLocationDto.location,
    });
    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateProfileImage(userId: number, file: any) {
    const user = await this.findById(userId.toString());

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si el usuario ya tiene una imagen, la eliminamos de Cloudinary
    if (user.profileImagePublicId) {
      await this.cloudinaryService.deleteImage(user.profileImagePublicId);
    }

    // Subimos la nueva imagen
    const result = await this.cloudinaryService.uploadImage(file);

    // Actualizamos el usuario con la nueva información de la imagen
    user.profileImageUrl = result['secure_url'];
    user.profileImagePublicId = result['public_id'];

    return this.userRepository.save(user);
  }

  async removeProfileImage(userId: number) {
    const user = await this.findById(userId.toString());

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.profileImagePublicId) {
      await this.cloudinaryService.deleteImage(user.profileImagePublicId);

      user.profileImageUrl = null;
      user.profileImagePublicId = null;

      return this.userRepository.save(user);
    }

    return user;
  }
}
