# Testing Documentation

This document outlines the testing approach for the Brighte Eats API.

## Test Coverage

- **Overall Coverage**: 80% statement coverage, 83.33% branch coverage
- **Business Logic Coverage**: 100% coverage for services, resolvers, and validation logic

## Test Types

### Unit Tests

1. **Service Layer Tests**
   - Tests for `LeadService` (src/services/__tests__/leadService.test.ts)
   - Covers all methods: getAllLeads, getLeadById, registerLead
   - Includes happy path and error scenarios
   - 100% code coverage

2. **Validation Tests**
   - Tests for validation schemas (src/utils/__tests__/validation.test.ts)
   - Covers both valid and invalid input scenarios
   - Tests for all validation rules (required fields, min lengths, email format)
   - 100% code coverage

3. **Resolver Tests**
   - Tests for GraphQL resolvers (src/graphql/resolvers/__tests__/leadResolvers.test.ts)
   - Covers all query and mutation resolvers
   - Tests error handling and edge cases
   - 100% code coverage

### Integration Tests

- Tests for the GraphQL API endpoints (src/test/integration/api.test.ts)
- Covers end-to-end request flow through Apollo Server
- Tests all major operations: querying leads, getting a specific lead, registering a lead

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (useful during development)
npm run test:watch
```

## Mocking Strategy

- Database operations are mocked at the Prisma client level
- Mock data is defined in `src/test/testUtils.ts`
- Services are mocked in resolver tests to isolate the testing layers

## Areas for Improvement

- Add more integration tests covering additional edge cases
- Add E2E tests with a real database instance
- Implement snapshot testing for GraphQL schema
- Add performance tests for high-load scenarios 