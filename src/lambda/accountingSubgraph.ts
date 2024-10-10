import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { Container } from 'inversify';
import { typeDefs } from '../subgraphs/accounting/schema';
import { resolvers } from '../subgraphs/accounting/resolvers';
import { AccountService } from '../subgraphs/accounting/AccountService';
import { TransactionService } from '../subgraphs/accounting/TransactionService';
import { verifyToken } from '../utils/cognitoAuth';
import { captureLambdaHandler } from '../utils/powertools';

const container = new Container();
container.bind(AccountService).toSelf();
container.bind(TransactionService).toSelf();

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
        accountService: container.get(AccountService),
        transactionService: container.get(TransactionService),
      };
    },
  }),
);
