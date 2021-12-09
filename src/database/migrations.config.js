const path = require('path');
const dotenv = require('dotenv');

if (!process.env.NODE_ENV) {
    throw new Error('Please set NODE_ENV variable');
}

const environment = process.env.NODE_ENV;
const envFilePath = path.resolve(process.cwd(), `.env.${environment}`);
dotenv.config({
    path: envFilePath,
});

module.exports = {
  "dev": {
    "username": process.env.DB_USER,
    "password": process.env.DB_USER_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "local": {
    "username": process.env.DB_USER,
    "password": process.env.DB_USER_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_USER_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  }
}
