import { AggregateRoot } from '../common/AggregateRoot';
import { createActor, AnyActorRef, AnyStateMachine, ActorOptions } from 'xstate';
import { WorkflowTemplate } from './entities/WorkflowTemplate';
import { WorkflowStepExecutedEvent } from './events/WorkflowStepExecutedEvent';
import { WorkflowContext, WorkflowEvent } from '../../application/types';

export class WorkflowAggregate extends AggregateRoot {
  private actor: AnyActorRef;

  constructor(
    public readonly id: string,
    private machine: AnyStateMachine,
    private actorOptions: ActorOptions<WorkflowContext, WorkflowEvent>,
  ) {
    super();
    this.actor = createActor(machine, actorOptions);
  }

  static create(template: WorkflowTemplate, machine: AnyStateMachine): WorkflowAggregate {
    const id = crypto.randomUUID();
    const options: ActorOptions<WorkflowContext, WorkflowEvent> = {
      id,
      input: { templateId: template.id },
    };
    return new WorkflowAggregate(id, machine, options);
  }

  start(): void {
    this.actor.start();
  }

  executeStep(event: WorkflowEvent): void {
    this.actor.send(event);
    const snapshot = this.actor.getSnapshot();
    this.addDomainEvent(
      new WorkflowStepExecutedEvent(this.id, event, snapshot.value, snapshot.context),
    );
  }

  getFullState(): { value: unknown; context: WorkflowContext } {
    const snapshot = this.actor.getSnapshot();
    return { value: snapshot.value, context: snapshot.context };
  }

  isDone(): boolean {
    return this.actor.getSnapshot().status === 'done';
  }

  subscribe(listener: (state: unknown) => void): () => void {
    return this.actor.subscribe(listener);
  }
}
