import { WorkflowContext, WorkflowEvent } from '../types';

export const isWorkflowActive = (
  context: WorkflowContext,
  event: WorkflowEvent,
  cond: unknown,
): boolean => {
  console.log(`Checking if workflow is active. Event: ${event.type}, Condition:`, cond);
  return context.status === 'active';
};

// Add more custom guards here
