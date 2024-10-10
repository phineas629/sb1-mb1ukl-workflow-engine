import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  type Account {
    id: ID!
    name: String!
    balance: Float!
  }

  # Add more type definitions as needed

  extend type Query {
    getAccount(id: ID!): Account
  }

  extend type Mutation {
    createAccount(name: String!, initialBalance: Float!): Account
  }
`;

export const resolvers = {
  Query: {
    getAccount: (_, { id }, { accountService }) => accountService.getAccount(id),
  },
  Mutation: {
    createAccount: (_, { name, initialBalance }, { accountService }) =>
      accountService.createAccount(name, initialBalance),
  },
};
