import { WorkflowContext, WorkflowEvent } from '../types';

export const logTransition = (context: WorkflowContext, event: WorkflowEvent) => {
  console.log(`Transitioning from ${context.previousState} to ${context.currentState}`);
  console.log(`Event type: ${event.type}`);
};

// Add more custom actions here
