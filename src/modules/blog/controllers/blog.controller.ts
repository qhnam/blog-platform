import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { CustomRequest } from 'src/common/guards/guard.const';
import { SuccessResponse } from 'src/common/response/success.response';
import { UserGuard } from 'src/common/guards/user.guard';
import { GetAllBlogDto } from '../dtos/get-all-blog.dto';
import { PaginatedResponse } from 'src/common/response/paginatied.response';

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

  @Get(':id')
  async findOneBlog(@Param('id') id: number) {
    return SuccessResponse.call(
      await this.blogService.findOne(id),
      'Get blog successfully',
    );
  }

  @Get('')
  async findAllBlog(@Query() dto: GetAllBlogDto) {
    const { data, total } = await this.blogService.findAll(dto);

    const paginate = new PaginatedResponse({
      items: data,
      totalItems: total,
      page: dto.page,
      limit: dto.limit,
    });

    return paginate.call('Get list blog successfully');
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: number, @Req() req: CustomRequest) {
    return SuccessResponse.call(
      await this.blogService.deleteBlog(req.jwtPayload.id, id),
      'Delete blog successfully',
    );
  }
}
