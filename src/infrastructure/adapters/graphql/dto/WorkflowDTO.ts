import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class WorkflowDTO {
  @Field(() => ID)
  id!: string;

  @Field()
  currentState!: string;

  @Field(() => String)
  context!: string;
}
