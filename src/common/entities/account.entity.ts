import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  openingBalance: number;

  @Column({ type: 'decimal', default: 0, precision: 10, scale: 2 })
  closingBalance: number;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
