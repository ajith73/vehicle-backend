import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = isProduction ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_LOCAL;

if (!databaseUrl) {
  console.warn(`WARNING: ${isProduction ? 'DATABASE_URL_PROD' : 'DATABASE_URL_LOCAL'} is not set in environment variables.`);
}

export const sequelize = new Sequelize(databaseUrl || '', {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
