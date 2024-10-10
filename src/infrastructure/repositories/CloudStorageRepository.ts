import { BaseRepository } from './BaseRepository';
import { resilientPolicy } from '../../utils/resilience';
import logger from '../../utils/logger';
import { nanoid } from 'nanoid';
import { Entity } from 'dynamodb-toolbox';

export abstract class CloudStorageRepository<T extends { id: string }> extends BaseRepository<T> {
  protected entity: Entity<T & { PK: string; SK: string }, string, string>;

  constructor(
    protected table: unknown,
    entityName: string,
  ) {
    super();
    this.entity = this.createEntity(entityName);
  }

  protected abstract createEntity(entityName: string): Entity<T & { PK: string; SK: string }>;
  protected abstract defineAttributes(): Record<string, unknown>;
  protected abstract generatePK(data: T): string;
  protected abstract generateSK(data: T): string;
  protected abstract generateGSI1PK(data: T): string;
  protected abstract generateGSI1SK(data: T): string;

  async create(item: Omit<T, 'id'>): Promise<T> {
    const id = nanoid();
    const validatedItem = this.validate({ ...item, id } as T);
    await resilientPolicy.execute(async () => {
      await this.entity.put(validatedItem);
      logger.info({ id }, `Item created in ${this.entity.name}`);
    });
    return validatedItem;
  }

  // ... rest of the methods
}
