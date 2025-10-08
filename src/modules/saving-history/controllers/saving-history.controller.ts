import { Controller, Get } from '@nestjs/common';
import { SavingHistoryService } from '../services/saving-history.service';
/**
 * The plural of "income" is incomes. You can use "income" as an uncountable noun when referring to money in general,
 * and "incomes" as a countable noun when referring to multiple, distinct sums of money, such as different types of
 * earnings or a collection of separate income sources
 */
@Controller('saving-history')
export class SavingHistoryController {
  constructor(private savingHistoryService: SavingHistoryService) {}
}
