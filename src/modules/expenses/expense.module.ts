import { Module } from '@nestjs/common';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseService } from './services/expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
