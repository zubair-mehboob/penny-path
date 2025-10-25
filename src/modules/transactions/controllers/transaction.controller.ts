import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import {
  CreateTransactionDTO,
  UpdateChildTransactionDTO,
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
  addChildTransaction(@Body() dto: UpdateChildTransactionDTO) {
    return this.transactionService.addChildTransaction(dto);
  }
  /**
   *
   * Checks
   *
   * if a transaction has children then the updated amount cannot be less then the sum of all
   * children amounts.
   * if making new child check first how much amount other childs have used only left amount can be used same for update
   */
  @Patch('/:id')
  updateTransaction(
    @Param('id') id: number,
    @Body() dto: UpdateTransactionDTO,
  ) {
    console.log('reached to server', { id, dto });
    return this.transactionService.updateTransaction(id, dto);
  }
}
