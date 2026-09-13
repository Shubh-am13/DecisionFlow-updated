import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import dilemmaRoutes from './routes/dilemmaRoutes';
import { errorHandler } from './middlewares/errorHandler';

// Load environment variables
dotenv.config();

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoints
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'CrowdWise API',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Authentication routes (supporting both direct and /api/auth paths)
app.use('/', authRoutes);
app.use('/api/auth', authRoutes);

// Dilemma routes (supporting both /dilemmas and /api/dilemmas paths)
app.use('/dilemmas', dilemmaRoutes);
app.use('/api/dilemmas', dilemmaRoutes);

// 404 Catch-all handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
