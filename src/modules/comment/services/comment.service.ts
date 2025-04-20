import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { BlogShareService } from 'src/modules/blog/services/blog-share.service';
import { ErrorException } from 'src/common/exception/error.exception';
import { ERROR_CODE } from 'src/common/enum/error-code.enum';
import { GetAllCommentDto } from '../dtos/get-all-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly blogShareService: BlogShareService,
  ) {}

  private _getQueryComment(alias: string = 'comment') {
    return this.commentRepository
      .createQueryBuilder('comment')
      .select(['comment.id', 'comment.content', 'comment.createdAt'])
      .leftJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.email']);
  }

  async findAll(
    dto: GetAllCommentDto,
  ): Promise<{ data: CommentEntity[]; total: number }> {
    const query = this._getQueryComment('comment').where(
      'comment.blogId = :blogId',
      { blogId: dto.blogId },
    );

    const [data, total] = await query
      .skip(dto.getOffset())
      .take(dto.limit)
      .orderBy('comment.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async createComment(userId: number, dto: CreateCommentDto) {
    const blog = await this.blogShareService.exists(dto.blogId);

    if (!blog) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Blog not found');
    }

    const comment = new CommentEntity();
    comment.userId = userId;
    comment.content = dto.content;
    comment.blogId = dto.blogId;

    await this.commentRepository.save(comment);

    return await this._getQueryComment('comment')
      .where('comment.id = :id', { id: comment.id })
      .getOne();
  }

  async deleteComment(userId: number, id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, userId },
    });

    if (!comment) {
      throw new ErrorException(ERROR_CODE.NOT_FOUND, 'Comment not found');
    }

    await this.commentRepository.delete(id);
  }
}
