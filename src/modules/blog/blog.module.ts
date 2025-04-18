import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { BlogController } from './controllers/blog.controller';
import { BlogShareService } from './services/blog-share.service';
import { BlogService } from './services/blog.service';

@Module({
  imports: [CommonModule],
  controllers: [BlogController],
  providers: [BlogService, BlogShareService],
})
export class BlogModule {}
