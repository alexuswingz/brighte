import prisma from '../db/client';
import { RegisterLeadInput } from '../utils/validation';
import { Lead, Service } from '@prisma/client';

/**
 * Lead service class for handling lead operations
 */
export class LeadService {
  /**
   * Get all leads
   * @returns Promise<Lead[]> - Array of leads
   */
  public async getAllLeads(): Promise<Lead[]> {
    return await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get lead by ID
   * @param id - Lead ID
   * @returns Promise<Lead | null> - Lead or null if not found
   */
  public async getLeadById(id: number): Promise<Lead | null> {
    return await prisma.lead.findUnique({
      where: { id },
    });
  }

  /**
   * Register a new lead
   * @param data - Lead registration data
   * @returns Promise<Lead> - Created lead
   */
  public async registerLead(data: RegisterLeadInput): Promise<Lead> {
    const { name, email, mobile, postcode, services } = data;

    return await prisma.lead.create({
      data: {
        name,
        email,
        mobile,
        postcode,
        services,
      },
    });
  }
}

// Export singleton instance
export default new LeadService(); 