import { Router } from 'express';
import { getMechanics, submitFeedback, submitDonation } from '../controllers/publicController';
import { getVehicles, getServices } from '../controllers/settingsController';

export const publicRoutes = Router();

publicRoutes.get('/mechanics', getMechanics);

publicRoutes.post('/feedback', submitFeedback);
publicRoutes.post('/donation', submitDonation);

// Settings
publicRoutes.get('/vehicles', getVehicles);
publicRoutes.get('/services', getServices);
