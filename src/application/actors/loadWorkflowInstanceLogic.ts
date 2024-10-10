import { fromPromise } from 'xstate';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export const loadWorkflowInstanceLogic = (workflowRepository: WorkflowRepository) =>
  fromPromise(async ({ input }: { input: { templateId: string } }) => {
    const workflowInstance = await workflowRepository.findById(input.templateId);
    if (!workflowInstance) {
      throw new Error('Workflow instance not found');
    }
    return {
      id: workflowInstance.id,
      data: workflowInstance.getContext(),
    };
  });
