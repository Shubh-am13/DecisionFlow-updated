import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB, disconnectDB } from './config/db';

const PORT = Number(process.env.PORT) || 5001;

const startServer = async (): Promise<void> => {
  try {
    // 1. Bind port immediately to pass Render health check
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[CrowdWise Server] Running on http://0.0.0.0:${PORT}`);
      console.log(`[CrowdWise Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // 2. Connect to MongoDB Atlas
    connectDB()
      .then((conn) => {
        if (conn) {
          console.log('[CrowdWise Server] Database connection established.');
        } else {
          console.warn('[CrowdWise Server] Running with degraded DB connectivity.');
        }
      })
      .catch((err) => {
        console.error('[CrowdWise Server] MongoDB connection error:', err);
      });

    // 3. Graceful shutdown handling
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
