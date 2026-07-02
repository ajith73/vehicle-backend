import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import * as dashboardController from '../controllers/dashboardController';
import * as mechanicController from '../controllers/mechanicController';
import * as feedbackController from '../controllers/feedbackController';

export const adminRoutes = Router();

adminRoutes.use(authenticate as any);
const superAdminOnly = authorizeRole(['Super Admin']) as any;

// Admin Profile
adminRoutes.get('/profile', userController.getProfile as any);
adminRoutes.put('/profile', userController.updateProfile as any);

// Users
adminRoutes.get('/users', superAdminOnly, userController.getUsers as any);
adminRoutes.post('/users', superAdminOnly, userController.createUser as any);
adminRoutes.put('/users/:id', superAdminOnly, userController.updateUser as any);
adminRoutes.delete('/users/:id', superAdminOnly, userController.deleteUser as any);

// Dashboard
adminRoutes.get('/dashboard', dashboardController.getDashboardStats as any);
adminRoutes.get('/activity-logs', dashboardController.getActivityLogs as any);

// Mechanics
adminRoutes.get('/mechanics', mechanicController.getMechanics as any);
adminRoutes.get('/mechanics/:id', mechanicController.getMechanicById as any);
adminRoutes.post('/mechanics', mechanicController.createMechanic as any);
adminRoutes.post('/mechanics/bulk', mechanicController.bulkCreateMechanics as any);
adminRoutes.put('/mechanics/:id', mechanicController.updateMechanic as any);
adminRoutes.delete('/mechanics/:id', superAdminOnly, mechanicController.deleteMechanic as any);
adminRoutes.post('/mechanics/:id/approve', superAdminOnly, mechanicController.approveMechanic as any);

// Update Requests
adminRoutes.get('/update-requests', mechanicController.getUpdateRequests as any);
adminRoutes.post('/update-requests/:id/approve', superAdminOnly, mechanicController.approveUpdateRequest as any);
adminRoutes.post('/update-requests/:id/reject', superAdminOnly, mechanicController.rejectUpdateRequest as any);

// Feedback & Donations
adminRoutes.get('/feedback', feedbackController.getFeedback as any);
adminRoutes.put('/feedback/:id', feedbackController.updateFeedback as any);
adminRoutes.delete('/feedback/:id', superAdminOnly, feedbackController.deleteFeedback as any);
adminRoutes.get('/donations', feedbackController.getDonations as any);
