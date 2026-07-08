import { Request, Response } from 'express';
import { VehicleType, ServiceType } from '../models';
import { handleControllerError } from '../utils/controller';

// Public endpoints
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await VehicleType.findAll({ order: [['isFeatured', 'DESC'], ['orderIndex', 'ASC'], ['name', 'ASC']] });
    res.json(vehicles);
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to fetch vehicles');
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await ServiceType.findAll({ order: [['isFeatured', 'DESC'], ['orderIndex', 'ASC'], ['name', 'ASC']] });
    res.json(services);
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to fetch services');
  }
};

// Admin endpoints
export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const vehicle = await VehicleType.create({ name });
    res.status(201).json(vehicle);
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to create vehicle type');
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await VehicleType.destroy({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to delete vehicle type');
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await VehicleType.update({ name }, { where: { id } });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to update vehicle type');
  }
};

export const addService = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const service = await ServiceType.create({ name });
    res.status(201).json(service);
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to create service type');
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ServiceType.destroy({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to delete service type');
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await ServiceType.update({ name }, { where: { id } });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to update service type');
  }
};

export const updateFeaturedVehicles = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // array of ids in order
    
    // Reset all
    await VehicleType.update({ isFeatured: false, orderIndex: 0 }, { where: {} });
    
    // Update selected sequentially
    for (let i = 0; i < ids.length; i++) {
      await VehicleType.update({ isFeatured: true, orderIndex: i }, { where: { id: ids[i] } });
    }
    res.json({ message: 'Featured vehicles updated' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to update featured vehicles');
  }
};

export const updateFeaturedServices = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // array of ids in order
    
    // Reset all
    await ServiceType.update({ isFeatured: false, orderIndex: 0 }, { where: {} });
    
    // Update selected sequentially
    for (let i = 0; i < ids.length; i++) {
      await ServiceType.update({ isFeatured: true, orderIndex: i }, { where: { id: ids[i] } });
    }
    res.json({ message: 'Featured services updated' });
  } catch (error) {
    handleControllerError(req, res, error, 'Failed to update featured services');
  }
};
