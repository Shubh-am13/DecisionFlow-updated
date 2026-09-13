import app from './app';
import { connectDB, disconnectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[CrowdWise Server] Running on http://localhost:${PORT}`);
      console.log(`[CrowdWise Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      console.log(`\n[CrowdWise Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('[CrowdWise Server] Closed HTTP server.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[CrowdWise Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
