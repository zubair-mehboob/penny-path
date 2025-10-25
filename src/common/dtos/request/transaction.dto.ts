import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Transaction } from 'src/common/entities/transaction.entity';

export class CreateTransactionDTO {
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

export class UpdateChildTransactionDTO extends CreateTransactionDTO {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  parentId: number;

  @Type(() => Transaction)
  parent: Transaction;
}

export interface UpdateTransactionDTO extends Partial<Transaction> {}
