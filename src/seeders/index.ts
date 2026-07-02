import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import { Role, User } from '../models';

export async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models (use force: false in production)
    await sequelize.sync({ alter: false });
    console.log('Database synced.');

    // Seed Roles
    const [superAdminRole] = await Role.findOrCreate({ where: { name: 'Super Admin' } });
    const [adminRole] = await Role.findOrCreate({ where: { name: 'Admin' } });

    // Seed Super Admin
    const superAdminExists = await User.findOne({ where: { username: 'ajithoffice1999@gmail.com' } });
    if (!superAdminExists) {
      const passwordHash = await bcrypt.hash('123Asd!@#', 10);
      await User.create({
        username: 'ajithoffice1999@gmail.com',
        email: 'ajithoffice1999@gmail.com',
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
