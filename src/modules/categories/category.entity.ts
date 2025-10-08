// src/categories/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budgets/budget.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];
}
