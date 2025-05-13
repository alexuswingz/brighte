# Brighte Eats API - Project Architecture

## Project Overview

This GraphQL API was developed as part of a take-home exercise to create a system for collecting expressions of interest for Brighte Eats. The implementation includes a complete backend with TypeScript, Apollo Server, and PostgreSQL on AWS RDS.

## Solution Architecture

### Technology Stack
- **TypeScript**: For type-safe JavaScript development
- **Apollo Server**: GraphQL server implementation
- **PostgreSQL**: Database hosted on AWS RDS
- **Prisma ORM**: For database operations and migrations
- **Jest**: For comprehensive unit and integration tests

### Key Components
1. **GraphQL Schema**: Defined types, mutations (register), and queries (leads, lead)
2. **Resolvers**: Handle GraphQL operations and connect to the service layer
3. **Service Layer**: Contains business logic and validation
4. **Data Access Layer**: Prisma ORM for database operations
5. **Error Handling**: Comprehensive error management
6. **Input Validation**: Ensuring data integrity

## Key Decisions and Trade-offs

### Pros of the Solution
- **Type Safety**: Using TypeScript for robust development
- **Separation of Concerns**: Clear separation between GraphQL, business logic, and data access
- **Testability**: 80% code coverage with unit and integration tests
- **Scalability**: Easy to extend with new features and requirements
- **Performance**: Efficient database queries using Prisma
- **Security**: Input validation and error handling

### Cons and Limitations
- **Complexity**: GraphQL adds some complexity compared to a REST API
- **Database Schema**: Current schema is focused on MVP features and may need extension
- **Authentication**: Basic implementation that could be enhanced
- **Deployment**: Currently configured for development environment

## Possible Enhancements
- Implementing user authentication and authorization
- Adding more comprehensive validation rules
- Creating a CI/CD pipeline
- Adding caching for frequently accessed data
- Implementing rate limiting
- Enhanced logging and monitoring

## Running the Project

1. Navigate to the project directory:
```bash
cd brighte-eats-api
```

2. Environment setup is already configured with AWS RDS

3. Start Prisma Studio to view the database:
```bash
npx prisma studio
```

4. Run the GraphQL server:
```bash
npm run dev
```

5. Access the GraphQL playground at `http://localhost:4000/graphql`

## Testing

Run the test suite to verify functionality:
```bash
npm test
```

## Database Debugging
If encountering database issues:
1. Verify the connection string in the `.env` file
2. Check that migrations have been applied
3. Use Prisma Studio to inspect the database content
4. Run seeding scripts to populate test data:
```bash
npx ts-node src/scripts/seed-data.ts
``` 