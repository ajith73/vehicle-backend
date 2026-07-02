import { Response } from 'express';
import { Mechanic, MechanicUpdateRequest, Feedback, Donation, ActivityLog, User } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalMechanics = await Mechanic.count();
    const approvedMechanics = await Mechanic.count({ where: { status: 'Approved' } });
    const pendingMechanics = await Mechanic.count({ where: { status: 'Pending' } });
    const pendingRequests = await MechanicUpdateRequest.count({ where: { status: 'Pending Update Approval' } });
    const feedbackCount = await Feedback.count();
    const donationCount = await Donation.count();

    const recentActivities = await ActivityLog.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    const allMechanics = await Mechanic.findAll({ attributes: ['city', 'createdAt'] });
    
    const cityCount: Record<string, number> = {};
    const dateCount: Record<string, number> = {};
    
    allMechanics.forEach(m => {
      const city = m.dataValues.city || 'Unknown';
      cityCount[city] = (cityCount[city] || 0) + 1;
      
      const dateStr = new Date(m.dataValues.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateCount[dateStr] = (dateCount[dateStr] || 0) + 1;
    });

    const mechanicsByCity = Object.keys(cityCount)
      .map(city => ({ name: city, value: cityCount[city] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const mechanicsByDate = Object.keys(dateCount)
      .map(date => ({ date, count: dateCount[date] }))
      .slice(-10);

    res.json({
      totalMechanics,
      approvedMechanics,
      pendingMechanics,
      pendingRequests,
      feedbackCount,
      donationCount,
      recentActivities,
      mechanicsByCity,
      mechanicsByDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};
