// src/expenses/expense.entity.ts
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
import { Budget } from '../budgets/budget.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Account, (account) => account.expenses, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Category, (category) => category.expenses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @ManyToOne(() => Expense, (expense) => expense.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: Expense;

  @OneToMany(() => Expense, (expense) => expense.parent)
  children: Expense[];

  @ManyToOne(() => Budget, (budget) => budget.expenses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  budget: Budget;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
