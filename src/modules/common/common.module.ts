import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
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
import { redisStore } from 'cache-manager-redis-store'; // Lưu ý import này
import { Cache } from 'cache-manager';

const redisCacheStore: Provider<Cache> = {
  provide: 'CACHE_REDIS',
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: ENVIRONMENT.REDIS_HOST,
        port: ENVIRONMENT.REDIS_PORT,
      },
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
    CacheModule.register({}),
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
      template: {
        dir: join(
          process.cwd(),
          'dist',
          'modules',
          'common',
          'mail',
          'templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    typeormEntities,
  ],
  exports: [typeormEntities, ...providers],
})
export class CommonModule {}
