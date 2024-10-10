import { injectable, inject } from 'inversify';
import { createActor, createMachine, assign, ActorRefFrom, AnyActorLogic } from 'xstate';
import { WorkflowInstance } from '../domain/WorkflowInstance';
import { WorkflowDefinition, WorkflowAction, WorkflowGuard } from '../domain/WorkflowDefinition';
import { CopService } from './CopService';
import logger from '../utils/logger';
import { evaluateGuard } from '../utils/guardHandlers';
import { executeAction } from '../utils/actionHandlers';

type WorkflowEvent = { type: string; [key: string]: unknown };

@injectable()
export class WorkflowEngine {
  private actors: Map<string, ActorRefFrom<AnyActorLogic>> = new Map();

  constructor(@inject(CopService) private copService: CopService) {}

  createWorkflowActor(
    instance: WorkflowInstance,
    definition: WorkflowDefinition,
  ): ActorRefFrom<AnyActorLogic> {
    const machine = this.createXStateMachine(definition);
    const actor = createActor(machine, {
      id: instance.id,
      context: instance.context,
    });
    this.actors.set(instance.id, actor);
    return actor;
  }

  executeStep(instanceId: string, event: WorkflowEvent): WorkflowInstance {
    const actor = this.actors.get(instanceId);
    if (!actor) {
      throw new Error(`No actor found for instance ${instanceId}`);
    }

    actor.send(event);
    const snapshot = actor.getSnapshot();

    const updatedInstance: WorkflowInstance = {
      id: instanceId,
      definitionId: snapshot.context.definitionId,
      currentState: this.getStateValue(snapshot.value),
      context: this.copService.enforceRules(snapshot.context),
      history: [...snapshot.context.history, this.getStateValue(snapshot.value)],
    };

    logger.info({ instanceId, event: event.type }, 'Executed workflow step');
    return updatedInstance;
  }

  private createXStateMachine(definition: WorkflowDefinition) {
    return createMachine(
      {
        id: definition.id,
        initial: definition.initialState,
        context: {
          ...definition.context,
          definitionId: definition.id,
          history: [],
        },
        states: this.convertStates(definition.states),
      },
      {
        actions: {
          executeAction: assign((context, event, { action }) => {
            return executeAction(action as WorkflowAction, context, event);
          }),
        },
        guards: {
          evaluateGuard: (context, event, { guard }) => {
            return evaluateGuard(guard as WorkflowGuard, context, event);
          },
        },
      },
    );
  }

  private convertStates(states: Record<string, WorkflowDefinition['states'][string]>) {
    const convertedStates: Record<string, unknown> = {};
    for (const [key, state] of Object.entries(states)) {
      convertedStates[key] = this.convertState(state);
    }
    return convertedStates;
  }

  private convertState(state: WorkflowDefinition['states'][string]) {
    const convertedState: Record<string, unknown> = {
      on: this.convertTransitions(state.on),
    };

    if (state.entry) {
      convertedState.entry = state.entry.map((action) => ({ type: 'executeAction', action }));
    }

    if (state.exit) {
      convertedState.exit = state.exit.map((action) => ({ type: 'executeAction', action }));
    }

    if (state.type === 'compound' && state.states) {
      convertedState.initial = state.initial;
      convertedState.states = this.convertStates(state.states);
    }

    return convertedState;
  }

  private convertTransitions(transitions: WorkflowDefinition['states'][string]['on']) {
    const convertedTransitions: Record<string, unknown> = {};
    for (const [event, transition] of Object.entries(transitions)) {
      convertedTransitions[event] = {
        target: transition.target,
        actions: transition.actions?.map((action) => ({ type: 'executeAction', action })),
        guard: transition.guards
          ? { type: 'evaluateGuard', guard: transition.guards[0] }
          : undefined,
      };
    }
    return convertedTransitions;
  }

  private getStateValue(value: string | Record<string, unknown>): string {
    return typeof value === 'string' ? value : JSON.stringify(value);
  }
}
