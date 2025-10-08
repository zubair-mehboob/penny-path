// src/budgets/budget.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Category } from '../categories/category.entity';
import { Expense } from '../expenses/expense.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Account, (account) => account.budgets, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Category, (category) => category.budgets, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Column({ type: 'varchar', length: 7 }) // YYYY-MM
  month: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @OneToMany(() => Expense, (expense) => expense.budget)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;
}
