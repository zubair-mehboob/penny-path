import { Module } from '@nestjs/common';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseService } from './services/expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../accounts/account.module';

@Module({
  imports: [AccountModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
