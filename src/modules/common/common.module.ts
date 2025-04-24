import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-yet';
import { ENVIRONMENT } from 'src/common/const/environment';
import { BlogEntity } from '../blog/entities/blog.entity';
import { BlogShareService } from '../blog/services/blog-share.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryShareService } from '../category/services/category-share.service';
import { CommentEntity } from '../comment/entities/comment.entity';
import { LogErrorEntity } from '../log-error/entities/log-error.entity';
import { UserEntity } from '../users/entities/users.entity';
import { MailService } from './mail/services/mail.service';
import { OtpService } from './otp/services/otp.service';

export const redisCacheStore: Provider<Cache> = {
  provide: 'CACHE_REDIS',
  useFactory: async (): Promise<Cache> => {
    const store = await redisStore.redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      ttl: 60,
    });

    return store as unknown as Cache;
  },
};

const typeormEntities = TypeOrmModule.forFeature([
  UserEntity,
  CategoryEntity,
  BlogEntity,
  CommentEntity,
  LogErrorEntity,
]);

const providers = [
  CategoryShareService,
  BlogShareService,
  MailService,
  OtpService,
  redisCacheStore,
];

@Module({
  controllers: [],
  providers: providers,
  imports: [
    // CacheModule.register({}),

    MailerModule.forRoot({
      transport: {
        host: ENVIRONMENT.MAIL_HOST,
        port: Number(ENVIRONMENT.MAIL_PORT),
        secure: ENVIRONMENT.MAIL_SECURE,
        auth: {
          user: ENVIRONMENT.MAIL_USERNAME,
          pass: ENVIRONMENT.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${ENVIRONMENT.MAIL_SENDER}>`,
      },
    }),
    typeormEntities,
  ],
  exports: [typeormEntities, ...providers, redisCacheStore],
})
export class CommonModule {}
