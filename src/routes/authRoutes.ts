import { Router } from 'express';
import { login } from '../controllers/authController';

export const authRoutes = Router();

authRoutes.post('/login', login);
