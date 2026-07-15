import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/authMiddleware';
import * as userController from '../controllers/userController';
import * as dashboardController from '../controllers/dashboardController';
import * as mechanicController from '../controllers/mechanicController';
import * as feedbackController from '../controllers/feedbackController';
import * as settingsController from '../controllers/settingsController';
import { validateBody } from '../middleware/validation';
import {
  createUserSchema,
  featuredIdsSchema,
  feedbackStatusUpdateSchema,
  mechanicBulkCreateSchema,
  mechanicBulkStatusSchema,
  mechanicSchema,
  namedEntitySchema,
  profileUpdateSchema,
  updateUserSchema
} from '../validation/schemas';

export const adminRoutes = Router();

adminRoutes.use(authenticate as any);
const superAdminOnly = authorizeRole(['Super Admin']) as any;

// Admin Profile
adminRoutes.get('/profile', userController.getProfile as any);
adminRoutes.put('/profile', validateBody(profileUpdateSchema), userController.updateProfile as any);

// Users
adminRoutes.get('/users', superAdminOnly, userController.getUsers as any);
adminRoutes.post('/users', superAdminOnly, validateBody(createUserSchema), userController.createUser as any);
adminRoutes.put('/users/:id', superAdminOnly, validateBody(updateUserSchema), userController.updateUser as any);
adminRoutes.delete('/users/:id', superAdminOnly, userController.deleteUser as any);

// Dashboard
adminRoutes.get('/dashboard', dashboardController.getDashboardStats as any);
adminRoutes.get('/activity-logs', dashboardController.getActivityLogs as any);

// Mechanics
adminRoutes.get('/mechanics', mechanicController.getMechanics as any);
adminRoutes.get('/mechanics/:id', mechanicController.getMechanicById as any);
adminRoutes.post('/mechanics', validateBody(mechanicSchema), mechanicController.createMechanic as any);
adminRoutes.post('/mechanics/bulk', validateBody(mechanicBulkCreateSchema), mechanicController.bulkCreateMechanics as any);
adminRoutes.put('/mechanics/bulk/status', superAdminOnly, validateBody(mechanicBulkStatusSchema), mechanicController.bulkUpdateMechanicsStatus as any);
adminRoutes.put('/mechanics/:id', validateBody(mechanicSchema), mechanicController.updateMechanic as any);
adminRoutes.delete('/mechanics/:id', superAdminOnly, mechanicController.deleteMechanic as any);
adminRoutes.post('/mechanics/:id/approve', superAdminOnly, mechanicController.approveMechanic as any);

// Update Requests
adminRoutes.get('/update-requests', mechanicController.getUpdateRequests as any);
adminRoutes.get('/update-requests/:id', mechanicController.getUpdateRequestById as any);
adminRoutes.put('/update-requests/:id', mechanicController.updateUpdateRequest as any);
adminRoutes.delete('/update-requests/:id', superAdminOnly, mechanicController.deleteUpdateRequest as any);
adminRoutes.post('/update-requests/:id/approve', superAdminOnly, mechanicController.approveUpdateRequest as any);
adminRoutes.post('/update-requests/:id/reject', superAdminOnly, mechanicController.rejectUpdateRequest as any);

// Feedback & Donations
adminRoutes.get('/feedback', feedbackController.getFeedback as any);
adminRoutes.put('/feedback/:id', validateBody(feedbackStatusUpdateSchema), feedbackController.updateFeedback as any);
adminRoutes.delete('/feedback/:id', superAdminOnly, feedbackController.deleteFeedback as any);
adminRoutes.get('/donations', feedbackController.getDonations as any);

// Settings
adminRoutes.put('/vehicles/featured', superAdminOnly, validateBody(featuredIdsSchema), settingsController.updateFeaturedVehicles as any);
adminRoutes.post('/vehicles', superAdminOnly, validateBody(namedEntitySchema), settingsController.addVehicle as any);
adminRoutes.put('/vehicles/:id', superAdminOnly, validateBody(namedEntitySchema), settingsController.updateVehicle as any);
adminRoutes.delete('/vehicles/:id', superAdminOnly, settingsController.deleteVehicle as any);
adminRoutes.put('/services/featured', superAdminOnly, validateBody(featuredIdsSchema), settingsController.updateFeaturedServices as any);
adminRoutes.post('/services', superAdminOnly, validateBody(namedEntitySchema), settingsController.addService as any);
adminRoutes.put('/services/:id', superAdminOnly, validateBody(namedEntitySchema), settingsController.updateService as any);
adminRoutes.delete('/services/:id', superAdminOnly, settingsController.deleteService as any);
