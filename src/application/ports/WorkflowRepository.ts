import { WorkflowAggregate } from '../../domain/workflow/WorkflowAggregate';

export interface WorkflowRepository {
  save(workflow: WorkflowAggregate): Promise<void>;
  findById(id: string): Promise<WorkflowAggregate | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<WorkflowAggregate[]>;
}
