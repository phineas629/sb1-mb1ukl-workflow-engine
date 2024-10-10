import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Employee @key(fields: "id") {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type TimeEntry @key(fields: "id") {
    id: ID!
    employeeId: ID!
    date: String!
    startTime: String!
    endTime: String!
    duration: Float!
  }

  extend type Query {
    getEmployee(id: ID!): Employee
    getTimeEntries(employeeId: ID!, startDate: String!, endDate: String!): [TimeEntry!]!
  }

  extend type Mutation {
    createTimeEntry(
      employeeId: ID!
      date: String!
      startTime: String!
      endTime: String!
    ): TimeEntry!
  }
`;
