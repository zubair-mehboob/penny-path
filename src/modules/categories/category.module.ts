import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Category } from './category.entity';

@Module({
  imports: [Category],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
