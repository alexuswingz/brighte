# Brighte Eats API - Implementation Process

This document outlines the step-by-step approach taken to design, implement, and test the Brighte Eats API system, from initial setup to final deployment.

## 1. Project Initialization & Setup

### Initial Configuration
1. **Project Scaffolding**
   - Created directory structure for the TypeScript Node.js application
   - Initialized package.json with `npm init`
   - Set up TypeScript configuration in `tsconfig.json`

2. **Environment Setup**
   - Configured development environment variables in `.env`
   - Set up database connection URL for AWS RDS PostgreSQL instance
   - Established development, testing, and production environment distinctions

3. **Dependency Installation**
   ```bash
   npm install apollo-server graphql typescript prisma @prisma/client
   npm install --save-dev ts-node nodemon jest ts-jest @types/jest
   ```

## 2. Database Design & Implementation

### Database Architecture
1. **PostgreSQL Selection**
   - Chose PostgreSQL for ACID compliance and robust relational capabilities
   - Provisioned AWS RDS instance for secure cloud database hosting

2. **Prisma ORM Integration**
   - Initialized Prisma schema: `npx prisma init`
   - Defined data models in `schema.prisma`:
     ```prisma
     model Lead {
       id           Int       @id @default(autoincrement())
       name         String
       email        String    @unique
       mobile       String
       postcode     String
       services     Service[]
       createdAt    DateTime  @default(now()) @map("created_at")
       updatedAt    DateTime  @updatedAt @map("updated_at")
     
       @@map("leads")
     }
     
     enum Service {
       DELIVERY
       PICKUP
       PAYMENT
     }
     ```

3. **Database Migration**
   - Created initial migration: `npx prisma migrate dev --name init`
   - Applied migration to development database
   - Verified table creation in pgAdmin

4. **Database Client**
   - Created database client singleton in `src/db/client.ts`
   - Implemented connection handling and error management

## 3. GraphQL API Implementation

### Schema Definition
1. **Type Definitions**
   - Created GraphQL schema with SDL in `src/graphql/schema`
   - Defined types for Lead, Input types, and Service enum
   - Structured queries and mutations

2. **Resolver Implementation**
   - Created resolver functions for queries and mutations
   - Implemented proper error handling and validation
   - Connected resolvers to service layer

### Apollo Server Setup
1. **Server Configuration**
   - Set up Apollo Server with proper context and plugins
   - Configured GraphQL playground for development
   - Implemented error formatting for client-friendly responses

## 4. Business Logic & Services

### Service Layer
1. **Lead Service**
   - Implemented service functions for lead registration and retrieval
   - Added data validation and business rules
   - Created proper separation from data access layer

2. **Input Validation**
   - Implemented comprehensive validation for all user inputs
   - Created reusable validation utilities
   - Added custom error types for structured error handling

## 5. Testing

### Test Implementation
1. **Unit Tests**
   - Created unit tests for all service functions
   - Implemented resolver tests with mock services
   - Added validation utility tests

2. **Integration Tests**
   - Set up test database environment
   - Implemented end-to-end GraphQL operation tests
   - Created test data fixtures and utilities

3. **Test Coverage**
   - Achieved 80% code coverage
   - Utilized Jest's coverage reports to identify gaps
   - Prioritized critical path testing

## 6. Performance & Optimization

1. **Query Optimization**
   - Structured Prisma queries for optimal performance
   - Implemented proper indexing in database schema
   - Added pagination for list queries

2. **Error Handling**
   - Created comprehensive error handling strategy
   - Implemented structured GraphQL errors
   - Added logging for server-side error tracking

## 7. Debugging & Troubleshooting

When encountering the "table is empty" issue:

1. **Database Verification**
   - Checked database connection in pgAdmin
   - Verified table structure was correctly created
   - Confirmed migrations were properly applied

2. **Data Seeding**
   - Created data seeding script in `src/scripts/seed-data.ts`:
     ```typescript
     import prisma from '../db/client';
     
     async function main() {
       try {
         // Clear existing data
         await prisma.lead.deleteMany();
         
         // Create test lead
         const lead = await prisma.lead.create({
           data: {
             name: 'Test User',
             email: 'test@example.com',
             mobile: '0412345678',
             postcode: '2000',
             services: ['DELIVERY', 'PAYMENT']
           },
         });
         
         console.log('Created test lead:', lead);
       } catch (error) {
         console.error('Error seeding data:', error);
       } finally {
         await prisma.$disconnect();
       }
     }
     
     main();
     ```

3. **Data Verification**
   - Created query script in `src/scripts/query-leads.ts` to verify data:
     ```typescript
     import prisma from '../db/client';
     
     async function main() {
       try {
         // Query all leads
         const leads = await prisma.lead.findMany();
         
         console.log('Found leads:', leads.length);
         console.log(JSON.stringify(leads, null, 2));
       } catch (error) {
         console.error('Error querying leads:', error);
       } finally {
         await prisma.$disconnect();
       }
     }
     
     main();
     ```

4. **Execution & Verification**
   - Executed seeding script: `npx ts-node src/scripts/seed-data.ts`
   - Confirmed data insertion with query script
   - Verified in pgAdmin that data was properly stored

## 8. Version Control & Documentation

1. **Git Setup**
   - Initialized Git repository
   - Created appropriate .gitignore file
   - Structured commits by logical components

2. **Documentation**
   - Created comprehensive README.md with setup instructions
   - Added PROJECT_ARCHITECTURE.md detailing design decisions
   - Documented API usage with examples

3. **GitHub Repository**
   - Created GitHub repository at https://github.com/alexuswingz/brighte.git
   - Pushed code with structured commit history
   - Added detailed documentation

## Final Result

The implementation resulted in a fully functional GraphQL API that:
- Allows registration of new leads with validated input
- Provides query capabilities for lead data
- Maintains data integrity through validation
- Offers comprehensive error handling
- Follows best practices for code organization and architecture

The API meets all requirements specified in the take-home exercise and provides a solid foundation for future enhancements. 