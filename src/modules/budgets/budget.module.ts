import { Module } from '@nestjs/common';
import { BudgetService } from './services/budget.service';
import { BudgetController } from './controllers/budget.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
