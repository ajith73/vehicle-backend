import { VehicleType, ServiceType, sequelize } from './src/models';

async function run() {
  try {
    console.log('Altering VehicleType and ServiceType tables...');
    await VehicleType.sync({ alter: true });
    await ServiceType.sync({ alter: true });
    console.log('Success');
  } catch (err) {
    console.error('Alter failed', err);
  }
}

run();
