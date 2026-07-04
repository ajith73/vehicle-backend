import { sequelize } from '../config/database';
import { Role } from './Role';
import { User } from './User';
import { Mechanic } from './Mechanic';
import { MechanicUpdateRequest } from './MechanicUpdateRequest';
import { Feedback } from './Feedback';
import { Donation } from './Donation';
import { ActivityLog } from './ActivityLog';
import { VehicleType } from './VehicleType';
import { ServiceType } from './ServiceType';

// Relationships
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

User.hasMany(Mechanic, { foreignKey: 'createdById', as: 'CreatedMechanics' });
Mechanic.belongsTo(User, { foreignKey: 'createdById', as: 'Creator' });

User.hasMany(Mechanic, { foreignKey: 'approvedById', as: 'ApprovedMechanics' });
Mechanic.belongsTo(User, { foreignKey: 'approvedById', as: 'Approver' });

Mechanic.hasMany(MechanicUpdateRequest, { foreignKey: 'mechanicId' });
MechanicUpdateRequest.belongsTo(Mechanic, { foreignKey: 'mechanicId' });

User.hasMany(MechanicUpdateRequest, { foreignKey: 'requestedById', as: 'Requestor' });
MechanicUpdateRequest.belongsTo(User, { foreignKey: 'requestedById', as: 'Requestor' });

User.hasMany(MechanicUpdateRequest, { foreignKey: 'reviewedById', as: 'Reviewer' });
MechanicUpdateRequest.belongsTo(User, { foreignKey: 'reviewedById', as: 'Reviewer' });

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

export {
  sequelize,
  Role,
  User,
  Mechanic,
  MechanicUpdateRequest,
  Feedback,
  Donation,
  ActivityLog,
  VehicleType,
  ServiceType,
};
