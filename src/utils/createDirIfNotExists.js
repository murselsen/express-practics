import fs from 'fs/promises';

const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url); // Check if the directory exists
  } catch (error) {
    await fs.mkdir(url, { recursive: true }); // Create the directory if it doesn't exist
  }
};

export default createDirIfNotExists;
