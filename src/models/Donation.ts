import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Donation extends Model {}
Donation.init(
  {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: 'Donation' }
);
