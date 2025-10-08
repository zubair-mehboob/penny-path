// src/accounts/account.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budgets/budget.entity';
import { SavingHistory } from '../saving-history/saving-history.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., Salary, Freelance, Business

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'int', default: 1 })
  cycleStartDay: number; // e.g., 24th

  @Column({ type: 'int', nullable: true })
  cycleEndDay: number;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Expense, (expense) => expense.account)
  expenses: Expense[];

  @OneToMany(() => Budget, (budget) => budget.account)
  budgets: Budget[];

  @OneToMany(() => SavingHistory, (saving) => saving.account)
  savingHistory: SavingHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDefault: boolean;
}
