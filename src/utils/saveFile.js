import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';
import { env } from './env.js';

const saveFile = async (file) => {
  const isEnableCloudinary = env('CLOUD_ENABLE');
  if (isEnableCloudinary === 'true') {
    return await saveFileToCloudinary(file);
  }
  return await saveFileToUploadDir(file);
};

export default saveFile;
