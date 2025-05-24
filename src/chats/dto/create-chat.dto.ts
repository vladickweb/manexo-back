import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;
}
