import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class MechanicUpdateRequest extends Model {}
MechanicUpdateRequest.init(
  {
    updatedData: { type: DataTypes.JSON, allowNull: false },
    status: {
      type: DataTypes.ENUM('Pending Update Approval', 'Approved', 'Rejected'),
      defaultValue: 'Pending Update Approval',
    },
  },
  { sequelize, modelName: 'MechanicUpdateRequest' }
);
