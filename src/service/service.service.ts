import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { PaginationDto } from './dto/pagination.dto';
import { User } from '../user/entities/user.entity';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Booking } from '../booking/entities/booking.entity';
import { Availability } from '../availability/entities/availability.entity';
import {
  ServiceAvailabilityResponse,
  DayAvailability,
  AvailableSlot,
} from './interfaces/service-availability.interface';
import { BookingStatus } from '../booking/entities/booking.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
    user: User,
  ): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      user: { id: user.id },
      subcategory: { id: createServiceDto.subcategory },
    });

    return await this.serviceRepository.save(service);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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
      .leftJoinAndSelect('subcategory.category', 'category')
      .leftJoinAndSelect('service.reviews', 'reviews')
      .leftJoinAndSelect('reviews.user', 'reviewUser');

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

    const total = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(limit);

    const services = await queryBuilder.getMany();

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

    const servicesWithStats = filteredServices.map((service) => {
      const totalReviews = service.reviews.length;
      const averageRating =
        totalReviews > 0
          ? service.reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
          : 0;

      return {
        ...service,
        reviewStats: {
          totalReviews,
          averageRating: Number(averageRating.toFixed(1)),
        },
      };
    });

    return {
      data: servicesWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private getWeekDates(date: Date): { start: Date; end: Date } {
    const localDate = new Date(date);

    const isoDay = localDate.getDay() === 0 ? 7 : localDate.getDay();
    const start = new Date(localDate);
    start.setDate(localDate.getDate() - (isoDay - 1));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private async getAvailableSlots(
    availabilities: Availability[],
    bookings: Booking[],
    date: Date,
  ): Promise<AvailableSlot[]> {
    const dayOfWeek = date.getDay();
    const availability = availabilities.find(
      (avail) => avail.dayOfWeek === dayOfWeek && avail.isActive,
    );

    if (!availability) {
      return [];
    }

    const dayBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const targetDate = new Date(date);

      const isSameDay =
        bookingDate.getFullYear() === targetDate.getFullYear() &&
        bookingDate.getMonth() === targetDate.getMonth() &&
        bookingDate.getDate() === targetDate.getDate() &&
        booking.status === BookingStatus.CONFIRMED;

      return isSameDay;
    });

    return this.calculateAvailableSlots(availability, dayBookings);
  }

  private calculateAvailableSlots(
    availability: Availability,
    bookings: Booking[],
  ): AvailableSlot[] {
    const slots: AvailableSlot[] = [];
    let currentTime = new Date(`2000-01-01T${availability.startTime}`);
    const endTime = new Date(`2000-01-01T${availability.endTime}`);

    const sortedBookings = bookings.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`2000-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });

    const splitIntoHourlySlots = (start: Date, end: Date) => {
      const hourlySlots: AvailableSlot[] = [];
      let slotStart = new Date(start);

      while (slotStart < end) {
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + 1);

        if (slotEnd > end) {
          slotEnd.setTime(end.getTime());
        }

        hourlySlots.push({
          start: slotStart.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5),
        });

        slotStart = new Date(slotEnd);
      }

      return hourlySlots;
    };

    for (const booking of sortedBookings) {
      const bookingStart = new Date(`2000-01-01T${booking.startTime}`);
      const bookingEnd = new Date(`2000-01-01T${booking.endTime}`);

      if (currentTime < bookingStart) {
        const newSlots = splitIntoHourlySlots(currentTime, bookingStart);
        slots.push(...newSlots);
      }

      currentTime = bookingEnd;
    }

    if (currentTime < endTime) {
      const remainingSlots = splitIntoHourlySlots(currentTime, endTime);
      slots.push(...remainingSlots);
    }

    return slots;
  }

  async findOne(id: string, date?: Date): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: Number(id) },
      relations: [
        'user',
        'subcategory',
        'subcategory.category',
        'reviews',
        'user.availabilities',
      ],
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await this.bookingRepository.find({
        where: {
          service: { id: service.id },
          startTime: Between(startOfDay.toISOString(), endOfDay.toISOString()),
        },
      });

      const availableSlots = await this.getAvailableSlots(
        service.user.availabilities,
        bookings,
        date,
      );

      service.user.availabilities = service.user.availabilities.map(
        (avail) => ({
          ...avail,
          availableSlots: availableSlots.filter(
            (slot) => slot.start === avail.startTime,
          ),
        }),
      );
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
    const services = await this.serviceRepository.find({
      where: { user: { id: user.id } },
      relations: [
        'user',
        'subcategory',
        'subcategory.category',
        'reviews',
        'reviews.user',
      ],
    });

    return services.map((service) => {
      const totalReviews = service.reviews.length;
      const averageRating =
        totalReviews > 0
          ? service.reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
          : 0;

      return {
        ...service,
        reviewStats: {
          totalReviews,
          averageRating: Number(averageRating.toFixed(1)),
        },
      };
    });
  }

  async getServiceAvailability(
    id: string,
    date: Date,
  ): Promise<ServiceAvailabilityResponse> {
    const service = await this.serviceRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'user.availabilities'],
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const { start: weekStart, end: weekEnd } = this.getWeekDates(date);

    const bookings = await this.bookingRepository.find({
      where: {
        service: { id: service.id },
        date: Between(weekStart, weekEnd),
      },
    });

    const weekAvailability: DayAvailability[] = [];
    const currentDate = new Date(weekStart);

    while (currentDate <= weekEnd) {
      const dayAvailability = service.user.availabilities.find(
        (avail) => avail.dayOfWeek === currentDate.getDay(),
      );

      if (dayAvailability && dayAvailability.isActive) {
        const availableSlots = await this.getAvailableSlots(
          service.user.availabilities,
          bookings,
          currentDate,
        );

        weekAvailability.push({
          date: new Date(currentDate),
          dayOfWeek: currentDate.getDay(),
          startTime: dayAvailability.startTime,
          endTime: dayAvailability.endTime,
          isActive: dayAvailability.isActive,
          availableSlots,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      serviceId: service.id,
      serviceName: service.description,
      provider: {
        id: service.user.id,
        name: `${service.user.firstName} ${service.user.lastName}`,
      },
      weekStart: new Date(weekStart),
      weekEnd: new Date(weekEnd),
      weekAvailability,
    };
  }
}
