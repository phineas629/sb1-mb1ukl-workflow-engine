import { buildSubgraphSchema } from '@apollo/subgraph';
import * as workflowSubgraph from '../../subgraphs/workflow';
import * as accountingSubgraph from '../../subgraphs/accounting';
import * as timetrexSubgraph from '../../subgraphs/timetrex';
import * as medplumSubgraph from '../../subgraphs/medplum';

export const schema = buildSubgraphSchema([
  { typeDefs: workflowSubgraph.typeDefs, resolvers: workflowSubgraph.resolvers },
  { typeDefs: accountingSubgraph.typeDefs, resolvers: accountingSubgraph.resolvers },
  { typeDefs: timetrexSubgraph.typeDefs, resolvers: timetrexSubgraph.resolvers },
  { typeDefs: medplumSubgraph.typeDefs, resolvers: medplumSubgraph.resolvers },
]);
