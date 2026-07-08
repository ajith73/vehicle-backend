import { Router } from 'express';
import { getMechanics, getRoute, submitFeedback, submitDonation, submitMechanicRegistration } from '../controllers/publicController';
import { getVehicles, getServices } from '../controllers/settingsController';
import { validateBody } from '../middleware/validation';
import { donationSubmissionSchema, feedbackSubmissionSchema, publicMechanicSubmissionSchema, routeRequestSchema } from '../validation/schemas';

export const publicRoutes = Router();

publicRoutes.get('/mechanics', getMechanics);
publicRoutes.post('/mechanics/register', validateBody(publicMechanicSubmissionSchema), submitMechanicRegistration);

publicRoutes.post('/feedback', validateBody(feedbackSubmissionSchema), submitFeedback);
publicRoutes.post('/donation', validateBody(donationSubmissionSchema), submitDonation);
publicRoutes.post('/route', validateBody(routeRequestSchema), getRoute);

// Settings
publicRoutes.get('/vehicles', getVehicles);
publicRoutes.get('/services', getServices);
