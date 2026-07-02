import { Request, Response } from 'express';
import { Mechanic, Feedback, Donation } from '../models';

export const getMechanics = async (req: Request, res: Response) => {
  try {
    const { vehicleType, serviceType } = req.query;
    
    const mechanics = await Mechanic.findAll({
      where: { status: 'Approved' }
    });
    
    let filtered = mechanics.map(m => m.dataValues);

    if (vehicleType) {
      filtered = filtered.filter(m => Array.isArray(m.vehicleTypes) && m.vehicleTypes.includes(vehicleType as string));
    }
    
    if (serviceType) {
      filtered = filtered.filter(m => Array.isArray(m.serviceTypes) && m.serviceTypes.includes(serviceType as string));
    }

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { type, description } = req.body;
    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description are required' });
    }

    const feedback = await Feedback.create({ type, description });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

export const submitDonation = async (req: Request, res: Response) => {
  try {
    const { amount, paymentReference, name } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const donation = await Donation.create({ amount, paymentReference, name });
    res.status(201).json({ message: 'Donation recorded successfully', donation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record donation' });
  }
};
