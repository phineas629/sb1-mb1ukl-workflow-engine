import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Patient @key(fields: "id") {
    id: ID!
    name: String
    birthDate: String
    gender: String
  }

  type Practitioner @key(fields: "id") {
    id: ID!
    name: String
    qualification: String
  }

  type Observation @key(fields: "id") {
    id: ID!
    status: String
    code: CodeableConcept
    subject: Reference
    effectiveDateTime: String
    valueQuantity: Quantity
  }

  type CodeableConcept {
    coding: [Coding]
    text: String
  }

  type Coding {
    system: String
    code: String
    display: String
  }

  type Reference {
    reference: String
    type: String
  }

  type Quantity {
    value: Float
    unit: String
    system: String
    code: String
  }

  extend type Query {
    getPatient(id: ID!): Patient
    searchPatients(name: String): [Patient!]!
    getPractitioner(id: ID!): Practitioner
    getObservation(id: ID!): Observation
    searchObservations(patientId: ID!, code: String): [Observation!]!
  }

  extend type Mutation {
    createPatient(name: String!, birthDate: String, gender: String): Patient!
    updatePatient(id: ID!, name: String, birthDate: String, gender: String): Patient!
    createObservation(patientId: ID!, code: String!, value: Float!, unit: String): Observation!
  }
`;
