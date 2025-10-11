import { Injectable } from '@nestjs/common';

import { AccountService } from 'src/modules/accounts/services/account.service';
import { CreateExpenseDTO } from '../dtos/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private accountService: AccountService) {}

  // // ✅ Create an expense (supports nested/child expenses)
  // async createExpense(dto: CreateExpenseDTO): Promise<Expense> {

  // }

  // // ✅ Get all expenses by account (with children)
  // async getExpensesByAccount(accountId: number): Promise<Expense[]> {

  // }

  // // ✅ Get single expense (with children)
  // async getExpenseById(expenseId: number): Promise<Expense> {

  // }

  // // ✅ Update expense
  // async updateExpense(
  //   expenseId: number,
  //   payload: Partial<Expense>,
  // ): Promise<Expense> {

  // }

  // // ✅ Delete expense
  // async deleteExpense(expenseId: number): Promise<void> {

  // }

  // // ✅ Add a child expense
  // async addChildExpense(
  //   parentId: number,
  //   payload: Partial<Expense>,
  // ): Promise<Expense> {

  // }

  // // ✅ Optional — Get total spent under an expense (sum of child expenses)
  // async getExpenseTotal(expenseId: number): Promise<number> {
  //   return 1
  // }
}
