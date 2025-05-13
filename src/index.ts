import { createServer } from './graphql/server';
import env from './config/env';

async function startServer() {
  try {
    // Create server
    const { httpServer } = await createServer();
    
    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen({ port: env.PORT }, resolve);
    });
    
    console.log(`🚀 Server ready at http://localhost:${env.PORT}/graphql`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 