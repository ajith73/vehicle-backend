import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {}
User.init(
  {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    refreshToken: { type: DataTypes.STRING, allowNull: true },
    allowedScreens: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  },
  { sequelize, modelName: 'User' }
);
