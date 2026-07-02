import { Router } from 'express';
import { getMechanics, submitFeedback, submitDonation } from '../controllers/publicController';

export const publicRoutes = Router();

publicRoutes.get('/mechanics', getMechanics);
publicRoutes.post('/feedback', submitFeedback);
publicRoutes.post('/donation', submitDonation);
