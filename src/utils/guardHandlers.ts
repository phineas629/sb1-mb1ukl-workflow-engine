import { WorkflowGuard } from '../domain/WorkflowDefinition';

type GuardHandler = (context: Record<string, unknown>, event: Record<string, unknown>) => boolean;

export const guardHandlers: Record<string, GuardHandler> = {
  isCounterEven: (context) => ((context.counter as number) || 0) % 2 === 0,
  isStatusActive: (context) => context.status === 'active',
  hasRequiredFields: (context, event) => {
    const requiredFields = (event.requiredFields as string[]) || [];
    return requiredFields.every((field: string) => context[field] !== undefined);
  },
};

export function evaluateGuard(
  guard: WorkflowGuard,
  context: Record<string, unknown>,
  event: Record<string, unknown>,
): boolean {
  const handler = guardHandlers[guard.type];
  if (handler) {
    return handler(context, event);
  }
  console.warn(`No handler found for guard type: ${guard.type}`);
  return true;
}
