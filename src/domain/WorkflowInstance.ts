import { z } from 'zod';

export const WorkflowInstanceSchema = z.object({
  id: z.string(),
  definitionId: z.string(),
  currentState: z.string(),
  context: z.record(z.unknown()),
  history: z.array(z.string()),
});

export type WorkflowInstance = z.infer<typeof WorkflowInstanceSchema>;
