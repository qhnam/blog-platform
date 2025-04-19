import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ENVIRONMENT } from './common/const/environment';
import { BlogModule } from './modules/blog/blog.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { CommonModule } from './modules/common.module';
import { UserModule } from './modules/users/users.modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ENVIRONMENT.DATABASE_HOST,
      port: Number(ENVIRONMENT.DATABASE_PORT),
      username: ENVIRONMENT.DATABASE_USERNAME,
      password: ENVIRONMENT.DATABASE_PASSWORD,
      database: ENVIRONMENT.DATABASE_SCHEMA,
      migrations: ['dist/migrations/*.js'],
      entities: ['dist/modules/**/entities/*.js'],
      synchronize: false,
    }),
    JwtModule.register({
      global: true,
    }),
    CommonModule,
    UserModule,
    CategoryModule,
    BlogModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
