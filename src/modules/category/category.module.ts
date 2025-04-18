import { Module } from '@nestjs/common';
import { CommonModule } from '../common.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryShareService } from './services/category-share.service';
import { CategoryService } from './services/category.service';

@Module({
  imports: [CommonModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryShareService],
})
export class CategoryModule {}
