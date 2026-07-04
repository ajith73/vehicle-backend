import { Mechanic, sequelize } from './src/models';

async function run() {
  try {
    console.log('Altering Mechanic table...');
    await Mechanic.sync({ alter: true });
    console.log('Success');
  } catch (err) {
    console.error('Alter failed, dropping and recreating Mechanic table...');
    try {
      await Mechanic.drop();
      await Mechanic.sync();
      console.log('Dropped and recreated successfully');
    } catch (dropErr) {
      console.error(dropErr);
    }
  }
}

run();
