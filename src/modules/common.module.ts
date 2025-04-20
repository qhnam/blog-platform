import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/users.entity';
import { CategoryEntity } from './category/entities/category.entity';
import { BlogEntity } from './blog/entities/blog.entity';
import { CategoryShareService } from './category/services/category-share.service';
import { BlogShareService } from './blog/services/blog-share.service';
import { CommentEntity } from './comment/entities/comment.entity';
import { LogErrorEntity } from './log-error/entities/log-error.entity';

const typeormEntities = TypeOrmModule.forFeature([
  UserEntity,
  CategoryEntity,
  BlogEntity,
  CommentEntity,
  LogErrorEntity,
]);

const providers = [CategoryShareService, BlogShareService];

@Module({
  controllers: [],
  providers: providers,
  imports: [typeormEntities],
  exports: [typeormEntities, ...providers],
})
export class CommonModule {}
