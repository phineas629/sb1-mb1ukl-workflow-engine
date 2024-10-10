import { z } from 'zod';

export const WorkflowActionSchema = z.object({
  type: z.string(),
  payload: z.record(z.unknown()).optional(),
});

export const WorkflowGuardSchema = z.object({
  type: z.string(),
});

export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['atomic', 'compound', 'parallel']),
  initial: z.string().optional(),
  states: z.record(z.lazy(() => WorkflowStepSchema)).optional(),
  on: z.record(
    z.object({
      target: z.string().or(z.array(z.string())),
      actions: z.array(WorkflowActionSchema).optional(),
      guards: z.array(WorkflowGuardSchema).optional(),
    }),
  ),
  entry: z.array(WorkflowActionSchema).optional(),
  exit: z.array(WorkflowActionSchema).optional(),
});

export const WorkflowDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  initialState: z.string(),
  context: z.record(z.unknown()),
  states: z.record(WorkflowStepSchema),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export type WorkflowAction = z.infer<typeof WorkflowActionSchema>;
export type WorkflowGuard = z.infer<typeof WorkflowGuardSchema>;
