import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
