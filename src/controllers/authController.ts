import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models';

const JWT_SECRET = 'supersecret_mvp_key_change_me_in_prod';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
      where: { username },
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
    console.log('User Role Determined:', userRole);
    
    const token = jwt.sign(
      { userId: user.dataValues.id, role: userRole },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: userRole, username });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
