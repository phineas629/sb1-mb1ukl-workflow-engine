import { z } from 'zod';

export const WorkflowStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentState: z.string(),
  context: z.record(z.unknown()),
  history: z.array(z.string()),
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
