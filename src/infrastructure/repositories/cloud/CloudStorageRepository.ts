import { BaseRepository } from '../base/BaseRepository';
import { Entity } from 'dynamodb-toolbox';

export abstract class CloudStorageRepository<T extends { id: string }> extends BaseRepository<T> {
  protected entity: Entity<T>;

  constructor(
    protected table: unknown,
    entityName: string,
  ) {
    super();
    this.entity = this.createEntity(entityName);
  }

  protected abstract createEntity(entityName: string): Entity<T>;
  protected abstract defineAttributes(): Record<string, unknown>;
  protected abstract generatePK(data: T): string;
  protected abstract generateSK(data: T): string;
  protected abstract generateGSI1PK(data: T): string;
  protected abstract generateGSI1SK(data: T): string;

  // ... (rest of the methods remain the same)
}
