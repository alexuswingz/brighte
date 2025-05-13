import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Global setup before all tests
beforeAll(() => {
  // Any global setup goes here
});

// Global cleanup after all tests
afterAll(() => {
  // Any global cleanup goes here
});

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
}); 