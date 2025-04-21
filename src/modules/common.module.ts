import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-yet';
import { ENVIRONMENT } from 'src/common/const/environment';
import { BlogEntity } from './blog/entities/blog.entity';
import { BlogShareService } from './blog/services/blog-share.service';
import { CategoryEntity } from './category/entities/category.entity';
import { CategoryShareService } from './category/services/category-share.service';
import { CommentEntity } from './comment/entities/comment.entity';
import { LogErrorEntity } from './log-error/entities/log-error.entity';
import { UserEntity } from './users/entities/users.entity';

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
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore.redisStore({
          socket: {
            host: ENVIRONMENT.REDIS_HOST,
            port: Number(ENVIRONMENT.REDIS_PORT),
          },
        }),
      }),
    }),
    typeormEntities,
  ],
  exports: [typeormEntities, ...providers],
})
export class CommonModule {}
