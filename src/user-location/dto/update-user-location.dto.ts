import { PartialType } from '@nestjs/swagger';
import { CreateUserLocationDto } from './create-user-location.dto';

export class UpdateUserLocationDto extends PartialType(CreateUserLocationDto) {}
