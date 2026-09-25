import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'http';
import app from './app';
import prisma from './config/db';
import { getSettings } from './modules/settings/settings.service';

const PORT: number = Number(process.env.PORT) || 5000;
let server: Server | null = null;
let isShuttingDown: boolean = false;

/**
 * Perform a clean and graceful shutdown of HTTP server and database connections
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`\n[${signal}] Graceful shutdown initiated...`);

  // Stop accepting new HTTP connections
  if (server && server.listening) {
    await new Promise<void>((resolve) => {
      server!.close((err?: Error) => {
        if (err) {
          console.error('Error closing HTTP server:', err);
        } else {
          console.log('HTTP server closed successfully.');
        }
        resolve();
      });
    });
  }

  // Disconnect database client
  try {
    await prisma.$disconnect();
    console.log('Database connection closed successfully.');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }

  console.log('Graceful shutdown completed. Exiting process.');
  process.exit(0);
};

/**
 * Bootstraps the application server lifecycle
 */
const bootstrap = async (): Promise<void> => {
  try {
    console.log('Connecting to MySQL database via Prisma...');
    await prisma.$connect();
    console.log('Database connected successfully.');

    // Auto-initialize default singleton SiteSettings (id: 1) if missing
    console.log('Verifying default site settings...');
    await getSettings();
    console.log('Default site settings verified.');

    server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`Portfolio API Server listening on port ${PORT}`);
      console.log(`Base API URL:      http://localhost:${PORT}/api`);
      console.log(`Health Check:      http://localhost:${PORT}/api/health`);
      console.log(`Environment:       ${process.env.NODE_ENV || 'development'}`);
      console.log('====================================================');
    });

    // Intercept termination signals
    process.on('SIGINT', () => {
      void gracefulShutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
      void gracefulShutdown('SIGTERM');
    });
  } catch (error) {
    console.error('Fatal error during server bootstrap:', error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

// Global handlers for unhandled rejections and exceptions
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Promise Rejection:', reason);
  void gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception thrown:', error);
  void gracefulShutdown('uncaughtException');
});

void bootstrap();