import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Account, (account: Account) => account.user)
  accounts: Account[];
}
