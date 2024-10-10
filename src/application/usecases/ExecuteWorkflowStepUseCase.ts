import { UseCase } from '../common/UseCase';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { WorkflowEvent } from '../../domain/workflow/WorkflowEvent';

export class ExecuteWorkflowStepUseCase
  implements UseCase<{ workflowId: string; event: WorkflowEvent }, void>
{
  constructor(private workflowRepository: WorkflowRepository) {}

  async execute({
    workflowId,
    event,
  }: {
    workflowId: string;
    event: WorkflowEvent;
  }): Promise<void> {
    const workflow = await this.workflowRepository.findById(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    workflow.executeStep(event);

    await this.workflowRepository.save(workflow);
  }
}
