import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Mechanic, Feedback, Donation, ActivityLog, MechanicUpdateRequest } from '../models';
import { handleControllerError } from '../utils/controller';

const getAvailabilityStatus = (mechanic: any) => {
  if (!mechanic || mechanic.availability === false) return 'Closed';
  if (!Array.isArray(mechanic.operatingDays) || !mechanic.operatingHours) return 'Available';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[new Date().getDay()];
  if (!mechanic.operatingDays.includes(currentDay)) return 'Closed';

  try {
    const [openStr, closeStr] = mechanic.operatingHours.split('-').map((s: string) => s.trim());
    const [openHour, openMinute] = openStr.split(':').map(Number);
    const [closeHour, closeMinute] = closeStr.split(':').map(Number);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes ? 'Available' : 'Closed';
  } catch {
    return 'Available';
  }
};

const parseFilterValues = (value: unknown) => {
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const getMechanics = async (req: Request, res: Response) => {
  try {
    const { vehicleType, serviceType, vehicle, service, search, lat, lng, radius, limit, page, sort, availability } = req.query;
    
    let mechanics;
    
    if (lat && lng) {
      const parsedLat = parseFloat(lat as string);
      const parsedLng = parseFloat(lng as string);
      const parsedRadius = radius ? parseFloat(radius as string) : 50;

      const haversine = `(
        6371 * acos(
          cos(radians(${parsedLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${parsedLng})) +
          sin(radians(${parsedLat})) * sin(radians(latitude))
        )
      )`;

      let whereClause: any = { status: 'Approved' };
      if (!search || (typeof search === 'string' && search.trim() === '')) {
        whereClause[Op.and] = Sequelize.literal(`${haversine} <= ${parsedRadius}`);
      }

      mechanics = await Mechanic.findAll({
        where: whereClause,
        attributes: {
          include: [[Sequelize.literal(haversine), 'dist']]
        },
        order: [[Sequelize.literal('dist'), 'ASC']]
      });
    } else {
      mechanics = await Mechanic.findAll({
        where: { status: 'Approved' }
      });
    }
    
    let filtered = mechanics.map(m => m.dataValues);

    const vehicleFilters = parseFilterValues((vehicle as string) || (vehicleType as string));
    const serviceFilters = parseFilterValues((service as string) || (serviceType as string));

    if (vehicleFilters.length > 0) {
      filtered = filtered.filter((mechanic) =>
        Array.isArray(mechanic.vehicleTypes) && vehicleFilters.some((item) => mechanic.vehicleTypes.includes(item))
      );
    }
    
    if (serviceFilters.length > 0) {
      filtered = filtered.filter((mechanic) =>
        Array.isArray(mechanic.serviceTypes) && serviceFilters.some((item) => mechanic.serviceTypes.includes(item))
      );
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter((mechanic) => {
        const haystack = [
          mechanic.businessName,
          mechanic.name,
          mechanic.area,
          mechanic.city,
          mechanic.landmark,
          mechanic.address,
          ...(Array.isArray(mechanic.serviceTypes) ? mechanic.serviceTypes : []),
          ...(Array.isArray(mechanic.vehicleTypes) ? mechanic.vehicleTypes : [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(term);
      });
    }

    let processed = filtered.map((mechanic) => ({
      ...mechanic,
      currentStatus: getAvailabilityStatus(mechanic)
    }));

    if (availability === 'Available') {
      processed = processed.filter(m => m.currentStatus === 'Available');
    } else if (availability === 'Not Available') {
      processed = processed.filter(m => m.currentStatus !== 'Available');
    }

    if (sort === 'Available') {
      processed.sort((a, b) => {
        if (a.currentStatus === 'Available' && b.currentStatus !== 'Available') return -1;
        if (a.currentStatus !== 'Available' && b.currentStatus === 'Available') return 1;
        return 0; // Distance sort is preserved from DB
      });
    }

    const parsedLimit = limit ? parseInt(limit as string, 10) : 50;
    const parsedPage = page ? parseInt(page as string, 10) : 1;
    const offset = (parsedPage - 1) * parsedLimit;
    
    const paginated = processed.slice(offset, offset + parsedLimit);

    res.setHeader('X-Total-Count', processed.length.toString());
    res.json(paginated);
  } catch (error: any) {
    handleControllerError(req, res, error, 'Failed to fetch mechanics');
  }
};

export const getRoute = async (req: Request, res: Response) => {
  try {
    const { startLat, startLng, endLat, endLng, routeOption = 'Fastest' } = req.body;
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&alternatives=true`;
    const response = await fetch(osrmUrl);

    if (!response.ok) {
      return res.status(502).json({ error: 'Route provider unavailable', requestId: req.requestId });
    }

    const data = await response.json() as { routes?: Array<{ distance: number; duration: number; geometry: { coordinates: number[][] } }> };
    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found', requestId: req.requestId });
    }

    let bestRoute = data.routes[0];
    if (routeOption === 'Shortest') {
      bestRoute = data.routes.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
    } else {
      bestRoute = data.routes.reduce((prev, curr) => prev.duration < curr.duration ? prev : curr);
    }

    res.json({
      distanceKm: Number((bestRoute.distance / 1000).toFixed(1)),
      durationMinutes: Math.round(bestRoute.duration / 60),
      routeCoords: bestRoute.geometry.coordinates.map((coord) => [coord[1], coord[0]])
    });
  } catch (error: any) {
    console.error('getRoute Error:', error);
    if (error.cause?.code === 'ECONNREFUSED' || error.name === 'TypeError') {
      return res.status(502).json({ error: 'Routing service is temporarily unavailable. Please try again later.', requestId: req.requestId });
    }
    handleControllerError(req, res, error, 'Failed to fetch route');
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { type, description } = req.body;

    const feedback = await Feedback.create({ type, description });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to submit feedback');
  }
};

export const submitDonation = async (req: Request, res: Response) => {
  try {
    const { amount, paymentReference, name, email, consentGiven } = req.body;

    const donation = await Donation.create({ amount, paymentReference, name, email, consentGiven });
    res.status(201).json({ message: 'Donation recorded successfully', donation });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to record donation');
  }
};

export const submitMechanicRegistration = async (req: Request, res: Response) => {
  try {
    const { existingMechanicId, ...mechanicData } = req.body;
    const normalizedData = {
      ...mechanicData,
      name: mechanicData.businessName || mechanicData.name
    };

    if (existingMechanicId) {
      const mechanic = await Mechanic.findByPk(existingMechanicId);
      if (!mechanic) {
        return res.status(404).json({ error: 'Mechanic not found', requestId: req.requestId });
      }

      const request = await MechanicUpdateRequest.create({
        mechanicId: existingMechanicId,
        updatedData: normalizedData,
        status: 'Pending Update Approval',
        requestedById: null
      });

      await ActivityLog.create({
        userId: null,
        action: 'Public Mechanic Update Request',
        details: `Public update request submitted for mechanic ID ${existingMechanicId}.`
      });

      return res.status(201).json({
        message: 'Update request submitted for Super Admin review',
        request
      });
    }

    const request = await MechanicUpdateRequest.create({
      mechanicId: null,
      updatedData: normalizedData,
      status: 'Pending Update Approval',
      requestedById: null
    });

    await ActivityLog.create({
      userId: null,
      action: 'Public Mechanic Registration Request',
      details: `Public new mechanic request submitted for ${normalizedData.businessName || normalizedData.name}.`
    });

    return res.status(201).json({
      message: 'Mechanic request submitted for Super Admin review',
      request
    });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to submit mechanic request');
  }
};
