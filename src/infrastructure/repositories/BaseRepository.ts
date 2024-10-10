import { z } from 'zod';

export abstract class BaseRepository<T extends { id: string }> {
  protected abstract schema: z.ZodSchema<T>;

  abstract create(item: T): Promise<T>;
  abstract getById(id: string): Promise<T | null>;
  abstract update(id: string, item: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract list(filter?: Partial<T>): Promise<T[]>;

  protected validate(item: T): T {
    return this.schema.parse(item);
  }
}
