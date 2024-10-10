import { ApolloServer } from '@infrastructure/adapters/graphql/ApolloServer';
import express from 'express';
import { buildSchema } from '@infrastructure/adapters/graphql/type-graphql';
import { container } from '../ioc/container';
import { TYPES } from '../../types';
import { WorkflowResolver } from '@infrastructure/adapters/graphql/resolvers/WorkflowResolver';

export async function startGraphQLServer() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [WorkflowResolver],
    container: {
      get: (someClass: Function) => {
        const serviceIdentifier = TYPES[someClass.name as keyof typeof TYPES] || someClass;
        return container.get(serviceIdentifier);
      },
    },
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }: { req: express.Request }) => {
      return { req };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });
}
