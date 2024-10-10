import { z } from 'zod';
import { customAlphabet } from 'nanoid';

export const generateId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

export const commonFields = {
  GSI1PK: z.string(),
  GSI1SK: z.string(),
  EntityType: z.enum(['Workflow', 'WorkflowTemplate', 'User', 'Tenant']),
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  TTL: z.number().optional(),
};

// ... rest of the file
