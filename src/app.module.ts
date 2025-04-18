import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/users.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENVIRONMENT } from './common/const/environment';
import { CategoryModule } from './modules/category/category.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BlogController } from './modules/blog/controllers/blog.controller';
import { BlogModule } from './modules/blog/blog.module';
import { CommonModule } from './modules/common.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
