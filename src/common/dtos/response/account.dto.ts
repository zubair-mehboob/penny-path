import { Expose } from 'class-transformer';
import { Account } from 'src/common/entities/account.entity';
import { User } from 'src/common/entities/user.entity';

export class AccountResponseDTO implements Partial<Account> {
  @Expose()
  accountId: number;
  @Expose()
  title: string;
  @Expose()
  balance: number;
  @Expose()
  isDefault: boolean;
}
