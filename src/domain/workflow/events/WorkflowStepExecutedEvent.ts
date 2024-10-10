import { DomainEvent } from '../../common/DomainEvent';
import { WorkflowEvent, WorkflowContext } from '../../../application/types';

export class WorkflowStepExecutedEvent implements DomainEvent {
  constructor(
    public readonly workflowId: string,
    public readonly event: WorkflowEvent,
    public readonly newState: unknown,
    public readonly context: WorkflowContext,
  ) {}
}
