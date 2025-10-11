import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/common/entities/expense.entity';
import { TreeRepository } from 'typeorm';
import {
  CreateExpenseDTO,
  UpdateExpenseDTO,
} from 'src/common/dtos/request/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: TreeRepository<Expense>,
    private readonly accountService: AccountService,
  ) {}

  // ✅ Create an expense (supports nested/child expenses)
  async create(dto: CreateExpenseDTO) {
    const account = await this.accountService.findOneById(dto.accountId);
    if (!account) throw new BadRequestException('Account not found');
    try {
      await this.expenseRepository.save({
        ...dto,
        account: { accountId: dto.accountId },
      });

      return 'Expense create successfully';
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  // ✅ Get all expenses by account (with children)
  async getExpensesByAccount(accountId: number) {
    const roots = await this.expenseRepository.find({
      where: {
        account: { accountId },
      },
    });
    const trees = await Promise.all(
      roots.map((root) => this.expenseRepository.findDescendantsTree(root)),
    );

    return trees;
  }

  // ✅ Get single expense (with children)
  async getExpenseById(expenseId: number) {
    return await this.expenseRepository.findOneBy({ expenseId });
  }

  // // ✅ Update expense
  // async updateExpense(
  //   expenseId: number,
  //   payload: Partial<Expense>,
  // ): Promise<Expense> {

  // }

  // // ✅ Delete expense
  // async deleteExpense(expenseId: number): Promise<void> {

  // }

  // ✅ Add a child expense
  async addChildExpense(payload: UpdateExpenseDTO) {
    const parent = await this.getExpenseById(payload.parentId);
    if (!parent) throw new BadRequestException('expense not found');
    payload.parent = parent;
    return await this.expenseRepository.save({ ...payload });
  }

  // // ✅ Optional — Get total spent under an expense (sum of child expenses)
  // async getExpenseTotal(expenseId: number): Promise<number> {
  //   return 1
  // }
}
