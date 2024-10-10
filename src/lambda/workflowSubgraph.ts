import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { container } from '../infrastructure/ioc/container';
import { WorkflowService } from '../application/WorkflowService';
import { CopService } from '../application/CopService';
import { verifyToken } from '../utils/cognitoAuth';
import { captureLambdaHandler } from '../utils/powertools';

// Define your schema and resolvers here
const typeDefs = gql`
  // Your schema definition
`;

const resolvers = {
  // Your resolvers
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

export const handler = captureLambdaHandler(
  startServerAndCreateLambdaHandler(server, handlers.createAPIGatewayProxyEventV2RequestHandler(), {
    context: async ({ event }) => {
      const token = event.headers.authorization?.split(' ')[1];
      if (!token || !(await verifyToken(token))) {
        throw new Error('Unauthorized');
      }
      return {
        workflowService: container.get(WorkflowService),
        copService: container.get(CopService),
      };
    },
  }),
);
