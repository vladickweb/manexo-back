import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user account with the provided information',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email', 'firstName should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users in the system',
  })
  @ApiOkResponse({
    description: 'List of all users retrieved successfully',
    type: [User],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieves a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Patch('test')
  @ApiOperation({
    summary: 'Test endpoint',
    description: 'Test endpoint for development purposes',
  })
  @ApiOkResponse({
    description: 'Test response',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'test' },
      },
    },
  })
  test() {
    return { message: 'test' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates an existing user with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Permanently deletes a user from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Post(':id/profile-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file (max 5MB)',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload profile image',
    description: 'Uploads a profile image for the specified user',
  })
  @ApiOkResponse({
    description: 'Profile image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile image uploaded successfully',
        },
        imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No file provided or invalid file',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'No file provided' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async uploadProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.userService.updateProfileImage(id, file);
  }

  @Delete(':id/profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'number',
    example: 1,
  })
  @ApiOperation({
    summary: 'Remove profile image',
    description: 'Removes the profile image for the specified user',
  })
  @ApiOkResponse({
    description: 'Profile image removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile image removed successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async removeProfileImage(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeProfileImage(id);
  }
}
