import { inject, injectable } from 'inversify';
import { WorkflowInstance } from '../domain/WorkflowInstance';
import { WorkflowDefinition } from '../domain/WorkflowDefinition';
import { DatabaseAdapter } from '../infrastructure/database/DatabaseAdapter';
import { WorkflowEngine } from './WorkflowEngine';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class WorkflowService {
  private repository: DatabaseAdapter<WorkflowInstance>;

  constructor(
    @inject(DatabaseAdapter) private dbAdapter: DatabaseAdapter,
    @inject(WorkflowEngine) private engine: WorkflowEngine,
  ) {
    this.repository = this.dbAdapter.getRepository<WorkflowInstance>('Workflows');
  }

  async createWorkflowDefinition(definition: WorkflowDefinition): Promise<WorkflowDefinition> {
    return this.repository.create(definition);
  }

  async createWorkflowInstance(definitionId: string): Promise<WorkflowInstance> {
    const definition = (await this.repository.getById(definitionId)) as WorkflowDefinition;
    if (!definition) {
      throw new Error(`Workflow definition not found for id ${definitionId}`);
    }
    const instance: WorkflowInstance = {
      id: uuidv4(),
      definitionId: definition.id,
      currentState: definition.initialState,
      context: definition.context,
      history: [definition.initialState],
    };
    await this.repository.create(instance);
    this.engine.createWorkflowActor(instance, definition);
    return instance;
  }

  // ... rest of the methods
}
