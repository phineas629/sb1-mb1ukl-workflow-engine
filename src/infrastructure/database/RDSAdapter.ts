import { DatabaseAdapter } from './DatabaseAdapter';
import { RDSRepository } from '../repositories/RDSRepository';
import { Pool } from 'pg';

export class RDSAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  getRepository<T extends { id: string }>(name: string): RDSRepository<T> {
    return new RDSRepository<T>(this.pool, name);
  }

  async connect(): Promise<void> {
    await this.pool.connect();
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}
