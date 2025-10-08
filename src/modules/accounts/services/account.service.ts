import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  /**
   * Create a new account
   */
  async create(payload: Partial<Account>): Promise<Account> {
    const account = this.accountRepository.create(payload);
    return await this.accountRepository.save(account);
  }

  /**
   * Get all accounts of a user
   */
  async findAll(userId: number): Promise<Account[]> {
    return await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.expenses', 'expense')
      .leftJoinAndSelect('account.user', 'user')
      .where('user.userId = :userId', { userId })
      .orderBy('account.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Get single account by ID
   */
  async findOne(id: number): Promise<Account> {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.expenses', 'expense')
      .where('account.id = :id', { id })
      .getOne();

    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  /**
   * Update account details
   */
  async update(id: number, payload: Partial<Account>): Promise<Account> {
    const existing = await this.findOne(id);
    Object.assign(existing, payload);
    await this.accountRepository.save(existing);
    return existing;
  }

  /**
   * Delete an account
   */
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.accountRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Account not found');
    return { message: 'Account deleted successfully' };
  }
}
