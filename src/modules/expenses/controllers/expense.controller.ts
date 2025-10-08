import { Controller, Get } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}
}
