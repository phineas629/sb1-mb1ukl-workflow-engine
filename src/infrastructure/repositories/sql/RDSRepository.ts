import { BaseRepository } from '../base/BaseRepository';
import { Pool } from 'pg';
import { z } from 'zod';

export class RDSRepository<T extends { id: string }> extends BaseRepository<T> {
  constructor(
    private pool: Pool,
    private tableName: string,
  ) {
    super();
  }

  protected schema: z.ZodSchema<T>; // We'll implement this in specific repositories

  // ... (rest of the methods remain the same)
}
