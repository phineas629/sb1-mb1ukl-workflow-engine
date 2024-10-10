import { MedplumClient } from '@medplum/core';
import { BaseRepository } from '../base/BaseRepository';
import { Resource } from '@medplum/fhirtypes';
import { z } from 'zod';

export class MedplumRepository<T extends Resource> extends BaseRepository<T> {
  protected schema: z.ZodSchema<T>; // We'll use Medplum's built-in validation

  constructor(
    private client: MedplumClient,
    private resourceType: string,
  ) {
    super();
  }

  // ... (rest of the methods remain the same)
}
