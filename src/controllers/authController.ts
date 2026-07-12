import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';
import { logger } from '../lib/logger';
import { handleControllerError } from '../utils/controller';

const JWT_SECRET = 'supersecret_mvp_key_change_me_in_prod';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRole = (user as any).Role?.name || 'Unknown';
    logger.info('login_successful', { requestId: req.requestId, email, role: userRole });
    
    const token = jwt.sign(
      { userId: user.dataValues.id, role: userRole },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: userRole, email });
  } catch (error: any) {
    handleControllerError(req, res, error, 'Login failed');
  }
};
