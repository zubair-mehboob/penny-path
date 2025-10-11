import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Expense } from './expense.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column()
  title: string;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  openingBalance: number;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  closingBalance: number;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Expense, (expense: Expense) => expense.account)
  expenses: Expense[];
}
