import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category with the provided information',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Category creation data',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: Category,
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
          example: [
            'name should not be empty',
            'description should not be empty',
          ],
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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories in the system',
  })
  @ApiOkResponse({
    description: 'List of all categories retrieved successfully',
    type: [Category],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieves a specific category by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Category update data',
  })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
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
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Permanently deletes a category from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Category deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Category not found' },
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
    return this.categoryService.remove(id);
  }
}
