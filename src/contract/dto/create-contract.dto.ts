import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TimeSlot {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class CreateContractDto {
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEmail()
  @IsNotEmpty()
  clientEmail: string;

  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsNumber()
  @IsNotEmpty()
  providerId: number;

  @IsNumber()
  @IsNotEmpty()
  agreedPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  timeSlots: TimeSlot[];
}
