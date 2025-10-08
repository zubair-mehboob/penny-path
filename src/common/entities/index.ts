import { Budget } from '../../modules/budget/budget.entity';
import { Income } from '../../modules/income/income.entity';
import { Expense } from '../../modules/expenses/expense.entity';
import { Category } from '../../modules/categories/category.entity';
import { User } from '../../modules/users/user.entity';

export const entities = [User, Income, Budget, Expense, Category];
