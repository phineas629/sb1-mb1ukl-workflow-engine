import { injectable } from 'inversify';
import { nanoid } from 'nanoid';
import { AWSClient } from '../../infrastructure/AWSClient';
import { Entity } from 'dynamodb-toolbox';

interface AccountAttributes {
  id: string;
  name: string;
  balance: number;
}

@injectable()
export class AccountService {
  private accountEntity: Entity<AccountAttributes>;

  constructor() {
    const awsClient = AWSClient.getInstance();
    const table = awsClient.createTable('Accounts', 'PK', 'SK');
    this.accountEntity = new Entity({
      name: 'Account',
      attributes: {
        id: { partitionKey: true, prefix: 'ACCOUNT#' },
        SK: { sortKey: true, default: (data: AccountAttributes) => data.id },
        name: { type: 'string', required: true },
        balance: { type: 'number', required: true },
      },
      table,
    } as Entity.EntityConfiguration<AccountAttributes>);
  }

  async getAccount(id: string) {
    const result = await this.accountEntity.get({ id });
    return result.Item;
  }

  async createAccount(name: string, initialBalance: number) {
    const id = nanoid();
    const account = {
      id,
      name,
      balance: initialBalance,
    };
    await this.accountEntity.put(account);
    return account;
  }

  async updateBalance(id: string, amount: number) {
    const result = await this.accountEntity.update(
      {
        id,
        balance: { $add: amount },
      },
      { returnValues: 'ALL_NEW' },
    );
    return result.Attributes;
  }
}
