import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Mechanic extends Model {}
Mechanic.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    phone: { type: DataTypes.JSON, allowNull: false }, // Array of { number: string, isWhatsapp: boolean }
    emails: { type: DataTypes.JSON, allowNull: true }, // Array of strings
    vehicleTypes: { type: DataTypes.JSON, allowNull: false },
    serviceTypes: { type: DataTypes.JSON, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    operatingDays: { type: DataTypes.JSON, allowNull: true }, // Array of days e.g. ['Monday']
    operatingHours: { type: DataTypes.STRING, allowNull: true }, // e.g. '09:00 - 18:00'
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    image: { type: DataTypes.STRING, allowNull: true },
    websiteUrl: { type: DataTypes.STRING, allowNull: true },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Inactive'),
      defaultValue: 'Pending',
    },
  },
  { sequelize, modelName: 'Mechanic' }
);
