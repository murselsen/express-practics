import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';

import fs from 'fs/promises';
import path from 'path';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  console.log('Moving file to upload dir:', file, file.path);

  const oldPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const newPath = path.join(UPLOAD_DIR, file.filename);
  await fs.rename(oldPath, newPath);
  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
