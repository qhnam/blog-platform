import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { ErrorException } from 'src/common/exception/error.exception';
import { ERROR_CODE } from 'src/common/enum/error-code.enum';

@Injectable()
export class CategoryShareService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findOneByCondition(
    condition: Partial<Pick<CategoryEntity, 'id' | 'slug'>>,
  ) {
    const category = await this.categoryRepository.findOne({
      where: condition,
    });
    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    return category;
  }
}
