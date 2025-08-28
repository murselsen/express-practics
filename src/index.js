// Mongo DB connection
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoDB } from './db/initMongoDB.js';
// Server initialization
import { startServer } from './server.js';
// create temp directory for file uploads
import createDirIfNotExists from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

bootstrap();
