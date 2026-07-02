import { Response } from 'express';
import { Mechanic, MechanicUpdateRequest, ActivityLog, User } from '../models';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMechanics = async (req: AuthRequest, res: Response) => {
  try {
    const mechanics = await Mechanic.findAll();
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
};

export const getMechanicById = async (req: AuthRequest, res: Response) => {
  try {
    const mechanicId = parseInt(req.params.id as string, 10);
    const mechanic = await Mechanic.findByPk(mechanicId);
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mechanic' });
  }
};

export const createMechanic = async (req: AuthRequest, res: Response) => {
  try {
    const mechanicData = req.body;
    const mechanic = await Mechanic.create({
      ...mechanicData,
      status: 'Pending',
      createdById: req.user?.userId
    });

    await ActivityLog.create({
      userId: req.user?.userId,
      action: 'Created Mechanic',
      details: `Mechanic ${mechanic.dataValues.name} created and pending approval.`
    });

    res.status(201).json(mechanic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create mechanic' });
  }
};

export const bulkCreateMechanics = async (req: AuthRequest, res: Response) => {
  try {
    const mechanics = req.body.mechanics;
    if (!Array.isArray(mechanics) || mechanics.length === 0) {
      return res.status(400).json({ error: 'Invalid payload. Expected array of mechanics.' });
    }

    const createdMechanics = [];
    for (const mechanicData of mechanics) {
      const mechanic = await Mechanic.create({
        ...mechanicData,
        status: 'Pending',
        createdById: req.user?.userId
      });
      createdMechanics.push(mechanic);
    }

    await ActivityLog.create({
      userId: req.user?.userId,
      action: 'Bulk Created Mechanics',
      details: `${createdMechanics.length} mechanics created and pending approval.`
    });

    res.status(201).json({ message: 'Bulk upload successful', count: createdMechanics.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk create mechanics' });
  }
};

export const updateMechanic = async (req: AuthRequest, res: Response) => {
  try {
    const mechanicId = parseInt(req.params.id as string, 10);
    const updateData = req.body;
    const role = req.user?.role;

    if (role === 'Super Admin') {
      await Mechanic.update(updateData, { where: { id: mechanicId } });
      await ActivityLog.create({
        userId: req.user?.userId,
        action: 'Updated Mechanic',
        details: `Super Admin updated mechanic ID ${mechanicId}.`
      });
      return res.json({ message: 'Mechanic updated successfully' });
    } else {
      const request = await MechanicUpdateRequest.create({
        mechanicId,
        updatedData: updateData,
        status: 'Pending Update Approval',
        requestedById: req.user?.userId
      });
      await ActivityLog.create({
        userId: req.user?.userId,
        action: 'Created Update Request',
        details: `Admin requested update for mechanic ID ${mechanicId}.`
      });
      return res.status(201).json({ message: 'Update request submitted', request });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mechanic' });
  }
};

export const deleteMechanic = async (req: AuthRequest, res: Response) => {
  try {
    const mechanicId = parseInt(req.params.id as string, 10);
    const mechanic = await Mechanic.findByPk(mechanicId);
    if (!mechanic) return res.status(404).json({ error: 'Mechanic not found' });
    await mechanic.destroy();
    
    await ActivityLog.create({
      userId: req.user?.userId,
      action: 'Deleted Mechanic',
      details: `Super Admin deleted mechanic ID ${mechanicId}.`
    });

    res.json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mechanic' });
  }
};

export const approveMechanic = async (req: AuthRequest, res: Response) => {
  try {
    const mechanicId = parseInt(req.params.id as string, 10);
    await Mechanic.update({ status: 'Approved', approvedById: req.user?.userId }, { where: { id: mechanicId } });
    
    await ActivityLog.create({
      userId: req.user?.userId,
      action: 'Approved Mechanic',
      details: `Mechanic ID ${mechanicId} was approved.`
    });

    res.json({ message: 'Mechanic approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve mechanic' });
  }
};

export const getUpdateRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await MechanicUpdateRequest.findAll({
      include: [
        { model: Mechanic },
        { model: User, as: 'Requestor', attributes: ['username'] }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch update requests' });
  }
};

export const approveUpdateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.id as string, 10);
    const request = await MechanicUpdateRequest.findByPk(requestId);
    
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.dataValues.status !== 'Pending Update Approval') return res.status(400).json({ error: 'Request already processed' });

    await Mechanic.update(request.dataValues.updatedData, { where: { id: request.dataValues.mechanicId } });
    
    await request.update({ status: 'Approved', reviewedById: req.user?.userId });

    await ActivityLog.create({
      userId: req.user?.userId,
      action: 'Approved Update Request',
      details: `Update request ${requestId} approved and applied to mechanic ID ${request.dataValues.mechanicId}.`
    });

    res.json({ message: 'Update applied successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve update request' });
  }
};

export const rejectUpdateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requestId = parseInt(req.params.id as string, 10);
    await MechanicUpdateRequest.update(
      { status: 'Rejected', reviewedById: req.user?.userId }, 
      { where: { id: requestId } }
    );

    res.json({ message: 'Update request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject update request' });
  }
};
