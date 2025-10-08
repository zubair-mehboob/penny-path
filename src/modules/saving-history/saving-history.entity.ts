// src/savings/saving-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity('saving_history')
export class SavingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.savingHistory, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @Column({ type: 'varchar', length: 7 }) // YYYY-MM
  month: string;

  @Column('decimal', { precision: 10, scale: 2 })
  savedAmount: number;

  @CreateDateColumn()
  calculatedAt: Date;
}
