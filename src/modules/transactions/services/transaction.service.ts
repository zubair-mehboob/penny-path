import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/common/entities/transaction.entity';
import { TreeRepository } from 'typeorm';
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
} from 'src/common/dtos/request/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TreeRepository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  // ✅ Create an Transaction (supports nested/child Transactions)
  async create(dto: CreateTransactionDTO) {
    const account = await this.accountService.findOneById(dto.accountId);
    if (!account) throw new BadRequestException('Account not found');
    try {
      await this.transactionRepository.save({
        ...dto,
        account: { accountId: dto.accountId },
      });

      return 'Transaction create successfully';
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  // ✅ Get all Transactions by account (with children)
  async getTransactionsByAccount(accountId: number) {
    const roots = await this.transactionRepository.find({
      where: {
        account: { accountId },
      },
    });
    const trees = await Promise.all(
      roots.map((root) => this.transactionRepository.findDescendantsTree(root)),
    );

    return trees;
  }

  // ✅ Get single Transaction (with children)
  async getTransactionById(transactionId: number) {
    return await this.transactionRepository.findOneBy({ transactionId });
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
  async addChildTransaction(payload: UpdateTransactionDTO) {
    const parent = await this.getTransactionById(payload.parentId);
    if (!parent) throw new BadRequestException('expense not found');
    payload.parent = parent;
    return await this.transactionRepository.save({ ...payload });
  }

  // // ✅ Optional — Get total spent under an expense (sum of child expenses)
  // async getExpenseTotal(expenseId: number): Promise<number> {
  //   return 1
  // }
}
