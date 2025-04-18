import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { SuccessResponse } from 'src/common/response/success.response';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';
import { PaginatedResponse } from 'src/common/response/paginatied.response';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(UserGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return SuccessResponse.call(
      await this.categoryService.createCategory(dto),
      'Create category successfully',
    );
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return SuccessResponse.call(
      await this.categoryService.updateCategory(id, dto),
      'Update category successfully',
    );
  }

  @Get(':id')
  async findOneCategory(@Param('id') id: number) {
    return SuccessResponse.call(
      await this.categoryService.findOne(id),
      'Get detail category successfully',
    );
  }

  @Get('')
  async findAllCategory(@Query() query: BaseFilterDto) {
    const { data, total } = await this.categoryService.findAll(query);
    const pagination = new PaginatedResponse({
      items: data,
      limit: query.limit,
      page: query.page,
      totalItems: total,
    });
    return pagination.call('Get list category successfully');
  }
}
