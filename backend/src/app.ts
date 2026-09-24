import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import apiRouter from './routes';
import errorHandler from './middlewares/error.middleware';

const app: Application = express();

// Allowed origins for CORS (development environments + optional configured client url)
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow non-browser requests or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Global Middleware Pipeline
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Mount Central API Router
app.use('/api', apiRouter);

// 404 Catch-All Handler for Unmapped Routes
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
