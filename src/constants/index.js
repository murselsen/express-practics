import path from 'path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
export const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutes in milliseconds
export const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// User roles
export const ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'CLOUD_API_KEY',
  API_SECRET: 'CLOUD_API_SECRET',
};
