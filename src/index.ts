import { startGraphQLServer } from './infrastructure/graphql/GraphQLAPI';
import { container } from './infrastructure/ioc/container';
import { TYPES } from './types';

console.log('Starting application...');
console.log('Node.js version:', process.version);
console.log(
  'ES modules enabled:',
  process.env.NODE_OPTIONS?.includes('--experimental-modules') || false,
);

try {
  console.log('Initializing container...');
  // Log all bindings in the container
  const bindings = Object.values(TYPES).map((type) => {
    try {
      return `${String(type)}: ${container.isBound(type) ? 'Bound' : 'Not bound'}`;
    } catch (error) {
      return `${String(type)}: Error checking binding`;
    }
  });
  console.log('Container bindings:', bindings);

  console.log('Starting GraphQL server...');
  startGraphQLServer().catch((error: unknown) => {
    console.error('Failed to start GraphQL server:', error);
    process.exit(1);
  });
} catch (error: unknown) {
  console.error('Error during application startup:', error);
  process.exit(1);
}
