// Define the Service enum for testing
export enum Service {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  PAYMENT = 'PAYMENT'
}

// Mock lead data types
export interface Lead {
  id: number;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock lead data for testing
export const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '0412345678',
    postcode: '2000',
    services: [Service.DELIVERY, Service.PAYMENT],
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '0487654321',
    postcode: '3000',
    services: [Service.PICKUP, Service.PAYMENT],
    createdAt: new Date('2023-01-02T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  },
];

// Mock input for registerLead
export const mockRegisterInput = {
  name: 'Test User',
  email: 'test@example.com',
  mobile: '0411222333',
  postcode: '4000',
  services: [Service.DELIVERY, Service.PICKUP],
};

// Mock new lead result
export const mockNewLead: Lead = {
  id: 3,
  ...mockRegisterInput,
  createdAt: new Date('2023-01-03T00:00:00.000Z'),
  updatedAt: new Date('2023-01-03T00:00:00.000Z'),
}; 