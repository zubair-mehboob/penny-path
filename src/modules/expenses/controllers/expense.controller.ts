import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDTO } from '../dtos/create-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get('/:accountId')
  getAll(@Param('accountId') accountId: number) {
    return this.expenseService.getExpensesByAccount(accountId);
  }

  @Post()
  create(@Body() dto: CreateExpenseDTO) {
    return this.expenseService.createExpense(dto);
  }
}
