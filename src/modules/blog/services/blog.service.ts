import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { ERROR_CODE } from 'src/common/enum/error-code.enum';
import { ErrorException } from 'src/common/exception/error.exception';
import { CategoryShareService } from 'src/modules/category/services/category-share.service';
import { Repository } from 'typeorm';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { BlogEntity } from '../entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly categoryShareService: CategoryShareService,
  ) {}

  async createBlog(userId: number, dto: CreateBlogDto) {
    const category = await this.categoryShareService.findOneByCondition({
      id: dto.categoryId,
    });
    if (!category) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Category not found');
    }

    const blog = new BlogEntity();
    blog.userId = userId;
    blog.categoryId = dto.categoryId;
    blog.title = dto.title;
    blog.content = dto.content;

    const blogResult = await this.blogRepository.save(blog);
    blogResult.slug = `${slugify(dto.title, { lower: true })}-${blogResult.id}`;

    await this.blogRepository.save(blogResult);

    return blogResult;
  }
}
