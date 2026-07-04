import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import { Role, User, VehicleType, ServiceType, Mechanic } from '../models';

const DEFAULT_SERVICES = [
  "Puncture Repair", "Battery Jumpstart", "Battery Replacement", 
  "Engine Diagnostics", "Engine Repair", "Oil Change", "Brake Service", 
  "Clutch Repair", "Chain Adjustment", "Tyre Replacement", 
  "Wheel Alignment", "Wheel Balancing", "Fuel Delivery", 
  "Key Lockout Assistance", "Jump Start", "Towing Services", 
  "Accident Recovery", "Coolant Top-up", "Air Filter Replacement", 
  "Spark Plug Replacement", "Electrical Repair", "AC Repair", 
  "Suspension Repair", "General Service", "Emergency Breakdown"
];

const DEFAULT_VEHICLES = [
  "Bike", "Scooter", "Auto", "Car", "SUV", "Van", "Pickup", 
  "Truck", "Bus", "Tractor", "JCB", "Earth Mover", "Crane", 
  "Electric Bike", "Electric Car"
];

export async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models safely (creates missing tables without dropping)
    await sequelize.sync();
    console.log('Database synced safely.');

    // Seed Vehicles
    for (const v of DEFAULT_VEHICLES) {
      await VehicleType.findOrCreate({ where: { name: v } });
    }

    // Seed Services
    for (const s of DEFAULT_SERVICES) {
      await ServiceType.findOrCreate({ where: { name: s } });
    }

    // Seed Roles
    const [superAdminRole] = await Role.findOrCreate({ where: { name: 'Super Admin' } });
    const [adminRole] = await Role.findOrCreate({ where: { name: 'Admin' } });

    const adminEmail = process.env.SUPERADMIN_USERNAME || 'admin@vehicle.com';
    const adminPassword = process.env.SUPERADMIN_PASSWORD || 'admin123';

    if (!process.env.SUPERADMIN_USERNAME) {
      console.warn('⚠️ SUPERADMIN_USERNAME not found in .env. Using default: admin@vehicle.com');
    }
    
    const superAdminExists = await User.findOne({ where: { username: adminEmail } });
    if (!superAdminExists) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        username: adminEmail,
        email: adminEmail,
        passwordHash,
        roleId: superAdminRole.dataValues.id,
        allowedScreens: ['*']
      });
      console.log('Super Admin seeded successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
