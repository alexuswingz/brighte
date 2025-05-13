import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum Service {
    DELIVERY
    PICKUP
    PAYMENT
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [Service!]!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterLeadInput {
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [Service!]!
  }

  type Query {
    leads: [Lead!]!
    lead(id: ID!): Lead
  }

  type Mutation {
    register(input: RegisterLeadInput!): Lead!
  }
`;

export default typeDefs; 