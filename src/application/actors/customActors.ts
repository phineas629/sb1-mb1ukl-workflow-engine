import { fromPromise } from 'xstate';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export const loadWorkflowActor = (workflowRepository: WorkflowRepository) =>
  fromPromise(async ({ input }: { input: { workflowId: string } }) => {
    const workflow = await workflowRepository.findById(input.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return workflow;
  });

// Add more custom actors here
