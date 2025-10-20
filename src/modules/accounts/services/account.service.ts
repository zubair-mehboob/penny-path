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

  async create(dto: CreateAccountDTO): Promise<string> {
    const user = this.userService.findOneBy('userId', dto.userId);
    if (!user) throw new BadRequestException('user not found');
    try {
      await this.accountRepository
        .createQueryBuilder()
        .insert()
        .into(Account)
        .values({ ...dto, user: { userId: dto.userId } })
        .execute();

      return `Account ${dto.title} has been created successfully`;
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
    return await this.accountRepository.findOneBy({ accountId });
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
}
