import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { ErrorException } from 'src/common/exception/error.exception';
import { ERROR_CODE } from 'src/common/enum/error-code.enum';
import slugify from 'slugify';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';
import { BlogShareService } from 'src/modules/blog/services/blog-share.service';
import { CATEGORY_ERROR_ENUM } from '../enums/category-error.enum';
import { CategoryShareService } from './category-share.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly categoryShareService: CategoryShareService,
    private readonly blogShareService: BlogShareService,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    const slug = slugify(dto.title, {
      lower: true,
    });

    const category = await this.categoryShareService.findOneByCondition({
      slug,
    });

    if (category) {
      throw new ErrorException(
        ERROR_CODE.ALREADY_EXISTS,
        'Category already exists',
      );
    }

    const newCategory = new CategoryEntity();
    newCategory.title = dto.title;
    newCategory.slug = slug;

    return await this.categoryRepo.save(newCategory);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryShareService.findOneByCondition({
      id,
    });

    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    const slug = slugify(dto.title, {
      lower: true,
    });

    const existed = await this.categoryRepo
      .createQueryBuilder('c')
      .where('slug = :slug', { slug })
      .andWhere('id != :id', { id })
      .getOne();

    if (existed) {
      throw new ErrorException(
        ERROR_CODE.ALREADY_EXISTS,
        'Category already exists',
      );
    }

    category.title = dto.title;
    category.slug = slug;
    return await this.categoryRepo.save(category);
  }

  async findOne(id: number) {
    const category = await this.categoryShareService.findOneByCondition({
      id,
    });

    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryShareService.findOneByCondition({
      slug,
    });

    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    return category;
  }

  async findAll(
    dto: BaseFilterDto,
  ): Promise<{ data: CategoryEntity[]; total: number }> {
    const query = await this.categoryRepo.createQueryBuilder('c');

    if (dto.search) {
      query.where('c.slug LIKE :search', {
        search: `%${slugify(dto.search, { lower: true })}%`,
      });
    }

    const [data, total] = await query
      .skip(dto.getOffset())
      .take(dto.limit)
      .orderBy('c.id', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async deleteCategory(id: number) {
    const category = await this.categoryShareService.findOneByCondition({
      id,
    });

    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    if (await this.blogShareService.isCategoryInUse(id)) {
      throw new ErrorException(
        CATEGORY_ERROR_ENUM.ALREADY_USE,
        'Category used in blog',
      );
    }

    await this.categoryRepo.delete(id);
  }
}
