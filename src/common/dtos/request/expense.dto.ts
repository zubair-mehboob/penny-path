import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Account } from 'src/common/entities/account.entity';
import { Expense } from 'src/common/entities/expense.entity';

export class CreateExpenseDTO {
  @IsOptional()
  @IsString()
  description: string;
  @IsString()
  title: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Type(() => Date)
  @IsDate()
  date: Date;
  @IsNumber()
  accountId: number;
}

export class UpdateExpenseDTO extends CreateExpenseDTO {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  parentId: number;

  @Type(() => Expense)
  parent: Expense;
}
