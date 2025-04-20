import {
  Body,
  Controller,
  Delete,
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
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { CategoryResponse } from '../responses/category.response';
import { ApiPaginatedResponse } from 'src/common/decorators/api-pagination-response.decorator';
import { ApiSuccessNoContentResponse } from 'src/common/response/api-success-no-content.response';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
@UseGuards(UserGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @ApiSuccessResponse(CategoryResponse)
  async createCategory(@Body() dto: CreateCategoryDto) {
    return SuccessResponse.call(
      await this.categoryService.createCategory(dto),
      'Create category successfully',
    );
  }

  @Put(':id')
  @ApiSuccessResponse(CategoryResponse)
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
  @ApiSuccessResponse(CategoryResponse)
  async findOneCategory(@Param('id') id: number) {
    return SuccessResponse.call(
      await this.categoryService.findOne(id),
      'Get detail category successfully',
    );
  }

  @Get('')
  @ApiPaginatedResponse(CategoryResponse)
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

  @Delete(':id')
  @ApiSuccessResponse(ApiSuccessNoContentResponse)
  async deleteCategory(id: number) {
    return SuccessResponse.call(
      await this.categoryService.deleteCategory(id),
      'Delete category successfully',
    );
  }
}
