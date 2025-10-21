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
@Tree('closure-table')
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @ManyToOne(() => Account, (account: Account) => account.transactions)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @TreeChildren()
  children: Transaction[];

  @TreeParent()
  parent: Transaction;
}
