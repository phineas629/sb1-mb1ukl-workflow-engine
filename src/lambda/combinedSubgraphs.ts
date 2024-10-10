import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { container } from '../infrastructure/ioc/container';
import { verifyToken } from '../utils/cognitoAuth';
import { captureLambdaHandler } from '../utils/powertools';
import { schema } from '../infrastructure/graphql/schema';

const server = new ApolloServer({
  schema,
});

export const handler = captureLambdaHandler(
  startServerAndCreateLambdaHandler(server, handlers.createAPIGatewayProxyEventV2RequestHandler(), {
    context: async ({ event }) => {
      const token = event.headers.authorization?.split(' ')[1];
      if (!token || !(await verifyToken(token))) {
        throw new Error('Unauthorized');
      }
      return {
        ...container.getAll(),
        token,
      };
    },
  }),
);
