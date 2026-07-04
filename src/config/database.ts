import { Sequelize } from 'sequelize';

const isProduction = process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isProduction ? './database.prod.sqlite' : './database.sqlite',
  logging: false, // Set to console.log to see SQL queries
});
