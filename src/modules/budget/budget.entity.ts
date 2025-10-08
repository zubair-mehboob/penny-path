import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Expense } from '../expenses/expense.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7 }) // e.g. '2025-10'
  month: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category?: Category;

  @OneToMany(() => Expense, (expense) => expense.budget)
  expenses: Expense[];
}
