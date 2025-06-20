import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
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
import { UserLocation } from '../user-location/entities/user-location.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(UserLocation)
    private userLocationRepository: Repository<UserLocation>,
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

    if (createServiceDto.location) {
      let userLocation = await this.userLocationRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (userLocation) {
        Object.assign(userLocation, createServiceDto.location);
        await this.userLocationRepository.save(userLocation);
      } else {
        userLocation = this.userLocationRepository.create({
          ...createServiceDto.location,
          user,
        });
        await this.userLocationRepository.save(userLocation);
      }
    }

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
    filters: FilterServiceDto,
    user?: User,
  ): Promise<PaginatedResponse<Service>> {
    const { page, limit } = filters;
    const skip = (page - 1) * limit;

    const idQuery = this.serviceRepository
      .createQueryBuilder('service')
      .select('service.id', 'id')
      .distinct(true)
      .leftJoin('service.subcategory', 'subcategory')
      .leftJoin('subcategory.category', 'category')
      .leftJoin('service.reviews', 'reviews')
      .leftJoin('reviews.user', 'reviewUser')
      .leftJoin('service.user', 'user')
      .leftJoin('user.location', 'userLocation');

    if (user) {
      idQuery.andWhere('user.id != :userId', { userId: user.id });
    }

    if (filters) {
      if (filters.subcategoryIds?.length > 0) {
        idQuery.andWhere('service.subcategoryId IN (:...subcategoryIds)', {
          subcategoryIds: filters.subcategoryIds,
        });
      }

      if (filters.categoryId !== undefined) {
        idQuery.andWhere('subcategory.categoryId = :categoryId', {
          categoryId: filters.categoryId,
        });
      }

      if (filters.minPrice !== undefined) {
        idQuery.andWhere('service.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      }

      if (filters.maxPrice !== undefined) {
        idQuery.andWhere('service.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.latitude && filters.longitude) {
        idQuery.addSelect(
          `
        (
          6371 * acos(
            cos(radians(:userLat)) *
            cos(radians(userLocation.latitude)) *
            cos(radians(userLocation.longitude) - radians(:userLon)) +
            sin(radians(:userLat)) *
            sin(radians(userLocation.latitude))
          )
        )
      `,
          'distance',
        );

        idQuery.andWhere(
          `
        (
          6371 * acos(
            cos(radians(:userLat)) *
            cos(radians(userLocation.latitude)) *
            cos(radians(userLocation.longitude) - radians(:userLon)) +
            sin(radians(:userLat)) *
            sin(radians(userLocation.latitude))
          )
        ) * 1000 <= service.radius
      `,
          {
            userLat: filters.latitude,
            userLon: filters.longitude,
          },
        );

        idQuery.orderBy('distance', 'ASC');
      } else {
        idQuery.orderBy('service.createdAt', 'DESC');
      }
    }

    idQuery.andWhere('service.isActive = :isActive', { isActive: true });
    idQuery.skip(skip).take(limit);

    const allIdsResult = await idQuery.getRawMany();
    const allServiceIds = [...new Set(allIdsResult.map((row) => row.id))];

    const paginatedIds = allServiceIds.slice(skip, skip + limit);

    if (paginatedIds.length === 0) {
      return {
        data: [],
        meta: {
          total: allServiceIds.length,
          page,
          limit,
          totalPages: Math.ceil(allServiceIds.length / limit),
        },
      };
    }

    const servicesAll = await this.serviceRepository.find({
      where: { id: In(paginatedIds) },
      relations: [
        'subcategory',
        'subcategory.category',
        'reviews',
        'reviews.user',
        'user',
        'user.location',
      ],
    });

    if (filters.latitude && filters.longitude) {
      for (const service of servicesAll) {
        if (service.user?.location) {
          const distance = this.calculateDistance(
            filters.latitude,
            filters.longitude,
            service.user.location.latitude,
            service.user.location.longitude,
          );
          service['distance'] = Math.round(distance);
        }
      }

      servicesAll.sort((a, b) => {
        if (a['distance'] === undefined) return 1;
        if (b['distance'] === undefined) return -1;
        return a['distance'] - b['distance'];
      });
    }

    const servicesWithStats = servicesAll.map((service) => {
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
        total: allServiceIds.length,
        page,
        limit,
        totalPages: Math.ceil(allServiceIds.length / limit),
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
    date: Date,
    providerId: number,
  ): Promise<AvailableSlot[]> {
    const dayOfWeek = date.getDay();
    const availability = availabilities.find(
      (avail) => avail.dayOfWeek === dayOfWeek && avail.isActive,
    );

    if (!availability) {
      return [];
    }

    const providerBookings = await this.bookingRepository.find({
      where: {
        service: { user: { id: providerId } },
        date: Between(
          new Date(date.setHours(0, 0, 0, 0)),
          new Date(date.setHours(23, 59, 59, 999)),
        ),
        status: BookingStatus.CONFIRMED,
      },
      relations: ['service'],
    });

    return this.calculateAvailableSlots(availability, providerBookings);
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
        'user.location',
      ],
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    if (date) {
      const availableSlots = await this.getAvailableSlots(
        service.user.availabilities,
        date,
        service.user.id,
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

    if (updateServiceDto.location && service.user) {
      let userLocation = await this.userLocationRepository.findOne({
        where: { user: { id: service.user.id } },
      });
      if (userLocation) {
        Object.assign(userLocation, updateServiceDto.location);
        await this.userLocationRepository.save(userLocation);
      } else {
        userLocation = this.userLocationRepository.create({
          ...updateServiceDto.location,
          user: service.user,
        });
        await this.userLocationRepository.save(userLocation);
      }
    }

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
        'user.location',
      ],
      order: {
        createdAt: 'DESC',
      },
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

    const weekAvailability: DayAvailability[] = [];
    const currentDate = new Date(weekStart);

    while (currentDate <= weekEnd) {
      const dayAvailability = service.user.availabilities.find(
        (avail) => avail.dayOfWeek === currentDate.getDay(),
      );

      if (dayAvailability && dayAvailability.isActive) {
        const availableSlots = await this.getAvailableSlots(
          service.user.availabilities,
          new Date(currentDate),
          service.user.id,
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
