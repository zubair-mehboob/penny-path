import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDTO } from 'src/common/dtos/request/account.dto';
import { Account } from 'src/common/entities/account.entity';
import { UserService } from 'src/modules/users/services/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(userId: number, dto: CreateAccountDTO): Promise<Account> {
    const user = this.userService.findOneBy('userId', userId);
    if (!user) throw new BadRequestException('user not found');
    try {
      if (dto.isDefault) {
        await this.accountRepository
          .createQueryBuilder()
          .update(Account)
          .set({ isDefault: false })
          .where('userId = :userId', { userId })
          .execute();
      }
      const result = await this.accountRepository
        .createQueryBuilder()
        .insert()
        .into(Account)
        .values({ ...dto, user: { userId } })
        .execute();
      console.log({ result: result.identifiers[0] });
      const account = await this.accountRepository.findOne({
        where: { accountId: result.identifiers[0].accountId },
        relations: ['user'], // if you need related data
      });
      return account;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getAll(userId: number): Promise<Account[]> {
    const result = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoin('account.user', 'user')
      .select([
        'account.accountId AS accountId',
        'account.title AS title',
        'account.balance AS balance',
        'account.isDefault AS isDefault',
        'user.userId AS userId', // 👈 alias flatten
      ])
      .where('user.userId = :id', { id: userId })
      .getRawMany(); // 👈 important — use raw results here
    return result;
  }

  async findOneById(accountId: number) {
    return await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user') //select user from account as user
      .where('account.accountId = :accountId', { accountId })
      .getOne();
  }

  async setDefaultAccountById(accountId: number) {
    try {
      const account = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.user', 'user')
        .where('account.accountId = :accountId', { accountId })
        .getOne();
      if (!account) throw new NotFoundException('account not found');
      const userId = account.user.userId;
      const res = await this.accountRepository
        .createQueryBuilder()
        .update(Account)
        .set({ isDefault: false })
        .where('userId =:userId', { userId })
        .execute();
      account.isDefault = true;
      return await this.accountRepository.save(account);
    } catch (e) {
      console.error(e, 'error inside route set default');
      return e;
    }
  }

  async getDefaultAccountByUserId(userId: number) {
    return await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user')
      .where('user.userId = :userId', { userId })
      .andWhere('account.isDefault = :isDefault', { isDefault: true })
      .getOne();
  }
}
