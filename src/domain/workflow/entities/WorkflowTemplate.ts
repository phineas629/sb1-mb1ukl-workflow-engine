import { Entity } from '../../common/Entity';
import { z } from 'zod';
import { produce } from 'immer';

export const ActorSchema = z.object({
  src: z.string(),
  id: z.string().optional(),
});

export const ActionSchema = z.object({
  type: z.string(),
  exec: z.function().optional(),
});

export const GuardSchema = z.object({
  type: z.string(),
  predicate: z.function().optional(),
});

export const TransitionSchema = z.object({
  target: z.string().optional(),
  actions: z.array(z.union([z.string(), ActionSchema])).optional(),
  guard: z.union([z.string(), GuardSchema]).optional(),
});

export const WorkflowStateSchema = z.object({
  on: z.record(z.union([z.string(), TransitionSchema, z.array(TransitionSchema)])).optional(),
  invoke: z.union([ActorSchema, z.array(ActorSchema)]).optional(),
  entry: z.array(z.union([z.string(), ActionSchema])).optional(),
  exit: z.array(z.union([z.string(), ActionSchema])).optional(),
  after: z.record(TransitionSchema).optional(),
  type: z.enum(['atomic', 'compound', 'parallel', 'final']).optional(),
  initial: z.string().optional(),
  states: z.lazy(() => z.record(WorkflowStateSchema)).optional(),
});

export const WorkflowTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.number(),
  initialState: z.string(),
  context: z.record(z.unknown()),
  states: z.record(WorkflowStateSchema),
  actors: z.record(ActorSchema).optional(),
  guards: z.record(GuardSchema).optional(),
  actions: z.record(ActionSchema).optional(),
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
export type WorkflowTemplateData = z.infer<typeof WorkflowTemplateSchema>;

export class WorkflowTemplate extends Entity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly version: number,
    public readonly initialState: string,
    public readonly context: Record<string, unknown>,
    public readonly states: Record<string, WorkflowState>,
    public readonly actors?: Record<string, z.infer<typeof ActorSchema>>,
    public readonly guards?: Record<string, z.infer<typeof GuardSchema>>,
    public readonly actions?: Record<string, z.infer<typeof ActionSchema>>,
  ) {
    super(id);
  }

  static fromData(data: WorkflowTemplateData): WorkflowTemplate {
    const validatedData = WorkflowTemplateSchema.parse(data);
    return new WorkflowTemplate(
      validatedData.id,
      validatedData.name,
      validatedData.version,
      validatedData.initialState,
      validatedData.context,
      validatedData.states,
      validatedData.actors,
      validatedData.guards,
      validatedData.actions,
    );
  }

  toData(): WorkflowTemplateData {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      initialState: this.initialState,
      context: this.context,
      states: this.states,
      actors: this.actors,
      guards: this.guards,
      actions: this.actions,
    };
  }

  updateState(stateName: string, updater: (state: WorkflowState) => void): WorkflowTemplate {
    return produce(this, (draft) => {
      if (draft.states[stateName]) {
        updater(draft.states[stateName]);
      }
    });
  }

  addActor(id: string, actor: z.infer<typeof ActorSchema>): WorkflowTemplate {
    return produce(this, (draft) => {
      if (!draft.actors) draft.actors = {};
      draft.actors[id] = actor;
    });
  }

  addGuard(id: string, guard: z.infer<typeof GuardSchema>): WorkflowTemplate {
    return produce(this, (draft) => {
      if (!draft.guards) draft.guards = {};
      draft.guards[id] = guard;
    });
  }

  addAction(id: string, action: z.infer<typeof ActionSchema>): WorkflowTemplate {
    return produce(this, (draft) => {
      if (!draft.actions) draft.actions = {};
      draft.actions[id] = action;
    });
  }
}
