import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  type WorkflowState {
    id: ID!
    name: String!
    currentState: String!
    context: JSON!
    history: [String!]!
  }

  # Add more type definitions as needed

  extend type Query {
    getWorkflowState(id: ID!): WorkflowState
  }

  extend type Mutation {
    executeWorkflowStep(id: ID!, event: String!): WorkflowState
  }

  scalar JSON
`;

export const resolvers = {
  Query: {
    getWorkflowState: (_, { id }, { workflowService }) => workflowService.getWorkflowState(id),
  },
  Mutation: {
    executeWorkflowStep: (_, { id, event }, { workflowService }) =>
      workflowService.executeWorkflowStep(id, event),
  },
};
