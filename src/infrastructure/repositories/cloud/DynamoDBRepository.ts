import { CloudStorageRepository } from './CloudStorageRepository';
import { Entity } from 'dynamodb-toolbox';

export abstract class DynamoDBRepository<
  T extends { id: string },
> extends CloudStorageRepository<T> {
  protected createEntity(entityName: string): Entity<T> {
    return new Entity({
      name: entityName,
      attributes: {
        PK: { partitionKey: true, default: (data: T) => this.generatePK(data) },
        SK: { sortKey: true, default: (data: T) => this.generateSK(data) },
        GSI1PK: { default: (data: T) => this.generateGSI1PK(data) },
        GSI1SK: { default: (data: T) => this.generateGSI1SK(data) },
        id: { type: 'string' },
        entityType: { type: 'string', default: entityName },
        createdAt: { type: 'string', default: () => new Date().toISOString() },
        updatedAt: { type: 'string', default: () => new Date().toISOString() },
        ...this.defineAttributes(),
      },
      table: this.table,
    } as Entity.EntityConfiguration<T>);
  }
}
