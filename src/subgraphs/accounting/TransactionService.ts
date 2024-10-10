import { injectable, inject } from 'inversify';
import { nanoid } from 'nanoid';
import { AWSClient } from '../../infrastructure/AWSClient';
import { AccountService } from './AccountService';
import { Entity } from 'dynamodb-toolbox';

interface TransactionAttributes {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  timestamp: string;
}

@injectable()
export class TransactionService {
  private transactionEntity: Entity<TransactionAttributes>;

  constructor(@inject(AccountService) private accountService: AccountService) {
    const awsClient = AWSClient.getInstance();
    const table = awsClient.createTable('Transactions', 'PK', 'SK');
    this.transactionEntity = new Entity({
      name: 'Transaction',
      attributes: {
        id: { partitionKey: true, prefix: 'TRANSACTION#' },
        SK: { sortKey: true, default: (data: TransactionAttributes) => data.timestamp },
        accountId: { type: 'string', required: true },
        amount: { type: 'number', required: true },
        description: { type: 'string', required: true },
        timestamp: { type: 'string', required: true },
      },
      table,
    } as Entity.EntityConfiguration<TransactionAttributes>);
  }

  async getTransactions(accountId: string) {
    const result = await this.transactionEntity.query(`TRANSACTION#${accountId}`, {
      beginsWith: accountId,
    });
    return result.Items;
  }

  async createTransaction(accountId: string, amount: number, description: string) {
    const id = nanoid();
    const transaction = {
      id,
      accountId,
      amount,
      description,
      timestamp: new Date().toISOString(),
    };
    await this.transactionEntity.put(transaction);
    await this.accountService.updateBalance(accountId, amount);
    return transaction;
  }
}
