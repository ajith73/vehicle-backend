import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL is not set in environment variables. Please configure it to connect to Supabase.");
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
