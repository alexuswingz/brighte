# Brighte Eats API

A GraphQL API for Brighte Eats lead management system, built with TypeScript, Apollo Server, and Prisma.

## Features

- GraphQL API with TypeScript
- PostgreSQL database integration with Prisma ORM
- Lead registration and query functionality
- Input validation
- Structured project architecture

## System Requirements

- Node.js (v16+)
- PostgreSQL database

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
cd brighte-eats-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Update the .env file with your PostgreSQL connection string
```

4. Set up the database
```bash
npm run migrate
```

5. Generate Prisma client
```bash
npm run generate
```

6. Start the development server
```bash
npm run dev
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

## API Documentation

### Mutations

**register**: Register a new lead for Brighte Eats.

Input fields:
- `name`: String (required)
- `email`: String (required)
- `mobile`: String (required)
- `postcode`: String (required)
- `services`: Array of Services (delivery, pick-up, payment)

### Queries

**leads**: Get all leads
**lead**: Get a specific lead by ID

## Project Structure

```
src/
  ├── config/          # Configuration files
  ├── db/              # Database related files and migrations
  ├── graphql/         # GraphQL related files
  │   ├── resolvers/   # Query and mutation resolvers
  │   ├── schema/      # GraphQL schema definitions
  │   └── types/       # GraphQL type definitions
  ├── models/          # Data models and interfaces
  ├── services/        # Business logic
  └── utils/           # Utility functions
```

## Running Tests

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Building for Production

```bash
npm run build
npm start
``` 