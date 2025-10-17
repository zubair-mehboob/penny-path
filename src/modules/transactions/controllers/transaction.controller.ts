import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from 'src/common/dtos/request/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getAll(@Query('accountId') accountId: number) {
    return this.transactionService.getTransactionsByAccount(accountId);
  }
  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.transactionService.getTransactionById(id);
  }

  @Post()
  create(@Body() dto: CreateTransactionDTO) {
    return this.transactionService.create(dto);
  }

  @Post('add-child-Transaction')
  addChildTransaction(@Body() dto: UpdateTransactionDTO) {
    return this.transactionService.addChildTransaction(dto);
  }
}
