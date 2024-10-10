import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export abstract class DynamoDBRepository<T> {
  protected documentClient: DynamoDBDocumentClient;

  constructor(
    protected tableName: string,
    protected entityName: string,
    documentClient: DynamoDBDocumentClient,
  ) {
    this.documentClient = documentClient;
  }

  abstract create(item: T): Promise<T>;
  abstract getById(id: string): Promise<T | null>;
  abstract update(id: string, item: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract list(): Promise<T[]>;

  // Insert newline as per Prettier suggestion
}
