import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { verifyToken } from './utils/cognitoAuth';
import dotenv from 'dotenv';

dotenv.config();

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'workflow', url: process.env.WORKFLOW_SUBGRAPH_URL || 'http://localhost:4000/graphql' },
    {
      name: 'accounting',
      url: process.env.ACCOUNTING_SUBGRAPH_URL || 'http://localhost:4001/graphql',
    },
    { name: 'timetrex', url: process.env.TIMETREX_SUBGRAPH_URL || 'http://localhost:4002/graphql' },
    { name: 'medplum', url: process.env.MEDPLUM_SUBGRAPH_URL || 'http://localhost:4003/graphql' },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !(await verifyToken(token))) {
      throw new Error('Unauthorized');
    }
    return { headers: req.headers };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo Gateway ready at ${url}`);
});
