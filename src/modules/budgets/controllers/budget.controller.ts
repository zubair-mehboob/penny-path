import { Controller, Get } from '@nestjs/common';
import { BudgetService } from '../services/budget.service';

@Controller('budgets')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}
}
