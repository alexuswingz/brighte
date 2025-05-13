import { registerLeadSchema, RegisterLeadInput } from '../../utils/validation';
import { ApolloError, UserInputError } from 'apollo-server-express';
import leadService from '../../services/leadService';

const leadResolvers = {
  Query: {
    // Get all leads
    leads: async () => {
      try {
        return await leadService.getAllLeads();
      } catch (error: any) {
        console.error('Error fetching leads:', error);
        throw new ApolloError('Failed to fetch leads', 'DATABASE_ERROR');
      }
    },

    // Get a specific lead by ID
    lead: async (_: any, { id }: { id: string }) => {
      try {
        const leadId = parseInt(id, 10);
        return await leadService.getLeadById(leadId);
      } catch (error: any) {
        console.error(`Error fetching lead ${id}:`, error);
        throw new ApolloError('Failed to fetch lead', 'DATABASE_ERROR');
      }
    },
  },

  Mutation: {
    // Register a new lead
    register: async (_: any, { input }: { input: RegisterLeadInput }) => {
      try {
        // Validate input
        const validatedData = registerLeadSchema.parse(input);
        
        // Create lead
        return await leadService.registerLead(validatedData);
      } catch (error: any) {
        // Handle validation errors
        if (error.name === 'ZodError') {
          throw new UserInputError('Validation error', { errors: error.errors });
        }
        
        // Handle unique constraint errors
        if (error.code === 'P2002') {
          throw new UserInputError('Email already exists');
        }
        
        console.error('Error registering lead:', error);
        throw new ApolloError('Failed to register lead', 'DATABASE_ERROR');
      }
    },
  },
};

export default leadResolvers; 