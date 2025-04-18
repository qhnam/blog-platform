import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { CustomRequest } from 'src/common/guards/guard.const';
import { SuccessResponse } from 'src/common/response/success.response';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('blog')
@ApiTags('Blog')
@ApiBearerAuth()
@UseGuards(UserGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('')
  async createBlog(@Body() dto: CreateBlogDto, @Req() req: CustomRequest) {
    return SuccessResponse.call(
      await this.blogService.createBlog(req.jwtPayload.id, dto),
      'Create blog successfully',
    );
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: number,
    @Body() dto: CreateBlogDto,
    @Req() req: CustomRequest,
  ) {
    return SuccessResponse.call(
      await this.blogService.updateBlog(req.jwtPayload.id, id, dto),
      'Update blog successfully',
    );
  }
}
