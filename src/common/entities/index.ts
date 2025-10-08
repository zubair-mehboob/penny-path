import { Budget } from '../../modules/budgets/budget.entity';
import { Account } from '../../modules/accounts/account.entity';
import { Expense } from '../../modules/expenses/expense.entity';
import { Category } from '../../modules/categories/category.entity';
import { User } from '../../modules/users/user.entity';
import { SavingHistory } from '../../modules/saving-history/saving-history.entity';

export const entities = [
  User,
  Account,
  Budget,
  Expense,
  Category,
  SavingHistory,
];
