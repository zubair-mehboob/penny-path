import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expense.entity';
import { Account } from '../../accounts/account.entity';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { CreateExpenseDTO } from '../dtos/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private accountService: AccountService,
  ) {}

  // ✅ Create an expense (supports nested/child expenses)
  async createExpense(dto: CreateExpenseDTO): Promise<Expense> {
    const { accountId, parentId, ...payload } = dto;
    const queryRunner =
      this.expenseRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let account: Account | null = null;
      if (accountId) {
        account = await this.accountService.findOne(accountId);
      }
      let parent: Expense | null = null;

      if (parentId) {
        parent = await queryRunner.manager
          .getRepository(Expense)
          .createQueryBuilder('expense')
          .where('expense.expenseId = :parentId', { parentId })
          .getOne();

        if (!parent) throw new NotFoundException('Parent expense not found');
      }

      const expense = queryRunner.manager
        .getRepository(Expense)
        .create({ ...payload, account, parent });

      const saved = await queryRunner.manager.save(expense);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ Get all expenses by account (with children)
  async getExpensesByAccount(accountId: number): Promise<Expense[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.children', 'children')
      .leftJoinAndSelect('expense.parent', 'parent')
      .leftJoinAndSelect('expense.category', 'category')
      .where('expense.accountId = :accountId', { accountId })
      .orderBy('expense.createdAt', 'DESC')
      .getMany();
  }

  // ✅ Get single expense (with children)
  async getExpenseById(expenseId: number): Promise<Expense> {
    const expense = await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.children', 'children')
      .leftJoinAndSelect('expense.parent', 'parent')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.account', 'account')
      .where('expense.expenseId = :expenseId', { expenseId })
      .getOne();

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  // ✅ Update expense
  async updateExpense(
    expenseId: number,
    payload: Partial<Expense>,
  ): Promise<Expense> {
    const existing = await this.getExpenseById(expenseId);

    await this.expenseRepository
      .createQueryBuilder()
      .update(Expense)
      .set(payload)
      .where('expenseId = :expenseId', { expenseId })
      .execute();

    return { ...existing, ...payload };
  }

  // ✅ Delete expense
  async deleteExpense(expenseId: number): Promise<void> {
    const result = await this.expenseRepository
      .createQueryBuilder()
      .delete()
      .from(Expense)
      .where('expenseId = :expenseId', { expenseId })
      .execute();

    if (result.affected === 0) throw new NotFoundException('Expense not found');
  }

  // ✅ Add a child expense
  async addChildExpense(
    parentId: number,
    payload: Partial<Expense>,
  ): Promise<Expense> {
    const parent = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.expenseId = :parentId', { parentId })
      .getOne();

    if (!parent) throw new NotFoundException('Parent expense not found');

    const child = this.expenseRepository.create({
      ...payload,
      parent,
      account: parent.account,
    });

    return await this.expenseRepository.save(child);
  }

  // ✅ Optional — Get total spent under an expense (sum of child expenses)
  async getExpenseTotal(expenseId: number): Promise<number> {
    const { total } = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.parentId = :expenseId', { expenseId })
      .getRawOne();

    return Number(total) || 0;
  }
}
