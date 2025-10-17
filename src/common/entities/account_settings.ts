import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountSetting {
  @PrimaryGeneratedColumn()
  accountSettingId: number;

  @Column() //e.g. 24 (when the cycle resets)
  monthlyCycleDay: number;

  @Column({ default: false }) //If true → adds previous month’s remaining amount to new month
  carryOverPreviousBalance: boolean;

  @Column() //fixed monthly income
  autoDepositAmount: number;

  @Column()
  autoDepositEnabled: boolean;
}
