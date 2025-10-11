import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsSemVer,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Account } from '../../entities/account.entity';

export class CreateAccountDTO implements Partial<Account> {
  @IsString()
  @MaxLength(20)
  @MinLength(2)
  title?: string;
  @IsNumber()
  openingBalance: number;
  @IsNumber()
  closingBalance: number;
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  /**
   * @IsInt() → ensures it’s an integer.
    @Min(1) → ensures it’s a positive number.
    @IsNotEmpty() → ensures it’s not missing.
   */
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  userId: number;
}

export class UpdateAccountDTO extends CreateAccountDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  accountId?: number;
}

export class DeleteAccountDTO {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  accountId?: number;
}
