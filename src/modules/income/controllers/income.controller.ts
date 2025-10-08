import { Controller, Get } from '@nestjs/common';
import { IncomeService } from '../services/income.service';
/**
 * The plural of "income" is incomes. You can use "income" as an uncountable noun when referring to money in general,
 * and "incomes" as a countable noun when referring to multiple, distinct sums of money, such as different types of
 * earnings or a collection of separate income sources
 */
@Controller('incomes')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}
}
