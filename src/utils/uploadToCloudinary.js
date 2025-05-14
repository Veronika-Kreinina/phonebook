import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return result.secure_url;
};
