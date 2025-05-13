import { z } from 'zod';

// Define the Service enum for validation
export enum Service {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
  PAYMENT = 'PAYMENT'
}

// Validate lead registration input
export const registerLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(6, 'Mobile number must be at least 6 characters'),
  postcode: z.string().min(4, 'Postcode must be at least 4 characters'),
  services: z.array(
    z.enum([Service.DELIVERY, Service.PICKUP, Service.PAYMENT])
  ).min(1, 'At least one service must be selected'),
});

export type RegisterLeadInput = z.infer<typeof registerLeadSchema>; 