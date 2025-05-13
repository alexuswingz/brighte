import { ApolloError, UserInputError } from 'apollo-server-express';
import leadResolvers from '../leadResolvers';
import leadService from '../../../services/leadService';
import { mockLeads, mockRegisterInput, mockNewLead } from '../../../test/testUtils';

// Mock lead service
jest.mock('../../../services/leadService');
const mockLeadService = leadService as jest.Mocked<typeof leadService>;

describe('Lead Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.leads', () => {
    it('should return all leads', async () => {
      // Setup mock
      mockLeadService.getAllLeads.mockResolvedValue(mockLeads);

      // Execute resolver
      const result = await leadResolvers.Query.leads();

      // Assert expectations
      expect(mockLeadService.getAllLeads).toHaveBeenCalled();
      expect(result).toEqual(mockLeads);
    });

    it('should handle errors', async () => {
      // Setup mock to throw error
      const mockError = new Error('Database error');
      mockLeadService.getAllLeads.mockRejectedValue(mockError);

      // Execute and assert
      await expect(leadResolvers.Query.leads()).rejects.toThrow(ApolloError);
      expect(mockLeadService.getAllLeads).toHaveBeenCalled();
    });
  });

  describe('Query.lead', () => {
    it('should return a lead by ID', async () => {
      // Setup mock
      mockLeadService.getLeadById.mockResolvedValue(mockLeads[0]);

      // Execute resolver
      const result = await leadResolvers.Query.lead(null, { id: '1' });

      // Assert expectations
      expect(mockLeadService.getLeadById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLeads[0]);
    });

    it('should return null when lead not found', async () => {
      // Setup mock
      mockLeadService.getLeadById.mockResolvedValue(null);

      // Execute resolver
      const result = await leadResolvers.Query.lead(null, { id: '999' });

      // Assert expectations
      expect(mockLeadService.getLeadById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      // Setup mock to throw error
      const mockError = new Error('Database error');
      mockLeadService.getLeadById.mockRejectedValue(mockError);

      // Execute and assert
      await expect(leadResolvers.Query.lead(null, { id: '1' })).rejects.toThrow(ApolloError);
      expect(mockLeadService.getLeadById).toHaveBeenCalled();
    });
  });

  describe('Mutation.register', () => {
    it('should register a new lead', async () => {
      // Setup mock
      mockLeadService.registerLead.mockResolvedValue(mockNewLead);

      // Execute resolver
      const result = await leadResolvers.Mutation.register(null, { input: mockRegisterInput });

      // Assert expectations
      expect(mockLeadService.registerLead).toHaveBeenCalledWith(mockRegisterInput);
      expect(result).toEqual(mockNewLead);
    });

    it('should handle validation errors', async () => {
      // Setup mock to throw a validation error
      const zodError = {
        name: 'ZodError',
        errors: [{ path: ['email'], message: 'Invalid email' }]
      };
      mockLeadService.registerLead.mockRejectedValue(zodError);

      // Execute and assert
      await expect(leadResolvers.Mutation.register(null, { input: mockRegisterInput }))
        .rejects.toThrow(UserInputError);
      expect(mockLeadService.registerLead).toHaveBeenCalled();
    });

    it('should handle unique constraint errors', async () => {
      // Setup mock to throw a Prisma unique constraint error
      const prismaError = {
        code: 'P2002',
        message: 'Unique constraint failed on the fields: (`email`)'
      };
      mockLeadService.registerLead.mockRejectedValue(prismaError);

      // Execute and assert
      await expect(leadResolvers.Mutation.register(null, { input: mockRegisterInput }))
        .rejects.toThrow(UserInputError);
      expect(mockLeadService.registerLead).toHaveBeenCalled();
    });

    it('should handle generic errors', async () => {
      // Setup mock to throw a generic error
      const mockError = new Error('Database error');
      mockLeadService.registerLead.mockRejectedValue(mockError);

      // Execute and assert
      await expect(leadResolvers.Mutation.register(null, { input: mockRegisterInput }))
        .rejects.toThrow(ApolloError);
      expect(mockLeadService.registerLead).toHaveBeenCalled();
    });
  });
}); 