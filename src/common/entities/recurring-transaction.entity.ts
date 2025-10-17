import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class RecurringTransaction {
  @PrimaryGeneratedColumn()
  recurringTransactionId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @ManyToOne(() => Account, (account: Account) => account.recurringTransactions)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  recurrenceType: string; //(monthly/weekly/custom)

  @Column()
  makeTransactionOnThisDay: number; //24

  @Column()
  isActive: boolean;
}
