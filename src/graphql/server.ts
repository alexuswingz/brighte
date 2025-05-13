import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import typeDefs from './schema/typeDefs';
import resolvers from './resolvers';

export async function createServer() {
  // Create Express application
  const app: Express = express();
  
  // Middleware
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
  app.use(express.json());
  
  // Create HTTP server
  const httpServer = http.createServer(app);
  
  // Create Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      // Context setup (for authentication, etc.)
      return {
        req,
      };
    },
  });

  // Start Apollo server
  await server.start();
  
  // Apply middleware to Express app
  // @ts-ignore - Type incompatibility between apollo-server-express and express
  server.applyMiddleware({ app, path: '/graphql' });
  
  return { app, httpServer, server };
} 