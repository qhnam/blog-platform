import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { ERROR_CODE } from 'src/common/enum/error-code.enum';
import { ErrorException } from 'src/common/exception/error.exception';
import { CategoryShareService } from 'src/modules/category/services/category-share.service';
import { Repository } from 'typeorm';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { GetAllBlogDto } from '../dtos/get-all-blog.dto';
import { title } from 'process';
import { FILTER_BLOG } from '../enums/filter.enum';

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
    blog.text = dto.text;

    const blogResult = await this.blogRepository.save(blog);
    blogResult.slug = `${slugify(dto.title, { lower: true })}-${blogResult.id}`;

    await this.blogRepository.save(blogResult);

    return blogResult;
  }

  async updateBlog(userId: number, id: number, dto: CreateBlogDto) {
    const blog = await this.blogRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!blog) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Blog not found');
    }

    blog.categoryId = dto.categoryId;
    blog.title = dto.title;
    blog.text = dto.text;

    const blogResult = await this.blogRepository.save(blog);
    blogResult.slug = `${slugify(dto.title, { lower: true })}-${blogResult.id}`;

    await this.blogRepository.save(blogResult);

    return blogResult;
  }

  async deleteBlog(userId: number, id: number) {
    const blog = await this.blogRepository.findOne({
      where: {
        userId,
        id,
      },
    });

    if (!blog) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Blog not found');
    }

    await this.blogRepository.softDelete(id);
  }

  async findOne(id: number) {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.createdAt',
        'blog.updatedAt',
      ])
      .leftJoin('blog.user', 'user')
      .addSelect(['user.id', 'user.email'])
      .leftJoin('blog.category', 'category')
      .addSelect(['category.id', 'category.title', 'category.slug'])
      .getOne();

    if (!blog) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Blog not found');
    }

    return blog;
  }

  async findAll(
    dto: GetAllBlogDto,
  ): Promise<{ data: BlogEntity[]; total: number }> {
    const query = this.blogRepository
      .createQueryBuilder('blog')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.createdAt',
        'blog.updatedAt',
      ])
      .leftJoin('blog.user', 'user')
      .addSelect(['user.id', 'user.email'])
      .leftJoin('blog.category', 'category')
      .addSelect(['category.id', 'category.title', 'category.slug']);

    if (dto.search) {
      query.andWhere('blog.title LIKE :title', { title: `%${dto.search}%` });
    }

    if (dto.userId) {
      query.andWhere('user.id = :userId', { userId: dto.userId });
    }

    if (dto.categoryId) {
      query.andWhere('category.id = :categoryId', {
        categoryId: dto.categoryId,
      });
    }

    if (!dto.orderBy) {
      dto.orderBy = FILTER_BLOG.CREATED_AT;
    }

    const [data, total] = await query
      .skip(dto.getOffset())
      .take(dto.limit)
      .orderBy(`blog.${dto.orderBy}`, dto.sort)
      .getManyAndCount();

    return { data, total };
  }
}
