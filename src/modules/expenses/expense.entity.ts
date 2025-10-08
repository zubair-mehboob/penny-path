import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Budget } from '../budget/budget.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category?: Category;

  @ManyToOne(() => Expense, (expense) => expense.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Expense;

  @OneToMany(() => Expense, (expense) => expense.parent)
  children: Expense[];

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ nullable: true })
  note?: string;
  @ManyToOne(() => Budget, (budget) => budget.expenses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  budget?: Budget;
}
