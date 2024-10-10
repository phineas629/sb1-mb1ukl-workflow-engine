import { DatabaseAdapter } from './DatabaseAdapter';
import { DynamoDBRepository } from '../repositories/DynamoDBRepository';
import { AWSClient } from '../AWSClient';
import { Table } from 'dynamodb-toolbox';

export class DynamoDBAdapter implements DatabaseAdapter {
  private tables: Map<string, Table> = new Map();

  constructor(private awsClient: AWSClient) {}

  getRepository<T extends { id: string }>(name: string): DynamoDBRepository<T> {
    let table = this.tables.get(name);
    if (!table) {
      table = this.awsClient.createTable(name, 'PK', 'SK');
      this.tables.set(name, table);
    }
    return new DynamoDBRepository<T>(table, name);
  }

  async connect(): Promise<void> {
    // DynamoDB doesn't require an explicit connection
  }

  async disconnect(): Promise<void> {
    // DynamoDB doesn't require an explicit disconnection
  }
}
