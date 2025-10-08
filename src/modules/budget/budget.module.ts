import { Module } from '@nestjs/common';
import { BudgetService } from './services/budget.service';
import { BudgetController } from './controllers/budget.controller';
import { Budget } from './budget.entity';

@Module({
  imports: [Budget],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
