import { Exclude, Expose, Type } from 'class-transformer';
import { AccountResponseDTO } from 'src/common/dtos/response/account.dto';
import { Account } from 'src/common/entities/account.entity';

export class UserResponseDTO {
  @Expose()
  userId: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  @Type(() => AccountResponseDTO)
  accounts: AccountResponseDTO[];
  @Exclude()
  password: string;
}
