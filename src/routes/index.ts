import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';
import { publicRoutes } from './publicRoutes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/admin', adminRoutes);
routes.use('/public', publicRoutes);
