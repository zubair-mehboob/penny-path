import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import {
  CreateExpenseDTO,
  UpdateExpenseDTO,
} from 'src/common/dtos/request/expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  getAll(@Query('accountId') accountId: number) {
    return this.expenseService.getExpensesByAccount(accountId);
  }
  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.expenseService.getExpenseById(id);
  }

  @Post()
  create(@Body() dto: CreateExpenseDTO) {
    return this.expenseService.create(dto);
  }

  @Post('add-child-expense')
  addChildExpense(@Body() dto: UpdateExpenseDTO) {
    return this.expenseService.addChildExpense(dto);
  }
}
