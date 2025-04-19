import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomRequest } from 'src/common/guards/guard.const';
import { UserGuard } from 'src/common/guards/user.guard';
import { PaginatedResponse } from 'src/common/response/paginatied.response';
import { SuccessResponse } from 'src/common/response/success.response';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { GetAllCommentDto } from '../dtos/get-all-comment.dto';
import { CommentService } from '../services/comment.service';

@Controller('comments')
@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(UserGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('')
  async createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: CustomRequest,
  ) {
    return SuccessResponse.call(
      await this.commentService.createComment(req.jwtPayload.id, dto),
      'Create comment successfully',
    );
  }

  @Get('')
  async findAllComment(@Query() dto: GetAllCommentDto) {
    const { data, total } = await this.commentService.findAll(dto);
    const pagination = new PaginatedResponse({
      items: data,
      totalItems: total,
      page: dto.page,
      limit: dto.limit,
    });

    return pagination.call('Get list comment successfully');
  }
}
