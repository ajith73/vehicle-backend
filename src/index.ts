import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { setupDatabase } from './seeders';
import { routes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/api', routes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
