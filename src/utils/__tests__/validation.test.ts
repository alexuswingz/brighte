import { registerLeadSchema, Service } from '../validation';

describe('Validation', () => {
  describe('registerLeadSchema', () => {
    it('should validate valid input', () => {
      // Valid input data
      const validInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: [Service.DELIVERY, Service.PAYMENT],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(validInput);

      // Assert valid
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });

    it('should reject empty name', () => {
      // Invalid input with empty name
      const invalidInput = {
        name: '',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: [Service.DELIVERY],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject invalid email', () => {
      // Invalid input with invalid email
      const invalidInput = {
        name: 'John Doe',
        email: 'notanemail',
        mobile: '0412345678',
        postcode: '2000',
        services: [Service.DELIVERY],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject too short mobile number', () => {
      // Invalid input with too short mobile
      const invalidInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '12345',
        postcode: '2000',
        services: [Service.DELIVERY],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('mobile');
      }
    });

    it('should reject too short postcode', () => {
      // Invalid input with too short postcode
      const invalidInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '20',
        services: [Service.DELIVERY],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('postcode');
      }
    });

    it('should reject empty services array', () => {
      // Invalid input with empty services
      const invalidInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: [],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('services');
      }
    });

    it('should reject invalid service value', () => {
      // Invalid input with invalid service
      const invalidInput = {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '0412345678',
        postcode: '2000',
        services: ['UNKNOWN_SERVICE'],
      };

      // Validate input
      const result = registerLeadSchema.safeParse(invalidInput);

      // Assert invalid
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('services');
      }
    });
  });
}); 