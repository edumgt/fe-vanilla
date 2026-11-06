import path from 'path';

export const ENV = {
  PORT: 3000,
  HOST: '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ROOT: path.resolve(__dirname, '../../..'),
  PUBLIC_DIR: path.resolve(__dirname, '../../../public'),
  INFRA_DIR: path.resolve(__dirname, '../../../infra'),
  MOCK_DIR: path.resolve(__dirname, '../../../public/assets/mock'),
  UPLOAD_DIR: path.resolve(__dirname, '../../../public/uploads'),
  PYTHON_MICROSERVICE_URL: process.env.PYTHON_MICROSERVICE_URL || 'http://localhost:8000',
  JWT_SECRET: process.env.JWT_SECRET || 'edumgt-enterprise-jwt-secret-2026',
};
