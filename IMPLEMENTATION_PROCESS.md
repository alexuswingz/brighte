# Brighte Eats API - Implementation Journey

This document traces my step-by-step implementation of the Brighte Eats API, detailing exactly how I built each component from start to finish.

## Initial Project Setup

I started by creating the project structure:

```bash
mkdir brighte-eats-api
cd brighte-eats-api
npm init -y
```

Next, I set up TypeScript configuration by creating `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

Then I installed the necessary dependencies:

```bash
npm install apollo-server graphql typescript prisma @prisma/client zod
npm install --save-dev ts-node nodemon jest ts-jest @types/jest @types/node
```

## Environment Configuration

I created a `.env` file with database configuration:

```
DATABASE_URL="postgresql://username:password@brighte-eats-db.czeyu2acgf59.ap-southeast-2.rds.amazonaws.com:5432/brighte_eats"
```

And established environment configuration in `src/config/env.ts`:

```typescript
import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
});

// Parse environment variables
export const env = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
};
```

## Database Setup

First, I initialized Prisma and created the schema:

```bash
npx prisma init
```

Then I defined the data model in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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

I created and applied the database migration:

```bash
npx prisma migrate dev --name init
```

I set up the database client in `src/db/client.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

// Create Prisma client instance
const prisma = new PrismaClient();

export default prisma;
```

## GraphQL Schema

I created the GraphQL schema in `src/graphql/schema/schema.graphql`:

```graphql
enum Service {
  DELIVERY
  PICKUP
  PAYMENT
}

type Lead {
  id: ID!
  name: String!
  email: String!
  mobile: String!
  postcode: String!
  services: [Service!]!
  createdAt: String!
  updatedAt: String!
}

input RegisterLeadInput {
  name: String!
  email: String!
  mobile: String!
  postcode: String!
  services: [Service!]!
}

type Query {
  leads: [Lead!]!
  lead(id: ID!): Lead
}

type Mutation {
  register(input: RegisterLeadInput!): Lead!
}
```

## Resolvers Implementation

I implemented the resolvers in `src/graphql/resolvers/index.ts`:

```typescript
import prisma from '../../db/client';
import { leadService } from '../../services/leadService';

export const resolvers = {
  Query: {
    leads: async () => {
      return await leadService.getAllLeads();
    },
    lead: async (_, { id }) => {
      return await leadService.getLeadById(parseInt(id));
    },
  },
  Mutation: {
    register: async (_, { input }) => {
      return await leadService.registerLead(input);
    },
  },
};
```

## Service Layer

I created the lead service in `src/services/leadService.ts`:

```typescript
import prisma from '../db/client';
import { validateLeadInput } from '../utils/validation';

export const leadService = {
  getAllLeads: async () => {
    return await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  getLeadById: async (id: number) => {
    return await prisma.lead.findUnique({
      where: { id },
    });
  },

  registerLead: async (input) => {
    // Validate input
    validateLeadInput(input);

    // Check if email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email: input.email },
    });

    if (existingLead) {
      throw new Error('A lead with this email already exists');
    }

    // Create new lead
    return await prisma.lead.create({
      data: input,
    });
  },
};
```

## Validation

I implemented input validation in `src/utils/validation.ts`:

```typescript
import { z } from 'zod';

const serviceEnum = z.enum(['DELIVERY', 'PICKUP', 'PAYMENT']);

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be a 10-digit number'),
  postcode: z.string().regex(/^\d{4}$/, 'Postcode must be a 4-digit number'),
  services: z.array(serviceEnum).min(1, 'At least one service must be selected'),
});

export function validateLeadInput(input) {
  return leadSchema.parse(input);
}
```

## Server Setup

I created the main server file in `src/index.ts`:

```typescript
import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import { resolvers } from './graphql/resolvers';
import { env } from './config/env';
import path from 'path';

// Load schema from file
const typeDefs = readFileSync(
  path.join(__dirname, 'graphql/schema/schema.graphql'),
  'utf8'
);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: env.NODE_ENV !== 'production',
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path,
    };
  },
});

// Start server
server.listen({ port: parseInt(env.PORT) }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

## Testing Setup

I configured Jest in `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
```

## Running Into Table Issues

After setting up everything, I encountered an issue where the database table was empty. To debug this:

1. First, I tried running Prisma Studio from the wrong directory:

```bash
PS C:\Users\User\Desktop\EXAMS> npx prisma studio
Error: Could not find Prisma Schema that is required for this command.
```

2. I navigated to the correct directory:

```bash
PS C:\Users\User\Desktop\EXAMS> cd brighte-eats-api
PS C:\Users\User\Desktop\EXAMS\brighte-eats-api> npx prisma studio
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Prisma Studio is up on http://localhost:5555
```

3. Looking at the database in pgAdmin, I could see the table was created but had no data.

## Creating Data Scripts

To fix the empty table issue, I created two utility scripts:

First, a data seeding script in `src/scripts/seed-data.ts`:

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

Then, a data verification script in `src/scripts/query-leads.ts`:

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

I ran these scripts to populate and verify the database:

```bash
PS C:\Users\User\Desktop\EXAMS\brighte-eats-api> npx ts-node src/scripts/seed-data.ts
Created test lead: {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  mobile: '0412345678',
  postcode: '2000',
  services: [ 'DELIVERY', 'PAYMENT' ],
  createdAt: 2025-05-13T13:00:34.202Z,
  updatedAt: 2025-05-13T13:00:34.202Z
}

PS C:\Users\User\Desktop\EXAMS\brighte-eats-api> npx ts-node src/scripts/query-leads.ts
Found leads: 1
[
  {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "0412345678",
    "postcode": "2000",
    "services": [
      "DELIVERY",
      "PAYMENT"
    ],
    "createdAt": "2025-05-13T13:00:34.202Z",
    "updatedAt": "2025-05-13T13:00:34.202Z"
  }
]
```

## Final Documentation & Repository Setup

After completing the implementation, I:

1. Created README.md with setup and usage instructions
2. Created PROJECT_ARCHITECTURE.md detailing the design decisions
3. Set up Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/alexuswingz/brighte.git
git branch -M main
git push -u origin main
```

My implementation was structured with clear separation of concerns:
- GraphQL schema and resolvers for the API layer
- Service layer for business logic
- Data access layer using Prisma ORM
- Validation and error handling

The final project successfully implemented all requirements and provided a solid foundation for the Brighte Eats lead collection system. 