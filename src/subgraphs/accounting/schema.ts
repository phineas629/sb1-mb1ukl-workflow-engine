import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Account @key(fields: "id") {
    id: ID!
    name: String!
    balance: Float!
  }

  type Transaction @key(fields: "id") {
    id: ID!
    amount: Float!
    description: String!
    accountId: ID!
    account: Account!
  }

  extend type Query {
    getAccount(id: ID!): Account
    getTransactions(accountId: ID!): [Transaction!]!
  }

  extend type Mutation {
    createAccount(name: String!, initialBalance: Float!): Account!
    createTransaction(accountId: ID!, amount: Float!, description: String!): Transaction!
  }
`;
