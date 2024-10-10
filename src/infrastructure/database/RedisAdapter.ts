import { DatabaseAdapter } from './DatabaseAdapter';
import Redis from 'ioredis';
import { BaseRepository } from '../repositories/BaseRepository';
import { RedisRepository } from '../repositories/RedisRepository';

export class RedisAdapter implements DatabaseAdapter {
  private client: Redis;

  constructor(connectionString: string) {
    this.client = new Redis(connectionString);
  }

  getRepository<T extends { id: string }>(name: string): BaseRepository<T> {
    return new RedisRepository<T>(this.client, name);
  }

  async connect(): Promise<void> {
    // Redis client automatically connects when created
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
