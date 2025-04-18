import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogShareService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async isCategoryInUse(categoryId: number): Promise<boolean> {
    const count = await this.blogRepository.count({
      where: {
        categoryId,
      },
    });

    return count > 0;
  }
}
