import { createServer } from '../../graphql/server';
import { ApolloServer } from 'apollo-server-express';
import { Service } from '@prisma/client';
import prisma from '../../db/client';
import { mockLeads, mockRegisterInput, mockNewLead } from '../testUtils';

// Mock prisma client
jest.mock('../../db/client', () => ({
  __esModule: true,
  default: {
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('GraphQL API Integration Tests', () => {
  let server: ApolloServer;
  
  beforeAll(async () => {
    const { server: apolloServer } = await createServer();
    server = apolloServer;
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Leads Query', () => {
    it('should return all leads', async () => {
      // Setup mock
      (prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);
      
      // Define query
      const query = `
        query {
          leads {
            id
            name
            email
            mobile
            postcode
            services
          }
        }
      `;
      
      // Execute query
      const response = await server.executeOperation({
        query,
      });
      
      // Assert response
      expect(response.errors).toBeUndefined();
      expect(response.data?.leads).toHaveLength(2);
      expect(response.data?.leads[0].id).toBe(mockLeads[0].id.toString());
      expect(prisma.lead.findMany).toHaveBeenCalled();
    });
  });
  
  describe('Lead Query', () => {
    it('should return a lead by ID', async () => {
      // Setup mock
      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(mockLeads[0]);
      
      // Define query
      const query = `
        query {
          lead(id: "1") {
            id
            name
            email
            mobile
            postcode
            services
          }
        }
      `;
      
      // Execute query
      const response = await server.executeOperation({
        query,
      });
      
      // Assert response
      expect(response.errors).toBeUndefined();
      expect(response.data?.lead.id).toBe(mockLeads[0].id.toString());
      expect(response.data?.lead.name).toBe(mockLeads[0].name);
      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
  
  describe('Register Mutation', () => {
    it('should register a new lead', async () => {
      // Setup mock
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockNewLead);
      
      // Define mutation
      const mutation = `
        mutation {
          register(input: {
            name: "Test User"
            email: "test@example.com"
            mobile: "0411222333"
            postcode: "4000"
            services: [DELIVERY, PICKUP]
          }) {
            id
            name
            email
            mobile
            postcode
            services
          }
        }
      `;
      
      // Execute mutation
      const response = await server.executeOperation({
        query: mutation,
      });
      
      // Assert response
      expect(response.errors).toBeUndefined();
      expect(response.data?.register.id).toBe(mockNewLead.id.toString());
      expect(response.data?.register.name).toBe(mockNewLead.name);
      expect(prisma.lead.create).toHaveBeenCalled();
    });
  });
}); 