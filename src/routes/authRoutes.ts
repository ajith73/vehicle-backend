import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { loginSchema } from '../validation/schemas';

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), login);
