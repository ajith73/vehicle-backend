import { Response } from 'express';
import { Feedback, Donation } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const getFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedback = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

export const updateFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedbackId = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    await Feedback.update({ status }, { where: { id: feedbackId } });
    res.json({ message: 'Feedback updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
};

export const deleteFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedbackId = parseInt(req.params.id as string, 10);
    await Feedback.destroy({ where: { id: feedbackId } });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

export const getDonations = async (req: AuthRequest, res: Response) => {
  try {
    const donations = await Donation.findAll({ order: [['createdAt', 'DESC']] });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};
