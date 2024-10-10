import { fromPromise } from 'xstate';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { WorkflowEvent } from '../../domain/workflow/WorkflowEvent';

export const loadWorkflowInstanceStepTransitionLogic = (workflowRepository: WorkflowRepository) =>
  fromPromise(
    async ({
      input,
    }: {
      input: { workflowId: string; currentState: string; event: WorkflowEvent };
    }) => {
      const { workflowId, event } = input;
      const workflow = await workflowRepository.findById(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }
      try {
        workflow.executeStep(event);
        await workflowRepository.save(workflow);
        const { value: nextState, context: data } = workflow.getFullState();
        return { nextState, data };
      } catch (error) {
        console.error(`Error executing workflow step: ${error}`);
        throw new Error('Failed to execute workflow step');
      }
    },
  );
