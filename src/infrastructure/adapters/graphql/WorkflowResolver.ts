import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { CreateWorkflowInstanceUseCase } from '../../../application/usecases/CreateWorkflowInstanceUseCase';
import { ExecuteWorkflowStepUseCase } from '../../../application/usecases/ExecuteWorkflowStepUseCase';
import { WorkflowEvent } from '../../../domain/workflow/WorkflowEvent';
import { WorkflowRepository } from '../../../application/ports/WorkflowRepository';
import { WorkflowDTO } from './dto/WorkflowDTO';

@Resolver()
export class WorkflowResolver {
  constructor(
    private createWorkflowInstanceUseCase: CreateWorkflowInstanceUseCase,
    private executeWorkflowStepUseCase: ExecuteWorkflowStepUseCase,
    private workflowRepository: WorkflowRepository,
  ) {}

  @Mutation(() => String)
  async createWorkflowInstance(@Arg('templateId') templateId: string): Promise<string> {
    try {
      return await this.createWorkflowInstanceUseCase.execute(templateId);
    } catch (error) {
      console.error(`Error creating workflow instance: ${error}`);
      throw new Error('Failed to create workflow instance');
    }
  }

  @Mutation(() => Boolean)
  async executeWorkflowStep(
    @Arg('workflowId') workflowId: string,
    @Arg('event') event: WorkflowEvent,
  ): Promise<boolean> {
    try {
      await this.executeWorkflowStepUseCase.execute({ workflowId, event });
      return true;
    } catch (error) {
      console.error(`Error executing workflow step: ${error}`);
      throw new Error('Failed to execute workflow step');
    }
  }

  @Query(() => WorkflowDTO, { nullable: true })
  async getWorkflow(@Arg('id') id: string): Promise<WorkflowDTO | null> {
    try {
      const workflow = await this.workflowRepository.findById(id);
      if (!workflow) {
        return null;
      }
      const { value: currentState, context } = workflow.getFullState();
      return {
        id: workflow.id,
        currentState,
        context: JSON.stringify(context),
      };
    } catch (error) {
      console.error(`Error fetching workflow: ${error}`);
      throw new Error('Failed to fetch workflow');
    }
  }

  @Query(() => [WorkflowDTO])
  async getAllWorkflows(): Promise<WorkflowDTO[]> {
    try {
      const workflows = await this.workflowRepository.findAll();
      return workflows.map((workflow) => {
        const { value: currentState, context } = workflow.getFullState();
        return {
          id: workflow.id,
          currentState,
          context: JSON.stringify(context),
        };
      });
    } catch (error) {
      console.error(`Error fetching all workflows: ${error}`);
      throw new Error('Failed to fetch workflows');
    }
  }
}
