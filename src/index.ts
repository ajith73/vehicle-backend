import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { setupDatabase } from './seeders';
import { routes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { requestLoggingMiddleware } from './middleware/requestLogging';
import { logger, registerProcessErrorHandlers } from './lib/logger';

const app = express();
registerProcessErrorHandlers();

app.use(cors({ exposedHeaders: ['X-Total-Count'] }));
app.use(express.json());
app.use(requestLoggingMiddleware);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', requestId: req.requestId });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await setupDatabase();
  app.listen(PORT, () => {
    logger.info('server_started', { port: Number(PORT) });
  });
};

startServer().catch((error) => {
  logger.error('server_startup_failed', { error });
  process.exit(1);
});

export default app;
