import { setup } from 'xstate';
import { WorkflowTemplate } from '../../domain/workflow/entities/WorkflowTemplate';
import * as customActors from '../actors/customActors';
import * as customGuards from '../guards/customGuards';
import * as customActions from '../actions/customActions';
import { WorkflowContext, WorkflowEvent } from '../types';

export class WorkflowStateMachineFactory {
  createStateMachine(template: WorkflowTemplate) {
    return setup({
      types: {
        context: {} as WorkflowContext,
        events: {} as WorkflowEvent,
        input: {} as { templateId: string },
      },
      actors: {
        ...customActors,
        ...template.actors,
      },
      guards: {
        ...customGuards,
        ...template.guards,
      },
      actions: {
        ...customActions,
        ...template.actions,
      },
    }).createMachine({
      // ... rest of the file remains unchanged
    });
  }
}
