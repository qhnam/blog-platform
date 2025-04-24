import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DATA_SOURCE_OPTION } from './config/data-source-option';
import { BlogModule } from './modules/blog/blog.module';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { CommonModule } from './modules/common/common.module';
import { LogErrorModule } from './modules/log-error/log-error.module';
import { UserModule } from './modules/users/users.modules';
import { QueueModule } from './modules/common/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DATA_SOURCE_OPTION),
    JwtModule.register({
      global: true,
    }),
    CommonModule,
    QueueModule,
    UserModule,
    CategoryModule,
    BlogModule,
    CommentModule,
    LogErrorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
