import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/common/entities/transaction.entity';
import { TreeRepository } from 'typeorm';
import {
  CreateTransactionDTO,
  UpdateChildTransactionDTO,
  UpdateTransactionDTO,
} from 'src/common/dtos/request/transaction.dto';
import { Account } from 'src/common/entities/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TreeRepository<Transaction>,
    private readonly accountService: AccountService,
  ) {}

  // ✅ Create an Transaction (supports nested/child Transactions)
  async create(dto: CreateTransactionDTO) {
    const account = await this.accountService.findOneById(dto.accountId);
    if (!account) throw new BadRequestException('Account not found');
    try {
      await this.transactionRepository.save({
        ...dto,
        account: { accountId: dto.accountId },
      });

      return 'Transaction create successfully';
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  // ✅ Get all Transactions by account (with children)
  async getTransactionsByAccount(accountId: number) {
    const roots = await this.transactionRepository.find({
      where: {
        account: { accountId },
      },
    });
    const trees = await Promise.all(
      roots.map((root) => this.transactionRepository.findDescendantsTree(root)),
    );

    return trees;
  }

  // ✅ Get single Transaction (with children)
  async getTransactionById(transactionId: number) {
    const root = await this.transactionRepository.findOneBy({ transactionId });

    return await this.transactionRepository.findDescendantsTree(root);
  }

  // // ✅ Update expense
  async updateTransaction(
    transactionId: number,
    payload: UpdateTransactionDTO,
  ) {
    /**
     * Cas 1: Transaction = Parent Transaction
     * This is the case if the transaction is itself a parent
     * if a transaction has children then the updated amount cannot be less then the sum of all children amount
     */
    const transaction = await this.getTransactionById(transactionId);
    const { spend, left, total } = this.amountBreakDown(transaction);
    const isParent = transaction.children.length > 1;
    if (isParent && payload.amount < spend) {
      throw new BadRequestException(
        `Children transactions have total sum of ${spend}, updated amount must be greater than or equal to ${spend}`,
      );
    }
    // Case 1 end
    /**
     * Case 2: Transaction = Child Transaction
     * This is the case if the transaction is itself a child of some transaction
     * if updating new child check first how much amount other childs have used only left amount can be used
      in our app child transaction can only have a single parent that is why use find instead of filter 
    */
    let parent = (
      await this.transactionRepository.findAncestors(transaction)
    ).find((item) => item.transactionId !== transactionId);
    parent = await this.getTransactionById(parent.transactionId);
    let childrenExceptThisTransaction = parent.children.filter(
      (item) => item.transactionId !== transactionId,
    );
    parent.children = childrenExceptThisTransaction;
    const parentAmountBreakDown = this.amountBreakDown(parent);
    if (payload.amount > parentAmountBreakDown.left)
      throw new BadRequestException(
        `children amount ${payload.amount}, exceeds the limit, total parent amount is ${parentAmountBreakDown.total}, other children has used ${parentAmountBreakDown.spend}`,
      );
    // case 2 end
    const res = await this.transactionRepository
      .createQueryBuilder()
      .update(Transaction)
      .set(payload)
      .where('transactionId = :transactionId', { transactionId })
      .execute();

    return res;
  }

  // ✅ Delete Transaction
  async deleteTransaction(expenseId: number): Promise<void> {}

  // ✅ Add a child expense
  async addChildTransaction(payload: UpdateChildTransactionDTO) {
    const parent = await this.getTransactionById(payload.parentId);
    if (!parent) throw new BadRequestException('expense not found');
    const { spend, left, total } = this.amountBreakDown(parent);
    if (payload.amount > left) {
      throw new BadRequestException(
        `children amount ${payload.amount}, exceeds the limit, total amount is ${total}, other children has used ${spend}`,
      );
    }
    payload.parent = parent;
    return await this.transactionRepository.save({ ...payload });
  }

  // // ✅ Optional — Get total spent under an expense (sum of child expenses)
  // async getExpenseTotal(expenseId: number): Promise<number> {
  //   return 1
  // }

  private amountBreakDown(parent: Transaction): {
    spend: number;
    left: number;
    total: number;
  } {
    const spend = parent.children.reduce((prev, curr) => {
      return prev + curr.amount;
    }, 0);
    const left = parent.amount - spend;

    return { spend, left, total: parent.amount };
  }
}
