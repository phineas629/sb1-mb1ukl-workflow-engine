import { WorkflowAction } from '../domain/WorkflowDefinition';

type ActionHandler = (
  context: Record<string, unknown>,
  event: Record<string, unknown>,
) => Record<string, unknown>;

export const actionHandlers: Record<string, ActionHandler> = {
  incrementCounter: (context, event) => ({
    ...context,
    counter: ((context.counter as number) || 0) + 1,
    lastEvent: event.type,
  }),
  setStatus: (context, event) => ({
    ...context,
    status: event.status,
    lastEvent: event.type,
  }),
  logEvent: (context, event) => {
    console.log(`Event logged: ${event.type}`);
    return { ...context, lastLoggedEvent: event.type };
  },
};

export function executeAction(
  action: WorkflowAction,
  context: Record<string, unknown>,
  event: Record<string, unknown>,
): Record<string, unknown> {
  const handler = actionHandlers[action.type];
  if (handler) {
    return handler(context, { ...event, ...action.payload });
  }
  console.warn(`No handler found for action type: ${action.type}`);
  return context;
}
