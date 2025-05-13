import { LeadService } from '../leadService';
import { mockLeads, mockRegisterInput, mockNewLead } from '../../test/testUtils';

// Mock the database client
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

// Import after mocking
import prisma from '../../db/client';

describe('LeadService', () => {
  let leadService: LeadService;

  beforeEach(() => {
    leadService = new LeadService();
    jest.clearAllMocks();
  });

  describe('getAllLeads', () => {
    it('should return all leads', async () => {
      // Setup mock return value
      (prisma.lead.findMany as jest.Mock).mockResolvedValue(mockLeads);

      // Execute the method
      const result = await leadService.getAllLeads();

      // Assert expectations
      expect(prisma.lead.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockLeads);
      expect(result.length).toBe(2);
    });

    it('should handle empty results', async () => {
      // Setup mock to return empty array
      (prisma.lead.findMany as jest.Mock).mockResolvedValue([]);

      // Execute the method
      const result = await leadService.getAllLeads();

      // Assert expectations
      expect(prisma.lead.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('getLeadById', () => {
    it('should return a lead by ID', async () => {
      // Setup mock return value
      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(mockLeads[0]);

      // Execute the method
      const result = await leadService.getLeadById(1);

      // Assert expectations
      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockLeads[0]);
    });

    it('should return null when lead not found', async () => {
      // Setup mock to return null
      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);

      // Execute the method
      const result = await leadService.getLeadById(999);

      // Assert expectations
      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('registerLead', () => {
    it('should register a new lead', async () => {
      // Setup mock return value
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockNewLead);

      // Execute the method
      const result = await leadService.registerLead(mockRegisterInput);

      // Assert expectations
      expect(prisma.lead.create).toHaveBeenCalledWith({
        data: {
          name: mockRegisterInput.name,
          email: mockRegisterInput.email,
          mobile: mockRegisterInput.mobile,
          postcode: mockRegisterInput.postcode,
          services: mockRegisterInput.services,
        },
      });
      expect(result).toEqual(mockNewLead);
    });

    it('should throw an error when creation fails', async () => {
      // Setup mock to throw error
      const mockError = new Error('Database error');
      (prisma.lead.create as jest.Mock).mockRejectedValue(mockError);

      // Execute the method and expect it to throw
      await expect(leadService.registerLead(mockRegisterInput)).rejects.toThrow(mockError);

      // Assert expectations
      expect(prisma.lead.create).toHaveBeenCalled();
    });
  });
}); 