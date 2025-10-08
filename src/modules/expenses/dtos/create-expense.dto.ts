import {
  IsDate,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDTO {
  @IsString()
  title: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
  @IsOptional()
  @IsDate()
  date: Date;
  @IsOptional()
  @IsString()
  note: string;
  createdAt: Date;
  @IsNumber()
  accountId: number;
  @IsNumber()
  @IsOptional()
  parentId?: number;
  @IsNumber()
  @IsOptional()
  budgetId?: number;
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
