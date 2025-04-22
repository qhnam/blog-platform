import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
