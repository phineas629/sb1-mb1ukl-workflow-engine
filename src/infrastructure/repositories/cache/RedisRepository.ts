import { BaseRepository } from '../base/BaseRepository';
import Redis from 'ioredis';
import { z } from 'zod';

export class RedisRepository<T extends { id: string }> extends BaseRepository<T> {
  constructor(
    private client: Redis,
    private prefix: string,
  ) {
    super();
  }

  protected schema: z.ZodSchema<T>; // We'll implement this in specific repositories

  // ... (rest of the methods remain the same)
}
