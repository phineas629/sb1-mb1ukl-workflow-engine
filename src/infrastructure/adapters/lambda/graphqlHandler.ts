import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema } from 'type-graphql';
import { WorkflowResolver } from '../graphql/WorkflowResolver';
import { container } from '../../ioc/container';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

let server: ApolloServer;

async function createServer() {
  const schema = await buildSchema({
    resolvers: [WorkflowResolver],
    container: { get: (cls) => container.resolve(cls) },
    validate: false, // Disable class-validator
  });

  return new ApolloServer({
    schema,
    context: ({ event, context }: { event: APIGatewayProxyEvent; context: Context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
  });
}

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  if (!server) {
    server = await createServer();
  }

  const handler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  return new Promise((resolve, reject) => {
    const callback = (error: Error | null, body: unknown) =>
      error ? reject(error) : resolve(body);
    handler(event, context, callback);
  });
};
