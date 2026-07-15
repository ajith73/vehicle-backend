import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecret_mvp_key_change_me_in_prod';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    
    // Lazy-load User to avoid circular dependencies if any
    const { User } = require('../models/User');
    
    User.findByPk(decoded.userId).then((user: any) => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: User does not exist or was deleted' });
      }
      req.user = decoded;
      next();
    }).catch((err: any) => {
      console.error('Error verifying user in auth middleware:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
