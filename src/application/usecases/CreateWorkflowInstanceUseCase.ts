import { UseCase } from '../common/UseCase';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { WorkflowTemplateRepository } from '../ports/WorkflowTemplateRepository';
import { WorkflowStateMachineFactory } from '../factories/WorkflowStateMachineFactory';
import { WorkflowAggregate } from '../../domain/workflow/WorkflowAggregate';

export class CreateWorkflowInstanceUseCase implements UseCase<string, string> {
  constructor(
    private workflowRepository: WorkflowRepository,
    private workflowTemplateRepository: WorkflowTemplateRepository,
    private workflowStateMachineFactory: WorkflowStateMachineFactory,
  ) {}

  async execute(templateId: string): Promise<string> {
    const template = await this.workflowTemplateRepository.findById(templateId);
    if (!template) {
      throw new Error(`Workflow template not found: ${templateId}`);
    }

    const machine = this.workflowStateMachineFactory.createStateMachine(template);
    const workflowAggregate = WorkflowAggregate.create(template, machine);

    workflowAggregate.subscribe((state) => {
      console.log(`Workflow ${workflowAggregate.id} state:`, state.value);
      console.log(`Workflow ${workflowAggregate.id} context:`, state.context);
    });

    try {
      workflowAggregate.start();
      await this.workflowRepository.save(workflowAggregate);
      return workflowAggregate.id;
    } catch (error) {
      console.error(`Error creating workflow instance: ${error}`);
      throw new Error('Failed to create workflow instance');
    }
  }
}
