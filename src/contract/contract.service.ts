import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { StripeService } from '../stripe/stripe.service';
import { Service } from '../service/entities/service.entity';
import { User } from '../user/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Availability } from '../availability/entities/availability.entity';
import { BookingStatus } from '../booking/entities/booking.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    private stripeService: StripeService,
  ) {}

  async create(createContractDto: CreateContractDto) {
    const service = await this.serviceRepository.findOne({
      where: { id: +createContractDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const [client, provider] = await Promise.all([
      this.userRepository.findOne({
        where: { id: +createContractDto.clientId },
      }),
      this.userRepository.findOne({
        where: { id: +createContractDto.providerId },
      }),
    ]);

    if (!client || !provider) {
      throw new NotFoundException('Cliente o proveedor no encontrado');
    }

    const contract = this.contractRepository.create({
      amount: createContractDto.amount,
      agreedPrice: createContractDto.amount,
      status: ContractStatus.PENDING,
      service,
      client,
      provider,
    });

    const savedContract = await this.contractRepository.save(contract);

    const bookings = await Promise.all(
      createContractDto.timeSlots.map(async (slot) => {
        const dayOfWeek = new Date(slot.date).getDay();

        const availability = await this.availabilityRepository.findOne({
          where: {
            user: { id: provider.id },
            dayOfWeek,
            isActive: true,
          },
        });

        if (!availability) {
          throw new NotFoundException(
            `No hay disponibilidad activa para el día ${dayOfWeek} (${this.getDayName(dayOfWeek)}) para el proveedor`,
          );
        }

        if (!availability.isActive) {
          throw new NotFoundException(
            `La disponibilidad para el día ${dayOfWeek} no está activa`,
          );
        }

        const slotStart = new Date(`2000-01-01T${slot.startTime}`);
        const slotEnd = new Date(`2000-01-01T${slot.endTime}`);
        const availStart = new Date(`2000-01-01T${availability.startTime}`);
        const availEnd = new Date(`2000-01-01T${availability.endTime}`);

        if (slotStart < availStart || slotEnd > availEnd) {
          throw new NotFoundException(
            `El horario solicitado (${slot.startTime}-${slot.endTime}) no está dentro de la disponibilidad (${availability.startTime}-${availability.endTime})`,
          );
        }

        const existingBooking = await this.bookingRepository.findOne({
          where: {
            provider: { id: provider.id },
            date: new Date(slot.date),
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: BookingStatus.CONFIRMED,
          },
        });

        if (existingBooking) {
          throw new NotFoundException(
            `Ya existe una reserva confirmada para el horario ${slot.startTime}-${slot.endTime} en la fecha ${slot.date}`,
          );
        }

        const booking = this.bookingRepository.create({
          date: new Date(slot.date),
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: BookingStatus.PENDING,
          client,
          provider,
          service,
          availability,
          totalPrice:
            createContractDto.amount / createContractDto.timeSlots.length,
          contract: savedContract,
        });

        const savedBooking = await this.bookingRepository.save(booking);

        return savedBooking;
      }),
    );

    const paymentLink = await this.stripeService.createPaymentLink(
      contract.amount,
      savedContract.id,
      createContractDto.clientEmail,
      createContractDto.serviceName,
    );

    savedContract.stripePaymentIntentId = paymentLink.id;
    const updatedContract = await this.contractRepository.save(savedContract);

    return {
      contract: updatedContract,
      bookings,
      paymentUrl: paymentLink.url,
    };
  }

  async findByUserId(userId: number) {
    return await this.contractRepository.find({
      where: [{ client: { id: userId } }, { provider: { id: userId } }],
      relations: [
        'service',
        'service.user',
        'client',
        'provider',
        'service.subcategory',
        'service.subcategory.category',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async handlePaymentSuccess(contractId: string) {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ['bookings'],
    });

    if (!contract) {
      throw new NotFoundException('Contrato no encontrado');
    }

    contract.status = ContractStatus.PAID;
    await this.contractRepository.save(contract);

    await Promise.all(
      contract.bookings.map(async (booking) => {
        const updatedBooking = await this.bookingRepository.update(booking.id, {
          status: BookingStatus.CONFIRMED,
        });

        return updatedBooking;
      }),
    );

    return contract;
  }

  async findAll() {
    return await this.contractRepository.find({
      relations: [
        'service',
        'service.user',
        'client',
        'provider',
        'service.subcategory',
        'service.subcategory.category',
        'bookings',
      ],
    });
  }

  async findOne(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: [
        'service',
        'service.user',
        'client',
        'provider',
        'service.subcategory',
        'service.subcategory.category',
        'bookings',
      ],
    });

    if (!contract) {
      throw new NotFoundException('Contrato no encontrado');
    }

    return contract;
  }

  update(id: number, _updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }

  private getDayName(dayOfWeek: number): string {
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    return days[dayOfWeek];
  }
}
