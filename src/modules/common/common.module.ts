import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-yet';
import { ENVIRONMENT } from 'src/common/const/environment';
import { BlogEntity } from '../blog/entities/blog.entity';
import { BlogShareService } from '../blog/services/blog-share.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryShareService } from '../category/services/category-share.service';
import { CommentEntity } from '../comment/entities/comment.entity';
import { LogErrorEntity } from '../log-error/entities/log-error.entity';
import { UserEntity } from '../users/entities/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email/services/email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { OtpService } from './otp/services/otp.service';

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
  EmailService,
  OtpService,
];

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
          'email',
          'templates',
        ), // dùng path tuyệt đối sau build
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
