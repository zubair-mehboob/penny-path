import { Account } from './account.entity';
import { RecurringTransaction } from './recurring-transaction.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';
import { AccountSetting } from './account_settings';

export const entities = [
  User,
  Account,
  Transaction,
  RecurringTransaction,
  AccountSetting,
];
