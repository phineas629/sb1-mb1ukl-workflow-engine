import { AccountService } from './AccountService';
import { TransactionService } from './TransactionService';

export const resolvers = {
  Query: {
    getAccount: (_, { id }, { accountService }: { accountService: AccountService }) =>
      accountService.getAccount(id),
    getTransactions: (
      _,
      { accountId },
      { transactionService }: { transactionService: TransactionService },
    ) => transactionService.getTransactions(accountId),
  },
  Mutation: {
    createAccount: (
      _,
      { name, initialBalance },
      { accountService }: { accountService: AccountService },
    ) => accountService.createAccount(name, initialBalance),
    createTransaction: (
      _,
      { accountId, amount, description },
      { transactionService }: { transactionService: TransactionService },
    ) => transactionService.createTransaction(accountId, amount, description),
  },
  Transaction: {
    account: (transaction, _, { accountService }: { accountService: AccountService }) =>
      accountService.getAccount(transaction.accountId),
  },
};
