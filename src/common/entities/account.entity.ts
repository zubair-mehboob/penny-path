import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { RecurringTransaction } from './recurring-transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column()
  title: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  balance: number;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.account,
  )
  transactions: Transaction[];

  @OneToMany(
    () => RecurringTransaction,
    (recurringTransaction: RecurringTransaction) =>
      recurringTransaction.account,
  )
  recurringTransactions: RecurringTransaction[];
}
