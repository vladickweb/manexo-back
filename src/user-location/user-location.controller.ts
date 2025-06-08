import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserLocationService } from './user-location.service';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserLocation } from './entities/user-location.entity';

@ApiTags('user-location')
@Controller('user-location')
export class UserLocationController {
  constructor(private readonly userLocationService: UserLocationService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una localización de usuario' })
  @ApiResponse({ status: 201, type: UserLocation })
  create(
    @Body() createUserLocationDto: CreateUserLocationDto,
  ): Promise<UserLocation> {
    return this.userLocationService.create(createUserLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las localizaciones de usuario' })
  @ApiResponse({ status: 200, type: [UserLocation] })
  findAll(): Promise<UserLocation[]> {
    return this.userLocationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una localización de usuario por ID' })
  @ApiResponse({ status: 200, type: UserLocation })
  findOne(@Param('id') id: string): Promise<UserLocation> {
    return this.userLocationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una localización de usuario' })
  @ApiResponse({ status: 200, type: UserLocation })
  update(
    @Param('id') id: string,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
  ): Promise<UserLocation> {
    return this.userLocationService.update(+id, updateUserLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una localización de usuario' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string): Promise<void> {
    return this.userLocationService.remove(+id);
  }
}
